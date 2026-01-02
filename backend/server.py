from flask import Flask, request, jsonify
from flask_cors import CORS
from mcstatus import JavaServer
from mcrcon import MCRcon
import os
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)

# Ваш Minecraft сервер
MC_HOST = "kalynivka.minecraftjoin.xyz"
MC_PORT = 25946
RCON_PORT = 25947
RCON_PASSWORD = "ваш_пароль_rcon"  # ЗАМЕНИТЕ НА РЕАЛЬНЫЙ!

@app.route("/api/status")
def status():
    try:
        server = JavaServer.lookup(f"{MC_HOST}:{MC_PORT}")
        status = server.status()
        return jsonify({
            "online": status.players.online,
            "max": status.players.max,
            "version": status.version.name,
            "status": "online"
        })
    except Exception as e:
        return jsonify({
            "online": 0,
            "max": 100,
            "status": "offline",
            "error": str(e)
        })

@app.route("/api/command", methods=["POST"])
def command():
    try:
        data = request.json
        cmd = data.get("command", "")
        
        with MCRcon(MC_HOST, RCON_PASSWORD, port=RCON_PORT) as mcr:
            result = mcr.command(cmd)
        
        return jsonify({
            "success": True,
            "output": result
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "output": f"Ошибка: {str(e)}"
        })

@app.route("/")
def home():
    return "Minecraft Backend работает!"

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
