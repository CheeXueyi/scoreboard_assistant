from ..logic.session_manager import SessionManager
from ..logic.custom_types import *
import pytest

class TestSessionCreation:
    def test_create_session(self):
        # create session manager
        manager = SessionManager()
        session_code = manager.create_session()
        # check that getting the score works
        manager.get_score(session_code)

    def test_get_score_and_update_score(self):
        manager = SessionManager()
        session_code = manager.create_session()
        score = manager.get_score(session_code)
        assert score['score_A'] == 0
        assert score['score_B'] == 0
        # update the score
        new_session_state = SessionState(
            session_code=session_code,
            score_A=10,
            score_B=2
        )
        manager.update_session_state(session_code, new_game_state=new_session_state)
        # check that score is updated
        score = manager.get_score(session_code)
        assert score['score_A'] == 10
        assert score['score_B'] == 2

    def test_terminate_session(self):
        manager = SessionManager()
        session_code = manager.create_session()
        # check that session has been created
        manager.get_score(session_code)
        manager.terminate_session(session_code)
        # check that session has been terminated
        with pytest.raises(Exception):
            manager.get_score(session_code)
