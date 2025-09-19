
import asyncio
import base64
import json
import logging
import os
from decimal import Decimal as decimal
from functools import partial
from typing import Optional, Dict, Any

from boto3.dynamodb.conditions import Key
from botocore.exceptions import ClientError

from app.repositories.common import (
    RecordNotFoundError,
    _get_table_public_client,
    compose_enterprise_id,

)
from app.routes.schemas.entreprise_schema import (
    IndustryEnum,
    CompanySizeEnum, 
    EnterpriseStatusEnum,
    SubscriptionTierEnum
)
from app.repositories.models.enterprise_model import (
    EnterpriseModel,
)

logger = logging.getLogger(__name__)


def get_enterprises_by_contract_end_date(limit: int = 20, ascending: bool = True):
    table = _get_table_public_client()
    logger.info(f"Get enterprises sorted by contract_end_date")

    # Fetch all bots
    query_params = {
        "IndexName": "GSI1",
        "KeyConditionExpression": "GSI1PK = :pk_val",
        "ExpressionAttributeValues": {
            ":pk_val": "TYPE#ENTERPRISE",
        },
        "ScanIndexForward": ascending,
    }
    if limit:
        query_params["Limit"] = limit

    response = table.query(**query_params)
    return response



def store_enterprise(user_id: str, custom_enterprise: EnterpriseModel):
    table = _get_table_public_client()
    logger.info(f"store_enterprise() function")
    logger.info(f"Storing enterprise: {custom_enterprise}")

    item = {
        "PK": custom_enterprise.id,
        "SK": f"ENTERPRISE#{custom_enterprise.id}",
        "GSI1PK": "TYPE#ENTERPRISE",
        "GSI1SK": custom_enterprise.contract_end_date,
        "Name": custom_enterprise.name,
        "Industry": custom_enterprise.industry,
        "Size": custom_enterprise.size,
        "Status": custom_enterprise.status,
        "ContactEmail": custom_enterprise.contact_email,
        "ContactPhone": custom_enterprise.contact_phone,
        "Address": custom_enterprise.address,
        "Website": custom_enterprise.website,
        "SubscriptionTier": custom_enterprise.subscription_tier,
        "MaxLicenses": custom_enterprise.max_licenses,
        "UsedLicenses": custom_enterprise.used_licenses,
        "MonthlyRevenue": custom_enterprise.monthly_revenue,
        "ContractStartDate": custom_enterprise.contract_start_date,
        "ContractEndDate": custom_enterprise.contract_end_date,
        "CreatedDate": custom_enterprise.created_date,
        "UpdatedDate": custom_enterprise.updated_date,
        "CognitoGroupName": custom_enterprise.cognito_group_name,
        "CreatedBy": custom_enterprise.created_by,
        "UpdatedBy": custom_enterprise.updated_by,
    }
    response = table.put_item(Item=item)
    return response


def update_enterprise(
    enterprise_id: str,
    contract_start_date: str,
    updated_date: str,
    updated_by: str,
    industry: IndustryEnum,
    size: CompanySizeEnum,
    status: EnterpriseStatusEnum,
    contact_email: Optional[str] = None,
    contact_phone: Optional[str] = None,
    address: Optional[str] = None,
    website: Optional[str] = None,
    subscription_tier: SubscriptionTierEnum = None,
    max_licenses: Optional[int] = None,
    used_licenses: Optional[int] = None,
    monthly_revenue: Optional[float] = None,
    contract_end_date: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Update enterprise fields.
    Only non-None values will be updated in DynamoDB.
    Returns:
        DynamoDB response from update_item
    """
    table = _get_table_public_client()
    logger.info(f"Updating bot: {enterprise_id}")

    # PART 1: Construction of update expression
    update_expression = (
        "SET GSI1SK = :gsi1_sk, "
        "Industry = :industry, "              
        "#size = :size, "                       # ← Alias for Size (reserved keyword)
        "#status = :status, "                   # ← Alias for Status (reserved keyword)                       
        "ContactEmail = :contact_email, "          
        "ContactPhone = :contact_phone, " 
        "Address = :address, " 
        "Website  = :website, " 
        "SubscriptionTier = :subscription_tier, " 
        "MaxLicenses = :max_licenses, " 
        "UsedLicenses = :used_licenses, "
        "MonthlyRevenue = :monthly_revenue, "
        "ContractStartDate = :contract_start_date, "
        "ContractEndDate = :contract_end_date, "
        "UpdatedDate = :updated_date, "
        "UpdatedBy = :updated_by"
    )

    # PART 2: Attribute names mapping for reserved keywords
    expression_attribute_names = {
        "#size": "Size",        # ← Mapping for Size reserved keyword
        "#status": "Status"     # ← Mapping for Status reserved keyword
}

    # PART 3: Values mapping with placeholders
    expression_attribute_values = {
        ":gsi1_sk": contract_end_date,
        ":industry": industry,                         
        ":size": size,              
        ":status": status,              
        ":contact_email": contact_email,     
        ":contact_phone":contact_phone,        
        ":address": address,  
        ":website": website, 
        ":subscription_tier": subscription_tier,              
        ":max_licenses": max_licenses, 
        ":used_licenses": used_licenses,  
        ":monthly_revenue": monthly_revenue,   
        ":contract_start_date": contract_start_date,          
        ":contract_end_date": contract_end_date,
        ":updated_date": updated_date,
        ":updated_by": updated_by,
    }

    try:
        response = table.update_item(
            Key={"PK": enterprise_id, "SK": compose_enterprise_id(enterprise_id)},
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expression_attribute_names,  # ← Required for reserved keywords
            ExpressionAttributeValues=expression_attribute_values,
            ReturnValues="ALL_NEW",
            ConditionExpression="attribute_exists(PK) AND attribute_exists(SK)",
        )
        logger.info(f"Updating repsonse: {response}")

    except ClientError as err:
        if err.response["Error"]["Code"] == "ConditionalCheckFailedException":
            raise RecordNotFoundError(f"Enterprise with id {enterprise_id} not found")
        else:
            raise err

    return response




def find_enterprise_by_id(enterprise_id: str) -> EnterpriseModel:
    """Find enterprise."""
    table = _get_table_public_client()
    logger.info(f"Finding enterprise with id: {enterprise_id}")

    response = table.get_item(
        Key={
            "PK": enterprise_id,
            "SK": f"ENTERPRISE#{enterprise_id}"
        }
    )
    logger.info(f"Finding enterprise with id - existing_item: {response}")
    if "Item" not in response or len(response["Item"]) == 0:
        raise RecordNotFoundError(f"Enterprise {enterprise_id} not found")
    
    existing_item = response["Item"]
    return EnterpriseModel(
        id=existing_item["PK"],
        name=existing_item["Name"],
        industry=existing_item["Industry"],
        size=existing_item["Size"],
        contact_email=existing_item["ContactEmail"],
        contact_phone=existing_item["ContactPhone"],
        address=existing_item["Address"],
        website=existing_item["Website"],
        status=existing_item["Status"],
        subscription_tier=existing_item["SubscriptionTier"],
        max_licenses=existing_item["MaxLicenses"],
        used_licenses=existing_item["UsedLicenses"],
        contract_start_date=existing_item["ContractStartDate"],
        contract_end_date=existing_item["ContractEndDate"],
        monthly_revenue=existing_item["MonthlyRevenue"],
        created_date=existing_item["CreatedDate"],
        updated_date=existing_item["UpdatedDate"],
        cognito_group_name=existing_item["CognitoGroupName"],
        created_by=existing_item["CreatedBy"],
        updated_by=existing_item["UpdatedBy"],
    )


def is_enterprise_exists(enterprise_id: str) -> bool:
    """Find enterprise."""
    table = _get_table_public_client()
    logger.info(f"Check if enterprise with id exists: {enterprise_id}")

    response = table.get_item(
        Key={
            "PK": enterprise_id,
            "SK": f"ENTERPRISE#{enterprise_id}"
        }
    )
    if "Item" not in response:
        raise RecordNotFoundError(f"Enterprise {enterprise_id} not found")
    return True
