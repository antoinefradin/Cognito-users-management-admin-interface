
import asyncio
import base64
import json
import logging
import os
from decimal import Decimal as decimal
from functools import partial


from app.repositories.common import _get_table_public_client
from app.repositories.models.enterprise import (
    EnterpriseModel,
)

logger = logging.getLogger(__name__)


def store_enterprise(user_id: str, custom_enterprise: EnterpriseModel):
    table = _get_table_public_client()
    logger.info(f"store_enterprise() function")
    logger.info(f"Storing enterprise: {custom_enterprise}")

    item = {
        "PK": f"ENTERPRISE#{custom_enterprise.id}",
        "SK": "METADATA",
        #"id": custom_enterprise.id,
        "name": custom_enterprise.name,
        "industry": custom_enterprise.industry,
        "size": custom_enterprise.size,
        "status": custom_enterprise.status,
        "contact_email": custom_enterprise.contact_email,
        "contact_phone": custom_enterprise.contact_phone,
        "address": custom_enterprise.address,
        "website": custom_enterprise.website,
        "subscription_tier": custom_enterprise.subscription_tier,
        "max_licenses": custom_enterprise.max_licenses,
        "used_licenses": custom_enterprise.used_licenses,
        "monthly_revenue": custom_enterprise.monthly_revenue,
        "contract_start_date": custom_enterprise.contract_start_date,
        "contract_end_date": custom_enterprise.contract_end_date,
        "created_date": custom_enterprise.created_date,
        "updated_date": custom_enterprise.updated_date,
        "cognito_group_name": custom_enterprise.cognito_group_name,
        "created_by": custom_enterprise.created_by,

    }

    response = table.put_item(Item=item)
    return response