#!/usr/bin/env python3.6

from flask import Flask, jsonify
from py2neo import Graph, Node, Relationship


app = Flask(__name__)
print("Connecting to Graph DB")
g = Graph(user="neo4j", password="neo4j")
print("Connected!")


@app.route("/actors")
def actors():
    return jsonify([name["a.name"] for name in g.data('MATCH (a:Person) WHERE (a)-[:ACTED_IN]->() RETURN a.name')])


@app.route("/actor/<actor>")
def get_filmography(actor):
    data = g.data('MATCH (:Person {name: "%s"})-[:ACTED_IN]->(m:Movie) RETURN m.title' % actor)
    return jsonify([title["m.title"] for title in data])

if __name__ == "__main__":
    get_filmography("Tom Hanks")
    #FLASK_APP=server.py flask run