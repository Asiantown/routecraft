from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_optimize():
    req = {
        "stops": [
            {"name": "Home", "lat": 29.7604, "lon": -95.3698},
            {"name": "Trader Joes", "lat": 29.7374, "lon": -95.4189},
            {"name": "UPS", "lat": 29.7420, "lon": -95.3812}
        ]
    }
    resp = client.post("/optimize", json=req)
    assert resp.status_code == 200
    data = resp.json()
    assert set(data["order"]) == {0,1,2}
    assert data["total_minutes"] == 34
    assert data["return_to_start"] is True
