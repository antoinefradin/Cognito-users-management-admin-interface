from typing import Optional
from pydantic import BaseModel, Field, EmailStr, validator
from decimal import Decimal


from app.routes.schemas.entreprise_schema import (
    IndustryEnum,
    CompanySizeEnum, 
    EnterpriseStatusEnum,
    SubscriptionTierEnum
)


class EnterpriseModel(BaseModel):
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
    max_licenses: int = Field(..., description="Maximum number of licenses allowed")
    used_licenses: int = Field(default=0, ge=0, description="Currently used licenses")
    contract_start_date: Optional[str] = Field(None, description="Contract start date (YYYY-MM-DD)")
    contract_end_date: Optional[str] = Field(None, description="Contract end date (YYYY-MM-DD)")
    monthly_revenue: Optional[int] = Field(default=0, ge=0, description="Monthly revenue from this enterprise")

    # Added
    created_date: str = Field(..., description="Creation date (YYYY-MM-DD)")
    updated_date: str = Field(..., description="Last update date (YYYY-MM-DD)")
    cognito_group_name: Optional[str] = Field(None, description="Associated Cognito group name") 
    created_by: str = Field(..., description="Cognito User id who created this enterprise")

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



class EnterpriseMeta(BaseModel):
    id: str = Field(..., description="Company id")
    name: str = Field(..., description="Company name")
    industry: Optional[IndustryEnum] = Field(None, description="Industry sector")
    
    website: Optional[str] = Field(None, description="Company website")
    status: EnterpriseStatusEnum = Field(default=EnterpriseStatusEnum.ACTIVE, description="Enterprise status")
    subscription_tier: SubscriptionTierEnum = Field(default=SubscriptionTierEnum.BASIC, description="Subscription tier")
    max_licenses: int = Field(..., description="Maximum number of licenses allowed")
    used_licenses: int = Field(default=0, ge=0, description="Currently used licenses")

    contract_end_date: Optional[str] = Field(None, description="Contract end date (YYYY-MM-DD)")
    monthly_revenue: Optional[int] = Field(default=0, ge=0, description="Monthly revenue from this enterprise")