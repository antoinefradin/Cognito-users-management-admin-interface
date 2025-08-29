import logging
import os
import traceback
from typing import Callable

from app.dependencies import get_current_user
# from app.repositories.common import (
#     RecordAccessNotAllowedError,
#     RecordNotFoundError,
#     ResourceConflictError,
# )
from app.routes.enterprise import router as enterprise_router
# from app.routes.published_api import router as published_api_router
from app.user import User
# from app.utils import is_running_on_lambda
from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials
from pydantic import ValidationError
from starlette.requests import Request
from starlette.responses import Response
from starlette.types import ASGIApp, Message

CORS_ALLOW_ORIGINS = os.environ.get("CORS_ALLOW_ORIGINS", "*")


logging.basicConfig(level=logging.INFO, format="%(levelname)s:%(name)s - %(message)s")
logger = logging.getLogger(__name__)


# openapi_tags = [
#     {"name": "conversation", "description": "Conversation API"},
#     {"name": "bot", "description": "Bot API"},
#     {"name": "api_publication", "description": "API Publication API"},
#     {"name": "admin", "description": "Admin API"},
# ]
title = "IQ Admin Panel API"

app = FastAPI(
    # openapi_tags=openapi_tags,
    title=title,
)

app.include_router(enterprise_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOW_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def error_handler_factory(status_code: int) -> Callable[[Request, Exception], Response]:
    def error_handler(_: Request, exc: Exception) -> JSONResponse:
        logger.error("Middleware Error handler:")
        logger.error(exc)
        logger.error("".join(traceback.format_tb(exc.__traceback__)))
        return JSONResponse({"errors": [str(exc)]}, status_code=status_code)

    return error_handler  # type: ignore


# app.add_exception_handler(RecordNotFoundError, error_handler_factory(404))
app.add_exception_handler(FileNotFoundError, error_handler_factory(404))
# app.add_exception_handler(RecordAccessNotAllowedError, error_handler_factory(403))
app.add_exception_handler(ValueError, error_handler_factory(400))
app.add_exception_handler(TypeError, error_handler_factory(400))
app.add_exception_handler(AssertionError, error_handler_factory(400))
app.add_exception_handler(PermissionError, error_handler_factory(403))
app.add_exception_handler(ValidationError, error_handler_factory(422))
# app.add_exception_handler(ResourceConflictError, error_handler_factory(409))
app.add_exception_handler(Exception, error_handler_factory(500))


@app.middleware("http")
def add_current_user_to_request(request: Request, call_next: ASGIApp):
    authorization = request.headers.get("Authorization")
    logger.info("add_current_user_to_request()")
    if authorization:
        logger.info("authorization TRUE")
        token_str = authorization.split(" ")[1]
        logger.info(f"token: {token_str}")
        token = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token_str)
        logger.info(f"token HTTP: {token_str}")
        logger.info(f"User: {get_current_user(token)}")

        request.state.current_user = get_current_user(token)
    else:
        logger.info("authorization FALSE")
        request.state.current_user = User(
            id="test_user", name="test_user", groups=[], role="admin"
        )
        logger.info(request.state)

    response = call_next(request)  # type: ignore
    logger.info(f"response: {response}")
    return response



@app.middleware("http")
async def add_log_requests(request: Request, call_next: ASGIApp):
    logger.info(f"Request path: {request.url.path}")
    logger.info(f"Request method: {request.method}")
    logger.info(f"Request headers: {request.headers}")

    body = await request.body()
    logger.info(f"Request body: {body.decode('utf-8')[:100]}...")

    response = await call_next(request)  # type: ignore

    return response
