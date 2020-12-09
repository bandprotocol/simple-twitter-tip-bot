from flask import Blueprint, request, jsonify
from .utils import get_address_by_twitter_acc, read_tx_hash

rest_api = Blueprint("rest_api", __name__)


@rest_api.route("/tx_hashes", methods=["GET"])
def get_api():
    return jsonify(read_tx_hash())


@rest_api.route("/account", methods=["POST"])
def get_address():
    data = request.form
    addr = data["account"]
    address = get_address_by_twitter_acc(addr)
    return jsonify({"address": address})
