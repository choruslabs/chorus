This is an open-source web application implementing a Polis-like algorithm.

## Installation

### Web API

The web API is written in [FastAPI](https://fastapi.tiangolo.com/), a web framework for Python. You need to install Python before running the API.

Installation for Windows (instructions are minimally changed for Linux):

```bash
cd polis.server
python -m venv venv
venv/Scripts/activate # (in Linux, use source venv/bin/activate)
pip install -r requirements.txt
```

To run the API (in auto-reload mode):

```bash
uvicorn polis.main:app --reload
```

### Frontend

The frontend requires [https://nodejs.org/en](https://nodejs.org/en) to run and is written in [Vite](https://vite.dev/).

Installation using Node (Windows and Linux):

```bash
cd polis.client
npm install
```

To run the frontend (in development mode):

```
npm run dev
```
