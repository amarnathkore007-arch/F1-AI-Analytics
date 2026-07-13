from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import get_db
from app.schemas import PredictRequest
from app.services.data_loader import drivers_df
from ml.predict import predict_winner

router = APIRouter()


# ==========================
# DRIVERS
# ==========================

@router.get("/drivers")
def get_drivers(db: Session = Depends(get_db)):

    query = text("""
        SELECT
            driverId,
            CONCAT(forename,' ',surname) AS name
        FROM drivers
        ORDER BY name
    """)

    result = db.execute(query)

    return [
        {
            "driverId": row.driverId,
            "name": row.name
        }
        for row in result
    ]


@router.get("/drivers/search")
def search_driver(
    name: str = Query(...),
    db: Session = Depends(get_db)
):

    query = text("""
        SELECT
            driverId,
            CONCAT(forename,' ',surname) AS name,
            nationality
        FROM drivers
        WHERE forename LIKE :name
           OR surname LIKE :name
        ORDER BY name
        LIMIT 20
    """)

    result = db.execute(query, {"name": f"%{name}%"})

    return [
        {
            "driverId": row.driverId,
            "name": row.name,
            "nationality": row.nationality
        }
        for row in result
    ]


@router.get("/drivers/{driver_id}")
def get_driver(driver_id: int):

    driver = drivers_df[drivers_df["driverId"] == driver_id]

    if driver.empty:
        return {"message": "Driver not found"}

    return driver.to_dict(orient="records")[0]


# ==========================
# CONSTRUCTORS
# ==========================

@router.get("/constructors")
def get_constructors(db: Session = Depends(get_db)):

    query = text("""
        SELECT
            constructorId,
            name
        FROM constructors
        ORDER BY name
    """)

    result = db.execute(query)

    return [
        {
            "constructorId": row.constructorId,
            "name": row.name
        }
        for row in result
    ]


# ==========================
# RACES
# ==========================

@router.get("/races")
def get_races(db: Session = Depends(get_db)):

    query = text("""
        SELECT
            raceId,
            year,
            round,
            name,
            date
        FROM races
        ORDER BY year DESC
        LIMIT 100
    """)

    result = db.execute(query)

    return [
        {
            "raceId": row.raceId,
            "year": row.year,
            "round": row.round,
            "name": row.name,
            "date": str(row.date)
        }
        for row in result
    ]


# ==========================
# RESULTS
# ==========================

@router.get("/results")
def get_results(db: Session = Depends(get_db)):

    query = text("""
        SELECT
            resultId,
            raceId,
            driverId,
            constructorId,
            grid,
            position,
            points
        FROM results
        LIMIT 100
    """)

    result = db.execute(query)

    return [
        {
            "resultId": row.resultId,
            "raceId": row.raceId,
            "driverId": row.driverId,
            "constructorId": row.constructorId,
            "grid": row.grid,
            "position": row.position,
            "points": row.points
        }
        for row in result
    ]


# ==========================
# PREDICTION
# ==========================

@router.post("/predict")
def predict_race(data: PredictRequest):

    return predict_winner(
        driverId=data.driverId,
        constructorId=data.constructorId,
        grid=data.grid,
        year=data.year,
        points=data.points
    )


# ==========================
# ANALYTICS
# ==========================

@router.get("/analytics/top-drivers")
def top_drivers(db: Session = Depends(get_db)):

    query = text("""
        SELECT
            d.driverId,
            d.forename,
            d.surname,
            SUM(r.points) AS total_points
        FROM drivers d
        JOIN results r
        ON d.driverId = r.driverId
        GROUP BY d.driverId,d.forename,d.surname
        ORDER BY total_points DESC
        LIMIT 10
    """)

    result = db.execute(query)

    return [
        {
            "driverId": row.driverId,
            "name": f"{row.forename} {row.surname}",
            "total_points": float(row.total_points)
        }
        for row in result
    ]


@router.get("/analytics/top-constructors")
def top_constructors(db: Session = Depends(get_db)):

    query = text("""
        SELECT
            c.constructorId,
            c.name,
            SUM(r.points) AS total_points
        FROM constructors c
        JOIN results r
        ON c.constructorId = r.constructorId
        GROUP BY c.constructorId,c.name
        ORDER BY total_points DESC
        LIMIT 10
    """)

    result = db.execute(query)

    return [
        {
            "constructorId": row.constructorId,
            "name": row.name,
            "total_points": float(row.total_points)
        }
        for row in result
    ]


@router.get("/analytics/most-race-wins")
def most_race_wins(db: Session = Depends(get_db)):

    query = text("""
        SELECT
            d.driverId,
            d.forename,
            d.surname,
            COUNT(*) AS wins
        FROM drivers d
        JOIN results r
        ON d.driverId = r.driverId
        WHERE r.position='1'
        GROUP BY d.driverId,d.forename,d.surname
        ORDER BY wins DESC
        LIMIT 10
    """)

    result = db.execute(query)

    return [
        {
            "driverId": row.driverId,
            "name": f"{row.forename} {row.surname}",
            "wins": row.wins
        }
        for row in result
    ]


@router.get("/analytics/driver/{driver_id}/stats")
def driver_stats(driver_id: int, db: Session = Depends(get_db)):

    query = text("""
        SELECT
            d.driverId,
            d.forename,
            d.surname,
            COUNT(r.resultId) AS total_races,
            SUM(CASE WHEN r.position='1' THEN 1 ELSE 0 END) AS wins,
            AVG(r.points) AS avg_points,
            SUM(r.points) AS total_points
        FROM drivers d
        JOIN results r
        ON d.driverId=r.driverId
        WHERE d.driverId=:driver_id
        GROUP BY d.driverId,d.forename,d.surname
    """)

    row = db.execute(query, {"driver_id": driver_id}).fetchone()

    if row is None:
        return {"message": "Driver not found"}

    return {
        "driverId": row.driverId,
        "name": f"{row.forename} {row.surname}",
        "total_races": row.total_races,
        "wins": row.wins,
        "average_points": round(float(row.avg_points), 2),
        "total_points": float(row.total_points)
    }


@router.get("/analytics/season-standings")
def season_standings(db: Session = Depends(get_db)):

    query = text("""
        SELECT
            d.driverId,
            d.forename,
            d.surname,
            SUM(r.points) AS total_points
        FROM drivers d
        JOIN results r
        ON d.driverId=r.driverId
        GROUP BY d.driverId,d.forename,d.surname
        ORDER BY total_points DESC
        LIMIT 20
    """)

    result = db.execute(query)

    standings = []

    position = 1

    for row in result:
        standings.append({
            "position": position,
            "driverId": row.driverId,
            "name": f"{row.forename} {row.surname}",
            "points": float(row.total_points)
        })
        position += 1

    return standings