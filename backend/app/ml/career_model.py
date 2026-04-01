import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle

# Load dataset
df = pd.read_csv("career_data.csv")

X = df.drop("career", axis=1)
y = df["career"]

# Train model
model = RandomForestClassifier(
    n_estimators=150,
    max_depth=10,
    class_weight="balanced", 
    random_state=42
)
model.fit(X, y)

# Save model
pickle.dump(model, open("career_model.pkl", "wb"))

print("✅ Model trained & saved successfully")