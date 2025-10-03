from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

from app.routes.schemas.event_schema import (
    EventNameEnum,
    EventTypeEnum,
    EntityTypeEnum
)

class EventModel(BaseModel):
    id: str = Field(..., description="Event id")
    event_date: str = Field(..., description="Creation date (YYYY-MM-DD)")
    event_name: EventNameEnum = Field(..., description="Event name")
    event_type: EventTypeEnum = Field(..., description="Event type") 
    event_source: Optional[str] = Field(None, description="Event source")
    event_source_arn: Optional[str] = Field(None, description="Event source ARN")
    entity_type: EntityTypeEnum = Field(..., description="Entity id")
    entity_id: str = Field(..., description="Entity id")
    user_id: str = Field(..., description="Cognito User id")
    details: Optional[dict] = Field(None, description="Event details")


class EventMeta(BaseModel):
    id: str = Field(..., description="Event id")
    event_date: str = Field(..., description="Creation date (YYYY-MM-DD)")
    event_type: EventTypeEnum = Field(..., description="Event type") 
    details: Optional[dict] = Field(None, description="Event details")