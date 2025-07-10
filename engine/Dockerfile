FROM python:3.12

RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="${PATH}:/root/.local/bin"

WORKDIR /engine

COPY . /engine

RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi

COPY . /tmp/convergent-engine

RUN pip install /tmp/convergent-engine