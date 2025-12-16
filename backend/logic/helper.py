from typing import Iterable
import random
import string

CHARS = string.ascii_uppercase + string.digits

def generate_random_session_code() -> str:
    'generate random 6 length alphanumeric string'
    return ''.join(random.choices(CHARS, k=6))

        

