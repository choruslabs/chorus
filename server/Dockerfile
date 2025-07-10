FROM convergent-engine:latest

RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

ENV PATH="${PATH}:/root/.local/bin"

RUN pip install /tmp/convergent-engine

WORKDIR /app

COPY pyproject.toml poetry.lock /app/

RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi

COPY . /app

EXPOSE 8000

# Make entrypoint.sh executable
RUN chmod +x /app/entrypoint.sh

# Set the entrypoint script
ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]

# Run uvicorn server
CMD ["uvicorn", "convergent.main:app", "--host", "0.0.0.0", "--port", "8000"]
