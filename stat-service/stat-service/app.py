from flask import Flask, jsonify, Request, Response, request, redirect, send_from_directory, url_for
from statfuncs import (get_all_ticker_data, calc_atr_specified,
                       calc_descriptive_stats, calc_general_atr, get_general_stats)
from flask_caching import Cache
import scheduler


def create_app(config_name=None):
    config = {
        "DEBUG": False,
        "CACHE_TYPE": "SimpleCache",
        "CACHE_DEFAULT_TIMEOUT": 14400,
    }
    app = Flask(__name__)
    app.config.from_mapping(config)
    cache = Cache(app)

    @app.route("/stats/atr/<ticker>/<n>", methods=["GET"])
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

    @app.route("/stats/general/<ticker>", methods=["GET"])
    @cache.cached(timeout=14400, key_prefix=lambda: f"data_{request.view_args['ticker']}")
    def general_stat_test(ticker: str):
        try:
            return get_general_stats(ticker)  # TODO: Rename to appropriate func
        except Exception as e:
            print(e)
            return Response(status=400)

    return app


if __name__ == '__main__':
    app = create_app()
    scheduler.start_scheduler()
    app.run()
