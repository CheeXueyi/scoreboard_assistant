# Design document
This document outlines the design for the logic of the scoreboard assistant.

## functions required (user perspective)
**`create_session(): string`** 
- creates a session and returns the session code string

**`update_session_state(string session_code, SessionState session_state)`**
- Updates the scoreboard for session associated with given session code.
- Raises exception if error occured

**`get_score(string session_code): SessionScore`**
- returns the scores of the session with given session code.
- Raises exception if error occured

**`terminate_session(string session_code)`**
- Terminates an active session.
- Raises exception if error occured.