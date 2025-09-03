
from datetime import datetime, timezone

def get_current_time():
    # Get current time as datetime timezone-aware
    return str(datetime.now(timezone.utc).isoformat())