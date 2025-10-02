from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

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

class EventModel(BaseModel):
    id: str = Field(..., description="Company id"),
    event_date: str = Field(..., description="Creation date (YYYY-MM-DD)"),
    event_name: EventNameEnum = Field(..., description="Event name"), 
    event_type: EventTypeEnum = Field(..., description="Event type"), 
    event_source: Optional[str] = Field(None, description="Event source"),
    event_source_arn: Optional[str] = Field(None, description="Event source ARN"),
    entity_type: EntityTypeEnum = Field(..., description="Entity id"),
    entity_id: str = Field(..., description="Entity id"),
    user_id: str = Field(..., description="Cognito User id"),
    details: Optional[dict] = Field(None, description="Event details"),



# class EventMeta(BaseModel):
#     id: str = Field(..., description="Company id")
#     name: str = Field(..., description="Company name")
#     industry: Optional[IndustryEnum] = Field(None, description="Industry sector")
    
#     website: Optional[str] = Field(None, description="Company website")
#     status: EnterpriseStatusEnum = Field(default=EnterpriseStatusEnum.ACTIVE, description="Enterprise status")
#     subscription_tier: SubscriptionTierEnum = Field(default=SubscriptionTierEnum.BASIC, description="Subscription tier")
#     max_licenses: int = Field(..., description="Maximum number of licenses allowed")
#     used_licenses: int = Field(default=0, ge=0, description="Currently used licenses")

#     contract_end_date: Optional[str] = Field(None, description="Contract end date (YYYY-MM-DD)")
#     monthly_revenue: Optional[int] = Field(default=0, ge=0, description="Monthly revenue from this enterprise")