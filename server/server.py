#!/usr/bin/env python3.6

from flask import Flask, jsonify
from flask_cors import CORS
from py2neo import Graph


app = Flask(__name__)
CORS(app)


def start_server(port=5000):
    global app, g

    print("Connecting to Graph DB... ", end='')
    g = Graph(user="neo4j", password="neo4j")
    print("Connected!")

    app.run(port=5000, debug=True)
    print("Server started on port {}".format(port))


@app.route("/actors")
def actors():
    return jsonify([name["a.name"] for name in g.data('MATCH (a:Person) WHERE (a)-[:ACTED_IN]->() RETURN a.name')])


@app.route("/actor/<string:actor>")
def get_filmography(actor):
    data = g.data('MATCH (:Person {name: "%s"})-[:ACTED_IN]->(m:Movie) RETURN m.title' % actor)
    return jsonify([title["m.title"] for title in data])

if __name__ == "__main__":
    start_server()
