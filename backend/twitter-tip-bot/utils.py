import tweepy
import re

from pyband2 import Client
from pyband2.transaction import Transaction
from pyband2.message import MsgSend
from pyband2.wallet import PrivateKey
from pyband2.data import Coin
from .config import CONSUMER_KEY, CONSUMER_SECRET_KEY, ACCESS_TOKEN, ACCESS_TOKEN_SECRET, RPC_URL


auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET_KEY)
auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
api = tweepy.API(auth)


def get_address_by_twitter_acc(acc):
    priv = PrivateKey.from_mnemonic("{} salt".format(acc))
    return priv.to_pubkey().to_address().to_acc_bech32()


def write_tx_hash(tx_hash):
    f = open("./twitter-tip-bot/txhash.txt", "a")
    f.write(str(tx_hash))
    f.close()


def read_tx_hash():
    filename = "./twitter-tip-bot/txhash.txt"
    tx_hash_list = []

    with open(filename) as fh:
        for line in fh:
            tx_hash_list.append(line.strip())

    tx_hash_list.reverse()
    return tx_hash_list


def write_last_id(last_id):
    f = open("./twitter-tip-bot/lastid.txt", "w")
    f.write(str(last_id))
    f.close()


def read_last_id():
    f = open("./twitter-tip-bot/lastid.txt", "r")
    last_id = int(f.read())
    f.close()
    return last_id


def text_check(tweet_text):
    return re.search("^@[a-zA-Z0-9]+ send [0-9]+ to @.* ", tweet_text)


def create_account(account_id):
    amount = 5
    return send_token("s", account_id, amount)


def check_account(address):
    client = Client(RPC_URL)
    from_address_priv = PrivateKey.from_mnemonic("{} salt".format(address))
    acc = client.get_account(from_address_priv.to_pubkey().to_address())
    return True if acc else False


def send_token(
    from_address,
    to_address,
    amount,
):
    client = Client(RPC_URL)
    amount = amount * 1000000

    chain_id = client.get_chain_id()

    from_address_priv = PrivateKey.from_mnemonic("{} salt".format(from_address))
    from_addr_pubkey = from_address_priv.to_pubkey()
    from_address = from_address_priv.to_pubkey().to_address()

    to_address_priv = PrivateKey.from_mnemonic("{} salt".format(to_address))
    to_address = to_address_priv.to_pubkey().to_address()

    transaction = (
        Transaction()
        .with_messages(
            MsgSend(
                to_address=to_address,
                from_address=from_address,
                amount=[Coin(amount=amount, denom="uband")],
            )
        )
        .with_chain_id(chain_id)
        .with_auto(client)
        .with_memo("from tipbot")
        .with_gas(5000000)
        .with_fee(0)
    )

    raw_data = transaction.get_sign_data()
    signature = from_address_priv.sign(raw_data)
    raw_tx = transaction.get_tx_data(signature, from_addr_pubkey)

    tx = client.send_tx_block_mode(raw_tx)
    print(tx.tx_hash.hex())
    return tx.tx_hash


def stream_tweets():
    search_terms = ["#testbot1151"]
    data = []  # empty list to which tweet_details obj will be added

    for tweet in tweepy.Cursor(
        api.search, q='"{}" -filter:retweets'.format(search_terms), count=100, lang="en", tweet_mode="extended"
    ).items():
        tweet_details = {}
        tweet_details["id"] = tweet.id
        tweet_details["name"] = tweet.user.screen_name
        tweet_details["tweet"] = tweet.full_text
        if text_check(tweet.full_text):
            split_text = tweet.full_text.split(" ")
            tweet_details["from_address"] = split_text[0]
            tweet_details["to_address"] = split_text[4]
            tweet_details["amount"] = int(split_text[2])
        tweet_details["retweets"] = tweet.retweet_count
        tweet_details["location"] = tweet.user.location
        tweet_details["created"] = tweet.created_at.strftime("%d-%b-%Y")
        tweet_details["followers"] = tweet.user.followers_count
        tweet_details["is_user_verified"] = tweet.user.verified
        if int(tweet.id) > read_last_id():
            data.append(tweet_details)

    if data:
        write_last_id(data[-1]["id"])
    return data
