import os
import joblib
import numpy as np
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Model path
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.joblib")

# Ensure model exists or train on the fly if needed
if not os.path.exists(MODEL_PATH):
    import train_model
    train_model.train()

model_bundle = joblib.load(MODEL_PATH)
model = model_bundle["model"]
feature_names = model_bundle["feature_names"]
target_names = model_bundle["target_names"]

# Species characteristics & descriptions for richer UX
SPECIES_INFO = {
    "setosa": {
        "display_name": "Iris Setosa",
        "description": "Known for small, narrow petals and wide sepals. Native to the Arctic and subarctic regions.",
        "badge_color": "#10b981", # emerald
        "petal_ratio": "Small petals relative to sepals"
    },
    "versicolor": {
        "display_name": "Iris Versicolor",
        "description": "Often called Blue Flag iris. Features moderate-length petals and sepals with violet-blue flowers.",
        "badge_color": "#6366f1", # indigo
        "petal_ratio": "Balanced intermediate proportions"
    },
    "virginica": {
        "display_name": "Iris Virginica",
        "description": "Virginia Iris. Noted for larger, elongated petals and robust stems, native to eastern North America.",
        "badge_color": "#ec4899", # pink/rose
        "petal_ratio": "Longest petals and robust sepals"
    }
}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json(force=True)
        sepal_length = float(data.get("sepal_length"))
        sepal_width = float(data.get("sepal_width"))
        petal_length = float(data.get("petal_length"))
        petal_width = float(data.get("petal_width"))

        # Validation
        for val, name in [(sepal_length, "Sepal Length"), (sepal_width, "Sepal Width"), 
                          (petal_length, "Petal Length"), (petal_width, "Petal Width")]:
            if val < 0.1 or val > 15.0:
                return jsonify({"error": f"{name} must be between 0.1 and 15.0 cm"}), 400

        input_features = np.array([[sepal_length, sepal_width, petal_length, petal_width]])
        prediction_idx = int(model.predict(input_features)[0])
        predicted_class = target_names[prediction_idx]

        # Probabilities
        probabilities = model.predict_proba(input_features)[0]
        prob_breakdown = {
            target_names[i]: round(float(probabilities[i]) * 100, 2)
            for i in range(len(target_names))
        }

        info = SPECIES_INFO.get(predicted_class, {
            "display_name": predicted_class.capitalize(),
            "description": "Species predicted by the model.",
            "badge_color": "#6366f1",
            "petal_ratio": "Standard"
        })

        return jsonify({
            "status": "success",
            "prediction": predicted_class,
            "display_name": info["display_name"],
            "description": info["description"],
            "badge_color": info["badge_color"],
            "petal_ratio": info["petal_ratio"],
            "confidence": prob_breakdown[predicted_class],
            "probabilities": prob_breakdown,
            "inputs": {
                "sepal_length": sepal_length,
                "sepal_width": sepal_width,
                "petal_length": petal_length,
                "petal_width": petal_width
            }
        })
    except (ValueError, TypeError) as e:
        return jsonify({"error": "Invalid numerical values provided."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health")
def health():
    return jsonify({"status": "healthy", "service": "iris-classifier"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
