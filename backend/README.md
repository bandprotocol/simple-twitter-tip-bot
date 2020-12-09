# Getting started with Twitter Tip Bot Backend

The twitter tip bot application were built from python using Pyband as the client library.

The application is pulling the tweets from `#testbot1151` hastag tweet, then filtering only the tweet which matches with `@user1 send 2 to @user2 #testbot1151`, so the bot will send 2 BAND tokens from @user1 to @user2 automatically.

## Installation

Creation of virtual environments

```
cd twitter-tip-bot
python3 -m venv venv
source venv/bin/activate
```

Intalling dependencies

```
pip install -r requirements.txt
```

## Deployment

### Twitter API key Config

ฺBefore running the server, you have to get the twitter api from [Twitter Developer](https://developer.twitter.com/en).
After that, filiing the api to `config.py`.

The RPC_URL can be changed to any RPC in BandChain, in the example we are using GuanYu Testnet.

```
CONSUMER_KEY = "<YOUR_CONSUMER_KEY>"
CONSUMER_SECRET_KEY = "<YOUR_CONSUMER_SECRET_KEY>"
ACCESS_TOKEN = "<YOUR_ACCESS_TOKEN>"
ACCESS_TOKEN_SECRET = "<YOUR_ACCESS_TOKEN_SECRET>"
RPC_URL = "https://guanyu-testnet3-query.bandchain.org"
```

### Running the server

#### Docker

```
docker build . --tag tw-bot-backend
docker run -p 3002:3002 tw-bot-backend
```

or

#### Gunicorn

```
gunicorn -w 1 twitter-tip-bot.app:app -b 127.0.0.1:3002
```
