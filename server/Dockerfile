# Use an official Python runtime as a parent image
FROM python:3.12

# Install the necessary system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="${PATH}:/root/.local/bin"

# Set the working directory
WORKDIR /app

# Copy dependency files first for better caching
COPY pyproject.toml poetry.lock /app/

# Install dependencies
RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi

# Copy the rest of the app
COPY . /app

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Make entrypoint.sh executable
RUN chmod +x /app/entrypoint.sh

# Set the entrypoint script
ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]

# Run uvicorn server
CMD ["uvicorn", "convergent.main:app", "--host", "0.0.0.0", "--port", "8000"]
