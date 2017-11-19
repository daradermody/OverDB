#!/usr/bin/env python3.6
import os

from flask import Flask, jsonify
from flask_cors import CORS
from py2neo import Graph
from py2neo.packages.httpstream import SocketError

application_path = os.path.normpath(os.path.join(os.path.dirname(__file__), "..")).replace('C:/cygwin64/', '/')
app = Flask("app", static_url_path='', static_folder='', root_path=application_path)
CORS(app)


def start_server(port=5000):
    global app, g

    g = _connect_to_database()

    app.run(port=5000, debug=True)
    print("Server started on port {}".format(port))


def _connect_to_database():
    print("Connecting to Graph DB... ")
    try:
        return Graph(user="neo4j", password="neo4j")
    except SocketError:
        print("Could not connect to database. Using mock instead.")
        return MockGraph()


@app.route("/")
def index():
    return app.send_static_file('index.html')


@app.route("/actors")
def actors():
    return jsonify([name["a.name"] for name in g.data('MATCH (a:Person) WHERE (a)-[:ACTED_IN]->() RETURN a.name')])


@app.route("/actor/<string:actor>")
def get_filmography(actor):
    data = g.data('MATCH (:Person {name: "%s"})-[:ACTED_IN]->(m:Movie) RETURN m' % actor)
    return jsonify([movie["m"] for movie in data])


class MockGraph(object):
    def __init__(self):
        self._data = [
            {
                "m": {
                    "title": "bob",
                    "tagline": "cancer",
                    "released": 2009
                }
            }
        ]

    def data(self, _):
        return self._data


if __name__ == "__main__":
    start_server()
