import pymysql
from pymysql.constants import CLIENT

# ==========================
# CHANGE THESE TWO VALUES
# ==========================

LOCAL_MYSQL_PASSWORD = "amar2627"

TIDB_PASSWORD = "NBRedrVDvQIhE15g"

# ==========================
# CONNECTIONS
# ==========================

local_conn = pymysql.connect(
    host="localhost",
    user="root",
    password=LOCAL_MYSQL_PASSWORD,
    database="f1_analytics",
    charset="utf8mb4",
    cursorclass=pymysql.cursors.Cursor,
)

tidb_conn = pymysql.connect(
    host="gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
    port=4000,
    user="22E2mfDfguyCrEh.root",
    password=TIDB_PASSWORD,
    database="f1_analytics",
    charset="utf8mb4",
    client_flag=CLIENT.MULTI_STATEMENTS,
    ssl={"ssl": {}},
)

local = local_conn.cursor()
tidb = tidb_conn.cursor()

# ==========================
# CREATE TABLES
# ==========================

schema = [

"""
CREATE TABLE IF NOT EXISTS circuits(
circuitId BIGINT,
circuitRef TEXT,
name TEXT,
location TEXT,
country TEXT,
lat DOUBLE,
lng DOUBLE,
alt BIGINT,
url TEXT
)
""",

"""
CREATE TABLE IF NOT EXISTS constructors(
constructorId BIGINT,
constructorRef TEXT,
name TEXT,
nationality TEXT,
url TEXT
)
""",

"""
CREATE TABLE IF NOT EXISTS constructor_standings(
constructorStandingsId BIGINT,
raceId BIGINT,
constructorId BIGINT,
points DOUBLE,
position TEXT,
positionText TEXT,
wins BIGINT
)
""",

"""
CREATE TABLE IF NOT EXISTS drivers(
driverId BIGINT,
driverRef TEXT,
number TEXT,
code TEXT,
forename TEXT,
surname TEXT,
dob TEXT,
nationality TEXT,
url TEXT
)
""",

"""
CREATE TABLE IF NOT EXISTS driver_standings(
driverStandingsId BIGINT,
raceId BIGINT,
driverId BIGINT,
points DOUBLE,
position TEXT,
positionText TEXT,
wins BIGINT
)
""",

"""
CREATE TABLE IF NOT EXISTS races(
raceId BIGINT,
year BIGINT,
round BIGINT,
circuitId BIGINT,
name TEXT,
date TEXT,
time TEXT,
url TEXT,
fp1_date TEXT,
fp1_time TEXT,
fp2_date TEXT,
fp2_time TEXT,
fp3_date TEXT,
fp3_time TEXT,
quali_date TEXT,
quali_time TEXT,
sprint_date TEXT,
sprint_time TEXT
)
""",

"""
CREATE TABLE IF NOT EXISTS results(
resultId BIGINT,
raceId BIGINT,
driverId BIGINT,
constructorId BIGINT,
number TEXT,
grid TEXT,
position TEXT,
positionText TEXT,
positionOrder BIGINT,
points DOUBLE,
laps BIGINT,
time TEXT,
milliseconds TEXT,
fastestLap TEXT,
`rank` TEXT,
fastestLapTime TEXT,
fastestLapSpeed TEXT,
statusId BIGINT
)
"""

]

print("Creating tables...")

for sql in schema:
    tidb.execute(sql)

tidb_conn.commit()

tables = [
    "circuits",
    "constructors",
    "constructor_standings",
    "drivers",
    "driver_standings",
    "races",
    "results",
]

print("\nStarting migration...\n")

for table in tables:

    print(f"Migrating {table}")

    tidb.execute(f"DELETE FROM {table}")
    tidb_conn.commit()

    local.execute(f"SELECT * FROM {table}")
    rows = local.fetchall()

    if len(rows) == 0:
        print("No rows\n")
        continue

    placeholders = ",".join(["%s"] * len(rows[0]))

    sql = f"INSERT INTO {table} VALUES ({placeholders})"

    tidb.executemany(sql, rows)
    tidb_conn.commit()

    print(f"Inserted {len(rows)} rows\n")

print("===================================")
print("Migration Completed Successfully!")
print("===================================")

for table in tables:
    tidb.execute(f"SELECT COUNT(*) FROM {table}")
    count = tidb.fetchone()[0]
    print(table, count)

local.close()
tidb.close()

local_conn.close()
tidb_conn.close()