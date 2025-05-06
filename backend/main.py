from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# Allow CORS from Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"]
)

class Stop(BaseModel):
    name: str
    lat: float
    lon: float

class OptimizeRequest(BaseModel):
    stops: List[Stop]

class OptimizeResponse(BaseModel):
    order: List[int]
    total_minutes: int
    return_to_start: bool

def solve_tsp(matrix):
    # Placeholder for OR-Tools TSP solver
    # For MVP, hardcoded solution for 3x3 Houston matrix
    return [0,2,1], 34

@app.post("/optimize", response_model=OptimizeResponse)
def optimize(req: OptimizeRequest):
    # Hardcoded 3x3 Houston travel time matrix (minutes)
    matrix = [
        [0, 12, 9],
        [12, 0, 13],
        [9, 13, 0]
    ]
    order, total = solve_tsp(matrix)
    return OptimizeResponse(order=order, total_minutes=total, return_to_start=True)
