from __future__ import annotations
from typing import TYPE_CHECKING, Literal, Optional
from pydantic import Field, root_validator, validator, EmailStr
from enum import Enum
from app.routes.schemas.base import BaseSchema


class EventNameEnum(str, Enum):
    MODIFY = "MODIFY"
    INSERT = "INSERT"
    REMOVE = "REMOVE"

class EventTypeEnum(str, Enum):
    ENTERPRISE_CREATED = "ENTERPRISE_CREATED"
    ENTERPRISE_DELETED = "ENTERPRISE_DELETED"
    ENTERPRISE_UPDATED = "ENTERPRISE_UPDATED"
    LICENSE_CREATED = "LICENSE_CREATED"
    LICENSE_DELETED = "LICENSE_DELETED"
    LICENSE_UPDATED = "ENTERPRISE_UPDATED"

class EntityTypeEnum(str, Enum):
    ENTERPRISE = "ENTERPRISE"
    LICENSE = "LICENSE"



class EventMetaOutput(BaseSchema):
    id: str = Field(..., description="Event id")
    event_date: str = Field(..., description="Creation date (YYYY-MM-DD)")
    event_type: EventTypeEnum = Field(..., description="Event type") 
   








