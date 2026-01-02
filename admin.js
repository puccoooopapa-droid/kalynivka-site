const API_URL = "https://kalynivka-site.onrender.com";

// Обновление онлайн
async function updateOnline() {
    try {
        const response = await fetch(`${API_URL}/api/status`);
        const data = await response.json();
        
        // Найди элемент с онлайн на сайте
        const onlineElement = document.querySelector('[class*="online"], [id*="online"]');
        if (onlineElement) {
            onlineElement.innerHTML = `Онлайн: <strong>${data.online}/${data.max}</strong>`;
        }
        
        // Версия
        const versionElement = document.querySelector('[class*="version"], [id*="version"]');
        if (versionElement) {
            versionElement.textContent = `Версия: ${data.version || "1.20.1"}`;
        }
    } catch (e) {
        console.log("Ошибка:", e);
    }
}

// Отправка команды
async function sendCommand(cmd) {
    try {
        const response = await fetch(`${API_URL}/api/command`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({command: cmd})
        });
        const result = await response.json();
        alert(result.success ? "✅ Успех!" : "❌ Ошибка: " + result.output);
    } catch (e) {
        alert("❌ Ошибка подключения");
    }
}

// Обновлять онлайн каждые 30 сек
setInterval(updateOnline, 30000);
updateOnline();

// Вешаем на кнопки
document.addEventListener('DOMContentLoaded', function() {
    // Кнопка отправки
    document.querySelectorAll('button[type="submit"]').forEach(btn => {
        btn.onclick = function(e) {
            e.preventDefault();
            const input = document.querySelector('input[type="text"]');
            if (input && input.value) {
                sendCommand(input.value);
                input.value = '';
            }
        };
    });
    
    // Быстрые команды
    document.querySelectorAll('.quick-command, button').forEach(btn => {
        if (btn.textContent.includes('алмаза') || btn.textContent.includes('ТП') || 
            btn.textContent.includes('уровней') || btn.textContent.includes('Кик')) {
            btn.onclick = function() {
                const cmd = this.getAttribute('data-command') || this.textContent;
                sendCommand(cmd);
            };
        }
    });
});
