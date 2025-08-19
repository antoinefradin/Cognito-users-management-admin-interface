FROM public.ecr.aws/docker/library/python:3.12-slim-bookworm

# Install lambda web adapter
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.9.1 /lambda-adapter /opt/extensions/lambda-adapter

WORKDIR /backend

COPY ./pyproject.toml ./uv.lock ./

ENV UV_HTTP_TIMEOUT=10800
RUN pip install uv --no-cache-dir && \
    uv pip install -r pyproject.toml --no-deps && \
    uv pip install --system -e .

COPY ./app ./app

ENV PORT=8000
EXPOSE ${PORT}
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]