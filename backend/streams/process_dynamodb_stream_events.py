import logging
import os

from repositories.event_repository import store_event
from repositories.models.event_model import EventModel, EventNameEnum, EventTypeEnum, EntityTypeEnum

logger = logging.getLogger()
logger.setLevel(logging.INFO)

ADMIN_TABLE_NAME = os.environ.get("ADMIN_TABLE_NAME", "")
EVENTS_TABLE_NAME = os.environ.get("EVENTS_TABLE_NAME", "")


def handler(event, context):
    """
    Process DynamoDB Stream events and create records in Events table.

    :param event: The event from Trigger.
    :param context: The Lambda execution context.
    """
    logger.info('Received Event: %s', event)
    print(f"Processing {len(event['Records'])} DynamoDB stream records")
    print(EVENTS_TABLE_NAME)
    print(ADMIN_TABLE_NAME)
    processed_count = 0
    failed_records = []
    
#     for record in event['Records']:
#         try:
#             # Process only INSERT and REMOVE events
#             if record['eventName'] in ['INSERT', 'REMOVE']:
#                 create_event_record(record)
#                 processed_count += 1
#             else:
#                 print(f"Skipping {record['eventName']} event")
                
#         except Exception as e:
#             print(f"Error processing record {record.get('eventID', 'unknown')}: {str(e)}")
#             failed_records.append({
#                 'itemIdentifier': record.get('eventID', 'unknown')
#             })
    
#     print(f"Successfully processed {processed_count} records")
    
#     # Return failures for automatic retry
#     if failed_records:
#         return {
#             'batchItemFailures': failed_records
#         }
    
#     return {'statusCode': 200}

# def create_event_record(record: Dict[str, Any]) -> None:
#     """
#     Create an event record in the Events table
#     """
#     event_name = record['eventName']
#     dynamodb_data = record.get('dynamodb', {})
    
#     # Get entity data (new for INSERT, old for REMOVE)
#     entity_data = dynamodb_data.get('NewImage') if event_name == 'INSERT' else dynamodb_data.get('OldImage')
    
#     if not entity_data:
#         print(f"No entity data found for {event_name} event")
#         return
    
#     # Determine entity type
#     entity_type = determine_entity_type(entity_data)
#     event_type = f"{entity_type}_{'CREATED' if event_name == 'INSERT' else 'DELETED'}"
    
#     # Prepare event record
#     event_record = {
#         'event_id': str(uuid.uuid4()),
#         'partition_key': 'EVENTS',
#         'timestamp': int(datetime.now().timestamp() * 1000),  # Timestamp in milliseconds
#         'event_type': event_type,
#         'entity_id': extract_string_value(entity_data, 'id') or 'unknown',
#         'entity_name': (
#             extract_string_value(entity_data, 'name') or
#             extract_string_value(entity_data, 'title') or
#             extract_string_value(entity_data, 'company_name') or
#             'Unknown Entity'
#         ),
#         'user_id': (
#             extract_string_value(entity_data, 'created_by') or
#             extract_string_value(entity_data, 'updated_by') or
#             'system'
#         ),
#         'details': {
#             'dynamodb_event': event_name,
#             'approximate_creation_time': dynamodb_data.get('ApproximateCreationDateTime'),
#             'keys': dynamodb_data.get('Keys', {}),
#             'size_bytes': dynamodb_data.get('SizeBytes', 0),
#             'sequence_number': dynamodb_data.get('SequenceNumber')
#         }
#     }
    
#     # Insert into Events table
#     try:
#         events_table.put_item(Item=event_record)
#         print(f"Event recorded: {event_record['event_type']} for {event_record['entity_name']}")
#     except Exception as e:
#         print(f"Failed to insert event record: {str(e)}")
#         raise

# def determine_entity_type(entity_data: Dict[str, Any]) -> str:
#     """
#     Determine entity type based on data structure
#     Customize this logic based on your actual data structure
#     """
#     # Check for enterprise-specific fields
#     if any(field in entity_data for field in ['enterprise_id', 'company_name', 'company_type']):
#         return 'ENTERPRISE'
    
#     # Check for license-specific fields
#     elif any(field in entity_data for field in ['license_number', 'license_type', 'license_status']):
#         return 'LICENSE'
    
#     # Check for user-specific fields
#     elif any(field in entity_data for field in ['email', 'username', 'user_role']):
#         return 'USER'
    
#     # Default fallback
#     else:
#         return 'UNKNOWN'

# def extract_string_value(entity_data: Dict[str, Any], field_name: str) -> Optional[str]:
#     """
#     Extract string value from DynamoDB attribute format
#     DynamoDB streams return data in format: {'S': 'string_value'} or {'N': 'number_value'}
#     """
#     field_data = entity_data.get(field_name)
#     if not field_data:
#         return None
    
#     # Handle DynamoDB attribute format
#     if isinstance(field_data, dict):
#         # String attribute
#         if 'S' in field_data:
#             return field_data['S']
#         # Number attribute (convert to string)
#         elif 'N' in field_data:
#             return field_data['N']
#         # Boolean attribute
#         elif 'BOOL' in field_data:
#             return str(field_data['BOOL'])
    
#     # Handle direct string (shouldn't happen in streams but just in case)
#     elif isinstance(field_data, str):
#         return field_data
    
#     return None

# def extract_number_value(entity_data: Dict[str, Any], field_name: str) -> Optional[int]:
#     """
#     Extract number value from DynamoDB attribute format
#     """
#     field_data = entity_data.get(field_name)
#     if not field_data:
#         return None
    
#     if isinstance(field_data, dict) and 'N' in field_data:
#         try:
#             return int(field_data['N'])
#         except ValueError:
#             return None
    
#     return None

# # Optional: Add custom business logic for specific event types
# def should_create_event(record: Dict[str, Any]) -> bool:
#     """
#     Optional filter to determine if an event should be created
#     Customize based on your business requirements
#     """
#     event_name = record['eventName']
    
#     # Always create events for INSERT and REMOVE
#     if event_name in ['INSERT', 'REMOVE']:
#         return True
    
#     # For MODIFY events, you might want to check what fields changed
#     if event_name == 'MODIFY':
#         # Example: only create event if status field changed
#         old_image = record.get('dynamodb', {}).get('OldImage', {})
#         new_image = record.get('dynamodb', {}).get('NewImage', {})
        
#         old_status = extract_string_value(old_image, 'status')
#         new_status = extract_string_value(new_image, 'status')
        
#         return old_status != new_status
    
#     return False