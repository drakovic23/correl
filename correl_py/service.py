import json
from datetime import datetime
import numpy as np
import pyodbc
import yfinance as yf
import pandas as pd
import matplotlib.pyplot as plt
import os
from flask import Flask, jsonify, request
from statfuncs import calc_histogram_values, get_all_ticker_data, calc_daily_returns

app = Flask(__name__)


@app.route("/test", methods=["GET"])
def test():
    return "This is a test"


@app.route("/stats/general", methods=["GET"])
def stats():
    return calc_histogram_values(get_all_ticker_data("^GSPC"))


if __name__ == '__main__':
    app.run(port=5000)
