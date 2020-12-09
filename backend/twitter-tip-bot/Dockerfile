FROM python:3.9

# We copy just the requirements.txt first to leverage Docker cache
WORKDIR /app

COPY ./requirements.txt /app/requirements.txt

RUN apt-get install gcc libpq-dev -y
RUN pip install wheel
RUN pip install -r requirements.txt

COPY . /app/twitter-tip-bot

WORKDIR /app
EXPOSE 3002
ENTRYPOINT ["gunicorn", "--config", "twitter-tip-bot/gunicorn_config.py", "twitter-tip-bot.app:app"]
