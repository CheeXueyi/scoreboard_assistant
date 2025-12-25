from typing import TypedDict

class SessionState(TypedDict):
    session_code: str
    score_A: int
    score_B: int

class SessionScore(TypedDict):
    score_A: int
    score_B: int