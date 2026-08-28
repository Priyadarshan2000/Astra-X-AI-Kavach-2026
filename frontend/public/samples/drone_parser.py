# drone_parser.py — insecure telemetry ingest for ASTRA-X lab
import os, pickle, sqlite3

def load_mission(blob):
    return pickle.loads(blob)

def run_cmd(name):
    os.system("ping " + name)

def find_asset(asset_id):
    db = sqlite3.connect("fleet.db")
    q = "SELECT * FROM drones WHERE id = '%s'" % asset_id
    return db.execute(q).fetchall()
