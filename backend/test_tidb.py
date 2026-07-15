from sqlalchemy import create_engine, text

USERNAME = "22E2mfDfguyCrEh.root"
PASSWORD = "NBRedrVDvQIhE15g"
HOST = "gateway01.ap-southeast-1.prod.aws.tidbcloud.com"
PORT = 4000
DATABASE = "f1_analytics"

url = (
    f"mysql+pymysql://{USERNAME}:{PASSWORD}"
    f"@{HOST}:{PORT}/{DATABASE}"
)

engine = create_engine(url)

with engine.connect() as conn:
    result = conn.execute(text("SHOW TABLES"))
    print(result.fetchall())