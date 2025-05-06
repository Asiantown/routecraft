# RouteCraft Backend

[![Backend Tests](https://github.com/Asiantown/routecraft/actions/workflows/backend.yml/badge.svg)](https://github.com/Asiantown/routecraft/actions/workflows/backend.yml)

- FastAPI 0.111
- Hardcoded Houston 3x3 matrix for MVP
- /optimize endpoint (see data contract)
- Test: pytest test_main.py

To run locally:
```sh
pip install -r requirements.txt
uvicorn main:app --reload
```
