from __future__ import annotations

from typing import TYPE_CHECKING, Literal, Optional

from app.routes.schemas.base import BaseSchema

from pydantic import Field, root_validator, validator, EmailStr

from datetime import datetime
from enum import Enum

class IndustryEnum(str, Enum):
    TECHNOLOGY = "technology"
    HEALTHCARE = "healthcare"
    FINANCE = "finance"
    RETAIL = "retail"
    MANUFACTURING = "manufacturing"
    EDUCATION = "education"
    CONSULTING = "consulting"
    OTHER = "other"

class CompanySizeEnum(str, Enum):
    STARTUP = "startup"
    SMALL = "small"
    MEDIUM = "medium"
    LARGE = "large"
    ENTERPRISE = "enterprise"

class EnterpriseStatusEnum(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    TRIAL = "trial"
    SUSPENDED = "suspended"

class SubscriptionTierEnum(str, Enum):
    BASIC = "basic"
    PRIVATE = "private"



class EnterpriseInput(BaseSchema):
    id: str = Field(..., description="Company id")
    name: str = Field(..., description="Company name")
    industry: Optional[IndustryEnum] = Field(None, description="Industry sector")
    size: Optional[CompanySizeEnum] = Field(None, description="Company size")
    contact_email: EmailStr = Field(..., description="Primary contact email")
    contact_phone: Optional[str] = Field(None, description="Contact phone number")
    address: Optional[str] = Field(None, description="Company address")
    website: Optional[str] = Field(None, description="Company website")
    status: EnterpriseStatusEnum = Field(default=EnterpriseStatusEnum.ACTIVE, description="Enterprise status")
    subscription_tier: SubscriptionTierEnum = Field(default=SubscriptionTierEnum.BASIC, description="Subscription tier")
    max_licenses: int = Field(..., ge=1, description="Maximum number of licenses allowed")
    used_licenses: int = Field(default=0, ge=0, description="Currently used licenses")
    contract_start_date: datetime = Field(..., description="Contract start date (YYYY-MM-DD)")
    contract_end_date: Optional[datetime] = Field(None, description="Contract end date (YYYY-MM-DD)")
    monthly_revenue: Optional[float] = Field(default=0, ge=0, description="Monthly revenue from this enterprise")
    
    @validator('website')
    def validate_website(cls, v):
        if v and not (v.startswith('http://') or v.startswith('https://')):
            raise ValueError('Website must be a valid URI starting with http:// or https://')
        return v
    
    @validator('used_licenses')
    def validate_used_licenses(cls, v, values):
        if 'max_licenses' in values and v > values['max_licenses']:
            raise ValueError('Used licenses cannot exceed max licenses')
        return v
    
    @validator('contract_end_date')
    def validate_contract_dates(cls, v, values):
        if v and 'contract_start_date' in values and values['contract_start_date']:
            if v <= values['contract_start_date']:
                raise ValueError('Contract end date must be after start date')
        return v
    


class EnterpriseUpdate(BaseSchema):
    name: Optional[str] = Field(None, description="Company name")
    industry: Optional[IndustryEnum] = Field(None, description="Industry sector")
    size: Optional[CompanySizeEnum] = Field(None, description="Company size")
    contact_email: Optional[EmailStr] = Field(None, description="Primary contact email")
    contact_phone: Optional[str] = Field(None, description="Contact phone number")
    address: Optional[str] = Field(None, description="Company address")
    website: Optional[str] = Field(None, description="Company website")
    status: Optional[EnterpriseStatusEnum] = Field(None, description="Enterprise status")
    subscription_tier: Optional[SubscriptionTierEnum] = Field(None, description="Subscription tier")
    max_licenses: Optional[int] = Field(None, ge=1, description="Maximum number of licenses allowed")
    used_licenses: Optional[int] = Field(None, ge=0, description="Currently used licenses")
    contract_start_date: Optional[datetime] = Field(None, description="Contract start date (YYYY-MM-DD)")
    contract_end_date: Optional[datetime] = Field(None, description="Contract end date (YYYY-MM-DD)")
    monthly_revenue: Optional[float] = Field(None, ge=0, description="Monthly revenue from this enterprise")
    
    @validator('website')
    def validate_website(cls, v):
        if v and not (v.startswith('http://') or v.startswith('https://')):
            raise ValueError('Website must be a valid URI starting with http:// or https://')
        return v
    
    @validator('used_licenses')
    def validate_used_licenses(cls, v, values):
        if v is not None and 'max_licenses' in values and values['max_licenses'] and v > values['max_licenses']:
            raise ValueError('Used licenses cannot exceed max licenses')
        return v
    



class EnterpriseOutput(BaseSchema):
    id: str = Field(..., description="Company id")
    name: str = Field(..., description="Company name")
    industry: Optional[IndustryEnum] = Field(None, description="Industry sector")
    size: Optional[CompanySizeEnum] = Field(None, description="Company size")
    contact_email: EmailStr = Field(..., description="Primary contact email")
    contact_phone: Optional[str] = Field(None, description="Contact phone number")
    address: Optional[str] = Field(None, description="Company address")
    website: Optional[str] = Field(None, description="Company website")
    status: EnterpriseStatusEnum = Field(..., description="Enterprise status")
    subscription_tier: SubscriptionTierEnum = Field(..., description="Subscription tier")
    max_licenses: int = Field(..., description="Maximum number of licenses allowed")
    used_licenses: int = Field(..., description="Currently used licenses")
    contract_start_date: datetime = Field(None, description="Contract start date (YYYY-MM-DD)")
    contract_end_date: Optional[datetime] = Field(None, description="Contract end date (YYYY-MM-DD)")
    monthly_revenue: Optional[float] = Field(None, description="Monthly revenue from this enterprise")

    # added
    created_date: datetime = Field(..., description="Creation date (YYYY-MM-DD)")
    updated_date: datetime = Field(..., description="Last update date (YYYY-MM-DD)")











