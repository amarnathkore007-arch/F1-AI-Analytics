from sqlalchemy import text
import pandas as pd

from app.database import SessionLocal


def load_training_data():

    db = SessionLocal()

    query = text("""
        SELECT
            r.raceId,
            ra.year,
            ra.name AS race_name,
            d.driverId,
            d.forename,
            d.surname,
            c.constructorId,
            c.name AS constructor,
            r.grid,
            r.position,
            r.points
        FROM results r
        JOIN drivers d
            ON r.driverId = d.driverId
        JOIN constructors c
            ON r.constructorId = c.constructorId
        JOIN races ra
            ON r.raceId = ra.raceId
    """)

    df = pd.read_sql(query, db.bind)

    db.close()

    return df


if __name__ == "__main__":

    df = load_training_data()

    # Create target column
    df["winner"] = (df["position"] == "1").astype(int)

    # Keep only useful columns
    ml_data = df[
        [
            "driverId",
            "constructorId",
            "grid",
            "year",
            "points",
            "winner"
        ]
    ]
    # Replace missing values represented as \N
    ml_data = ml_data.replace("\\N", 0)
    ml_data = ml_data.replace(r"\N", 0, regex=False)

    # Convert columns to numeric
    for col in ["driverId", "constructorId", "grid", "year", "points"]:
        ml_data[col] = pd.to_numeric(ml_data[col], errors="coerce")

    ml_data = ml_data.fillna(0)

    # Save dataset
    ml_data.to_csv("data/ml_dataset.csv", index=False)

    print("✅ ML Dataset Saved!")