from flask import Flask, jsonify, Request, Response, request, redirect, send_from_directory, url_for
from statfuncs import (get_all_ticker_data, calc_atr_specified,
                       calc_descriptive_stats, calc_general_atr, insert_ticker_stats)

app = Flask(__name__)


@app.route("/stats/atr/<ticker>/<n>", methods=["GET"])  # For testing
def atr(ticker, n):
    ret = [calc_atr_specified(get_all_ticker_data(ticker), n)]
    return ret


@app.route("/stats/atr/general/<ticker>", methods=["GET"])
def atr_general(ticker):
    try:
        return calc_general_atr(ticker)
    except Exception as e:
        return Response(status=400)


@app.route("/stats/descriptive/<ticker>", methods=["GET"])
def descriptive(ticker):
    try:
        d_stats = calc_descriptive_stats(get_all_ticker_data(ticker))
        ret = {  # Construct the return
            "count": int(d_stats['count']),
            "mean": float(d_stats['mean']),
            "std": float(d_stats['std']),
            "min": float(d_stats['min']),
            "max": float(d_stats['max']),
            "Quartile1": float(d_stats['25%']),
            "Quartile2": float(d_stats['50%']),
            "Quartile3": float(d_stats['75%']),
        }
        return jsonify(ret)
    except Exception as e:
        print(e)
        return Response(status=400)


@app.route("/stats/general/<ticker>", methods=["GET"])  # For inserting general stats for the desired ticker
def general_stats(ticker: str):  # This should also return the ticker ID
    try:
        id = insert_ticker_stats(ticker)
        return jsonify(id)
    except Exception as e:  # This doesn't really appear to work
        print(e)
        return Response(status=400)


if __name__ == '__main__':
    app.run()
