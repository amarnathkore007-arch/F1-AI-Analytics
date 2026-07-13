import joblib
import pandas as pd

# Load trained model
model = joblib.load("models/race_winner_model.pkl")

def predict_winner(driverId, constructorId, grid, year, points):

    data = pd.DataFrame([{
        "driverId": driverId,
        "constructorId": constructorId,
        "grid": grid,
        "year": year,
        "points": points
    }])

    prediction = model.predict(data)[0]
    probability = model.predict_proba(data)[0][1]

    return {
        "winner_prediction": int(prediction),
        "confidence": float(round(probability * 100, 2))    
        }


if __name__ == "__main__":

    result = predict_winner(
        driverId=1,
        constructorId=1,
        grid=1,
        year=2026,
        points=250
    )

    print(result)