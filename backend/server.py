from flask import Flask, request, jsonify
from flask_cors import CORS
from mcstatus import JavaServer
from mcrcon import MCRcon
import os

app = Flask(__name__)
CORS(app)

MC_HOST = os.environ.get('MC_HOST', 'waw5.mineconnect.xyz')
MC_PORT = 25565
RCON_PORT = 25947
RCON_PASSWORD = os.environ.get('RCON_PASSWORD', '97K8gsdOq9')

print(f"=== НАСТРОЙКИ СЕРВЕРА ===")
print(f"Minecraft: {MC_HOST}:{MC_PORT}")
print(f"RCON порт: {RCON_PORT}")
print(f"Пароль: {'*' * len(RCON_PASSWORD)}")
print(f"=========================")

@app.route("/api/status")
def status():
    try:
        server = JavaServer.lookup(f"{MC_HOST}:{MC_PORT}")
        status = server.status()
        return jsonify({
            "online": status.players.online,
            "max": status.players.max,
            "version": status.version.name,
            "motd": str(status.description),
            "status": "online"
        })
    except Exception as e:
        print(f"Ошибка статуса: {e}")
        return jsonify({
            "online": 0,
            "max": 100,
            "status": "offline",
            "error": str(e)
        })

@app.route("/api/command", methods=["POST"])
def command():
    try:
        cmd = request.json.get("command", "")
        print(f"Команда: {cmd}")
        
        with MCRcon(MC_HOST, RCON_PASSWORD, port=RCON_PORT) as mcr:
            result = mcr.command(cmd)
        
        print(f"Результат: {result}")
        return jsonify({
            "success": True,
            "output": result
        })
    except Exception as e:
        print(f"Ошибка RCON: {e}")
        return jsonify({
            "success": False,
            "output": f"Ошибка: {str(e)}"
        })

@app.route("/api/test")
def test():
    return jsonify({
        "status": "success",
        "server": f"{MC_HOST}:{MC_PORT}",
        "rcon": "available" if RCON_PASSWORD else "disabled"
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
