FROM python:3.9.12

WORKDIR /app

RUN pip install poetry
RUN poetry config virtualenvs.create false
COPY ./pyproject.toml /app/
COPY ./poetry.lock /app/
RUN poetry install

COPY . /app

CMD ["poetry", "run", "uvicorn", "app.api.app:app", "--log-level", "debug", "--reload", "--host", "0.0.0.0", "--port", "9000"]