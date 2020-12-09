from flask import Flask
from flask_apscheduler import APScheduler
from .rest import rest_api
from .utils import stream_tweets, create_account, check_account, send_token, write_tx_hash


class Config(object):
    SCHEDULER_API_ENABLED = True


app = Flask(__name__)
app.register_blueprint(rest_api)
app.config.from_object(Config())

scheduler = APScheduler()


@scheduler.task("interval", id="send_token_by_tweet", seconds=40, misfire_grace_time=900)
def main():
    tweets = stream_tweets()
    if len(tweets) > 0:
        for tweet in tweets:
            from_address = tweet["from_address"]
            to_address = tweet["to_address"]
            amount = tweet["amount"]
            if check_account(from_address):
                tx_hash = send_token(from_address, to_address, amount)
                write_tx_hash(tx_hash.hex() + "\n")
                print("Send tx complete")
            else:
                create_account(from_address)
                print("Created account")
                tx_hash = send_token(from_address, to_address, amount)
                write_tx_hash(tx_hash.hex() + "\n")
                print("Send tx complete")
    else:
        print("No #testbot1150 tweet")


scheduler.init_app(app)
scheduler.start()
