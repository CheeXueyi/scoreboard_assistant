from backend.logic.custom_types import SessionScore, SessionState
from backend.logic.helper import generate_random_session_code

class SessionManager:
    def __init__(self):
        self.sessions: dict[str, SessionState] = {}
    
    def create_session(self) -> str:
        'creates a session and returns the associated session code string'
        # first generate unique session_code
        new_code = generate_random_session_code()
        while new_code in self.sessions:
            new_code = generate_random_session_code()
        
        # add the session to memory
        self.sessions[new_code] = {
            'session_code': new_code,
            'score_A': 0,
            'score_B': 0
        }

        return new_code
    
    def update_session_state(self, session_code: str, new_game_state: SessionState):
        'updates the session state of session with given session code'
        if session_code not in self.sessions:
            raise Exception('No session with given session code')
        if new_game_state['session_code'] != session_code:
            raise Exception('New game state\'s session code does not match given session code')

        self.sessions[session_code] = new_game_state

    def get_score(self, session_code: str) -> SessionScore:
        'returns the score for session with given session code'
        if session_code not in self.sessions:
            raise Exception('No session with given session code')
            
        # make session score
        desired_session_state = self.sessions[session_code]
        desired_session_score: SessionScore = {
            'score_A': desired_session_state['score_A'],
            'score_B': desired_session_state['score_B']
        }

        return desired_session_score
    
    def terminate_session(self, session_code: str):
        'terminates a session. removes it from working memory'
        if session_code not in self.sessions:
            raise Exception('No session with given session code')
        
        self.sessions.pop(session_code)