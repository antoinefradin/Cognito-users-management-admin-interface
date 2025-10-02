import os
import boto3

# Events
ADMIN_TABLE_NAME = os.environ.get("ADMIN_TABLE_NAME", "")
EVENTS_TABLE_NAME = os.environ.get("EVENTS_TABLE_NAME", "")


class RecordNotFoundError(Exception):
    pass


class RecordAccessNotAllowedError(Exception):
    pass


class ResourceConflictError(Exception):
    pass


def compose_event_id(event_id: str):
    return f"EVENT#{event_id}"


def decompose_event_id(composed_event_id: str):
    return composed_event_id.split("#")[-1]


def _get_table_event_client():
    """Get a DynamoDB table client."""
    return boto3.resource("dynamodb").Table(EVENTS_TABLE_NAME)
