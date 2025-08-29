import os
import requests
from jose import jwt
import logging

logger = logging.getLogger(__name__)

REGION = os.environ.get("REGION", "eu-west-3")
USER_POOL_ID = os.environ.get("USER_POOL_ID", "")
CLIENT_ID = os.environ.get("CLIENT_ID", "")


def verify_token(token: str) -> dict:
    logger.info("verify_token()")
    # Verify JWT token
    url = f"https://cognito-idp.{REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json"
    response = requests.get(url)
    logger.info(f"response verify_token: {response}")
    
    keys = response.json()["keys"]
    logger.info(f"keys verify_token: {keys}")

    header = jwt.get_unverified_header(token)
    logger.info(f"header verify_token: {header}")

    key = [k for k in keys if k["kid"] == header["kid"]][0]
    logger.info(f"key verify_token: {key}")
    # The JWT returned from the Identity Provider may contain an at_hash
    # jose jwt.decode verifies id_token with access_token by default if it contains at_hash
    # See : https://github.com/mpdavis/python-jose/blob/4b0701b46a8d00988afcc5168c2b3a1fd60d15d8/jose/jwt.py#L59
    # Since we are not using an access token in the app, skipping the verification of the at_hash.
    # so we will disable the verify_at_hash check.
    decoded = jwt.decode(
        token,
        key,
        algorithms=["RS256"],
        options={"verify_at_hash": False},
        audience=CLIENT_ID,
    )
    print(decoded)
    return decoded
