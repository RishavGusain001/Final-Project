import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle

# Load dataset
df = pd.read_csv("career_data.csv")

X = df.drop("career", axis=1)
y = df["career"]

# Train model
model = RandomForestClassifier(
    n_estimators=200,       # slightly more trees for stability
    max_depth=12,           # allow deeper splits for nuance
    class_weight="balanced",
    random_state=42
)
model.fit(X, y)

# Save model
pickle.dump(model, open("career_model.pkl", "wb"))
print("✅ Model trained & saved successfully")

# --- Prediction Function ---
def recommend_careers(student_input, top_n=3):
    """
    student_input: list of feature values [python, java, ml, sql, web_dev, interest, cgpa, projects]
    top_n: number of top careers to return
    """
    probs = model.predict_proba([student_input])[0]
    classes = model.classes_
    
    # Get top N indices sorted by probability
    top_indices = probs.argsort()[-top_n:][::-1]
    
    recommendations = []
    for idx in top_indices:
        recommendations.append({
            "career": classes[idx],
            "compatibility_score": round(probs[idx]*100, 2)  # percentage
        })
    return recommendations

# Example usage
sample_student = [1, 0, 1, 0, 0, 1, 8.5, 4]  # Python+ML student with good CGPA
print("🔮 Career Recommendations:", recommend_careers(sample_student))
