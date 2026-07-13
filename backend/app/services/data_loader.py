from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"

drivers_df = pd.read_csv(DATA_DIR / "drivers.csv")
constructors_df = pd.read_csv(DATA_DIR / "constructors.csv")
races_df = pd.read_csv(DATA_DIR / "races.csv")
results_df = pd.read_csv(DATA_DIR / "results.csv")