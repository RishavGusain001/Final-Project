import pandas as pd
import pickle
import re
import nltk

from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# Download stopwords (run once)
nltk.download("stopwords")

STOPWORDS = set(stopwords.words("english"))

# 🔹 Correct dataset path (IMPORTANT)
DATA_PATH = r"C:\Users\Rishav\Desktop\major\AI-Career-Platform\database\Resume.csv"


def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^a-zA-Z ]", " ", text)
    text = " ".join([word for word in text.split() if word not in STOPWORDS])
    return text


# 🔹 Load dataset
df = pd.read_csv(DATA_PATH)

# Check columns (VERY IMPORTANT)
print("Columns:", df.columns)

# Use correct column names
X = df["Resume_str"]
y = df["Category"]

# Clean text
X = X.apply(clean_text)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 🔥 BEST MODEL PIPELINE
model_pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(
        max_features=10000,
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.9
    )),
    ("clf", LinearSVC(C=1.5))
])

# Train
model_pipeline.fit(X_train, y_train)

# Evaluate
y_pred = model_pipeline.predict(X_test)

print("\n✅ Accuracy:", accuracy_score(y_test, y_pred))
print("\n📊 Classification Report:\n", classification_report(y_test, y_pred))

# Save model
pickle.dump(model_pipeline, open("resume_model.pkl", "wb"))

print("\n🔥 Model saved as resume_model.pkl")