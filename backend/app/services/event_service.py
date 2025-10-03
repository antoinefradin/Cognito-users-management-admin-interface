import logging
from typing import Optional
from uuid import uuid4
from app.repositories.event_repository import (
    store_event,
    get_events_by_date,
)
from app.repositories.models.event_model import (
    EventModel, EventNameEnum, EventTypeEnum, EntityTypeEnum, EventMeta
)

logger = logging.getLogger(__name__)


def create_new_event(
        user_id: str,
        event_date: str,
        event_name: EventNameEnum,
        event_type: EventTypeEnum,
        entity_id: str,
        entity_type: EntityTypeEnum,
        metadata: Optional[dict] = None
    ) -> bool:
    """Create a new event."""
    # Storing event. Internal function - no schema needed.
    try: 
        store_event(
            EventModel(
                id=str(uuid4()),
                event_date=event_date,
                event_name=event_name,
                event_type=event_type,
                entity_type=entity_type,
                entity_id=entity_id,
                user_id=user_id,
                details=metadata,
            )
        )
        return True
    except Exception as e:
        logger.error(f"Failed to create {event_type} event: {e}")
        return False
    

def fetch_all_events(limit: int = 5) -> list[EventMeta]:
    """Find all events.
    The order is descending by `event_date`.
    """
    if limit and (limit < 0 or limit > 100):
        raise ValueError("Limit must be between 0 and 100")

    response = get_events_by_date(limit = limit)

    events = []
    for item in response["Items"]:
        events.append(
            EventMeta(
                id=item["id"],
                event_date=item["event_date"],
                event_type=item["event_type"]
            )
        )
    return events


