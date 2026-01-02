from flask import Flask, request, jsonify
from flask_cors import CORS
from mcstatus import JavaServer
from mcrcon import MCRcon
import os

app = Flask(__name__)
CORS(app)

MC_HOST = "waw5.mineconnect.xyz"
MC_PORT = 25946

RCON_PORT = 25899
RCON_PASSWORD = "97K8gsdOq9"

@app.route("/api/status")
def status():
    try:
        server = JavaServer.lookup(f"{MC_HOST}:{MC_PORT}")
        s = server.status()
        return jsonify({
            "online": s.players.online,
            "max": s.players.max,
            "status": "online"
        })
    except:
        return jsonify({"status": "offline"})

@app.route("/api/command", methods=["POST"])
def command():
    cmd = request.json.get("command")
    with MCRcon(MC_HOST, RCON_PASSWORD, port=RCON_PORT) as mcr:
        result = mcr.command(cmd)
    return jsonify({"output": result})

app.run(host="0.0.0.0", port=5000)
