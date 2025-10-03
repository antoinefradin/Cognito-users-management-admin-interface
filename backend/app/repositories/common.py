import json
import os
import boto3


ACCOUNT = os.environ.get("ACCOUNT", "")
REGION = os.environ.get("REGION", "eu-west-3")
DDB_ENDPOINT_URL = os.environ.get("DDB_ENDPOINT_URL")
ADMIN_TABLE_NAME = os.environ.get("ADMIN_TABLE_NAME", "")
EVENTS_TABLE_NAME = os.environ.get("EVENTS_TABLE_NAME", "")
ADMIN_TABLE_ACCESS_ROLE_ARN = os.environ.get("ADMIN_TABLE_ACCESS_ROLE_ARN", "")
# TRANSACTION_BATCH_SIZE = 25


class RecordNotFoundError(Exception):
    pass


class RecordAccessNotAllowedError(Exception):
    pass


class ResourceConflictError(Exception):
    pass



def compose_enterprise_id(enterprise_id: str):
    return f"ENTERPRISE#{enterprise_id}"


def decompose_enterprise_id(composed_enterprise_id: str):
    return composed_enterprise_id.split("#")[-1]


def compose_event_id(event_id: str):
    return f"EVENT#{event_id}"


def decompose_event_id(composed_event_id: str):
    return composed_event_id.split("#")[-1]



def _get_aws_resource(service_name, user_id=None):
    """Get AWS resource with optional row-level access control for DynamoDB.
    Ref: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_dynamodb_items.html
    """
    if "AWS_EXECUTION_ENV" not in os.environ:
        if DDB_ENDPOINT_URL:
            return boto3.resource(
                service_name,
                endpoint_url=DDB_ENDPOINT_URL,
                aws_access_key_id="key",
                aws_secret_access_key="key",
                region_name=REGION,
            )
        else:
            return boto3.resource(service_name, region_name=REGION)

    policy_document = {
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "dynamodb:BatchGetItem",
                    "dynamodb:BatchWriteItem",
                    "dynamodb:ConditionCheckItem",
                    "dynamodb:DeleteItem",
                    "dynamodb:DescribeTable",
                    "dynamodb:GetItem",
                    "dynamodb:GetRecords",
                    "dynamodb:PutItem",
                    "dynamodb:Query",
                    "dynamodb:Scan",
                    "dynamodb:UpdateItem",
                ],
                "Resource": [
                    f"arn:aws:dynamodb:{REGION}:{ACCOUNT}:table/{ADMIN_TABLE_NAME}",
                    f"arn:aws:dynamodb:{REGION}:{ACCOUNT}:table/{ADMIN_TABLE_NAME}/index/*",
                ],
            }
        ]
    }
    if user_id:
        policy_document["Statement"][0]["Condition"] = {
            # Allow access to items with the same partition key as the user id
            "ForAllValues:StringLike": {"dynamodb:LeadingKeys": [f"{user_id}*"]}
        }

    sts_client = boto3.client("sts")
    assumed_role_object = sts_client.assume_role(
        RoleArn=ADMIN_TABLE_ACCESS_ROLE_ARN,
        RoleSessionName="DynamoDBSession",
        Policy=json.dumps(policy_document),
    )
    credentials = assumed_role_object["Credentials"]
    session = boto3.Session(
        aws_access_key_id=credentials["AccessKeyId"],
        aws_secret_access_key=credentials["SecretAccessKey"],
        aws_session_token=credentials["SessionToken"],
    )
    return session.resource(service_name, region_name=REGION)



def _get_table_admin_client():
    """Get a DynamoDB table client.
    Warning: No row-level access. Use for only limited use case.
    """
    return _get_aws_resource("dynamodb").Table(ADMIN_TABLE_NAME)


def _get_table_event_client():
    """Get a DynamoDB table client."""
    return boto3.resource("dynamodb").Table(EVENTS_TABLE_NAME)
