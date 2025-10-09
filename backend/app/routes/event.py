from typing import Literal
from fastapi import APIRouter, Request, Depends, HTTPException, Query, BackgroundTasks
import logging

from app.dependencies import check_creating_license_enterprise_allowed, check_admin
from app.user import User

from app.routes.schemas.event_schema import (
    EventMetaOutput,
)
from app.services.event_service import (
     fetch_all_events,
)


logger = logging.getLogger(__name__)



router = APIRouter(tags=["event"])


@router.get("/event", response_model=list[EventMetaOutput])
def get_all_events(
    request: Request,
    limit: int | None = None,
    # check_admin_permissions=Depends(check_admin),
):
    """Get all events. The order is descending by `event_date`.
    - If `limit` is specified, only the first n events will be returned.
    """
    logger.info(" GET /event ###########")

    events = []
    events = fetch_all_events(limit=limit)

    output = [
        EventMetaOutput(
            id=event.id,
            event_date=event.event_date,
            event_type=event.event_type,
        )
        for event in events
    ]
    logger.info(f"get_all_events - GET /event output: {output}")
    return output





