# 🌸 Iris Flower AI Classifier

A sleek Machine Learning web application built with **Scikit-Learn**, **Flask**, **HTML5/Vanilla CSS/JavaScript**, ready for seamless 1-click deployment to **Render.com**.

---

## 🚀 Features

- **Machine Learning Model**: Random Forest Classifier trained on the Iris dataset (features: Sepal Length, Sepal Width, Petal Length, Petal Width).
- **Interactive UI**: Dark glassmorphic design, dual sliders + numeric inputs, instant preset buttons, and live probability animations.
- **RESTful API**: `POST /api/predict` and `GET /health`.
- **Render Ready**: Includes `Procfile`, `render.yaml`, `requirements.txt`, and standard port binding.

---

## 🛠️ Local Development

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Train the model** (optional, model is pre-saved or generated on launch):
   ```bash
   python train_model.py
   ```

3. **Start the Flask server**:
   ```bash
   python app.py
   ```
   Open [http://localhost:5000](http://localhost:5000) in your browser.

---

## ☁️ Deploying to Render.com

### Option A: Via GitHub (Recommended)
1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial Iris ML Web App"
   git branch -M main
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git push -u origin main
   ```
2. Log in to [dashboard.render.com](https://dashboard.render.com).
3. Click **New +** > **Web Service**.
4. Connect your GitHub repository.
5. Render will automatically detect the settings:
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
6. Click **Deploy Web Service**!

### Option B: Render Blueprint (Infrastructure as Code)
Since `render.yaml` is included, you can click **New +** > **Blueprint** on Render and select your repository to auto-configure everything.
