import logging
import os

logger = logging.getLogger()
logger.setLevel(logging.INFO)

ADMIN_TABLE_NAME = os.environ.get("ADMIN_TABLE_NAME")

def handler(event, context):
    """
    DynamoDB Streams Trigger Lambda Stream Processor.

    :param event: The event from Trigger.
    :param context: The Lambda execution context.
    :return: The response to Cognito.
    """
    logger.info('Received Event: %s', event)

    logger.info('Admin Table: %s', ADMIN_TABLE_NAME)
    for rec in event['Records']:
        logger.info('Record: %s', rec)