
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
    _get_table_event_client,
    compose_event_id,
)

from app.repositories.models.event_model import (
    EventModel,
)

logger = logging.getLogger(__name__)


# def get_enterprises_by_contract_end_date(limit: int = 20, ascending: bool = True):
#     table = _get_table_public_client()
#     logger.info(f"Get enterprises sorted by contract_end_date")

#     # Fetch all bots
#     query_params = {
#         "IndexName": "GSI1",
#         "KeyConditionExpression": "GSI1PK = :pk_val",
#         "ExpressionAttributeValues": {
#             ":pk_val": "TYPE#ENTERPRISE",
#         },
#         "ScanIndexForward": ascending,
#     }
#     if limit:
#         query_params["Limit"] = limit

#     response = table.query(**query_params)
#     return response



def store_event(custom_event: EventModel):
    table = _get_table_event_client()
    logger.info(f"store_event() function")
    logger.info(f"Storing event: {custom_event}")
    logger.info(f"Storing event: {table}")

    item = {
        "PK": "EVENTS",
        "SK": f"{custom_event.event_date}#{custom_event.entity_type.value}#{custom_event.id}",
        "id": custom_event.id,
        "event_date": custom_event.event_date,
        "event_name": custom_event.event_name.value,
        "event_type": custom_event.event_type.value,
        "event_source": custom_event.event_source,
        "event_source_arn": custom_event.event_source_arn,
        "entity_id": custom_event.entity_id,
        "user_id": custom_event.user_id,
        "details": custom_event.details,
    }
    response = table.put_item(Item=item)
    return response


