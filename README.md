This is an open-source web application implementing a polis-like algorithm for mapping high-dimensional opinion spaces.

## Installation

### Web API

The web API is written in [FastAPI](https://fastapi.tiangolo.com/), a web framework for Python. You need to install Python before running the API.

Installation for Windows (instructions are minimally changed for Linux):

```bash
cd server
python -m venv venv
venv/Scripts/activate # (in Linux, use source venv/bin/activate)
pip install -r requirements.txt
```

To run the API (in auto-reload mode):

```bash
uvicorn convergent.main:app --reload
```

### Frontend

The frontend requires [https://nodejs.org/en](https://nodejs.org/en) to run and is written in [Vite](https://vite.dev/).

Installation using Node (Windows and Linux):

```bash
cd client
npm install
```

To run the frontend (in development mode):

```
npm run dev
```
