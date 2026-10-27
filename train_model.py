import joblib
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

def train():
    # Load dataset
    iris = load_iris()
    X = iris.data
    y = iris.target
    feature_names = iris.feature_names
    target_names = iris.target_names

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Train Random Forest model
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)

    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model trained successfully! Test Accuracy: {accuracy * 100:.2f}%")

    # Save model and metadata
    data = {
        "model": clf,
        "feature_names": feature_names,
        "target_names": target_names.tolist()
    }
    joblib.dump(data, "model.joblib")
    print("Model saved to model.joblib")

if __name__ == "__main__":
    train()
