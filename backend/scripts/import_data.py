import pandas as pd
from app.services.mysql_connection import engine

files = [
    "drivers",
    "constructors",
    "races",
    "results",
    "circuits",
    "driver_standings",
    "constructor_standings",
]

for file in files:
    print(f"Importing {file}...")

    df = pd.read_csv(f"data/{file}.csv")

    df.to_sql(
        name=file,
        con=engine,
        if_exists="replace",
        index=False
    )

print("✅ All datasets imported successfully!")