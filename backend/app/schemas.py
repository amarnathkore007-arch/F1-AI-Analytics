from pydantic import BaseModel


class PredictRequest(BaseModel):
    driverId: int
    constructorId: int
    grid: int
    year: int
    points: float