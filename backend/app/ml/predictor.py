from sklearn.linear_model import LinearRegression
import numpy as np

def predict_final_score(scores: list):
    if len(scores) < 2:
        return scores[-1] if scores else 0

    X = np.array(range(len(scores))).reshape(-1, 1)
    y = np.array(scores)

    model = LinearRegression()
    model.fit(X, y)

    next_test = np.array([[len(scores)]])
    prediction = model.predict(next_test)

    return float(prediction[0])