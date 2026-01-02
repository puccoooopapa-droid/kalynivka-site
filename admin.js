// URL вашего бэкенда на Render
const API_URL = "https://kalynivka-site.onrender.com";

// Обновление статуса сервера
async function updateServerStatus() {
    try {
        const response = await fetch(`${API_URL}/api/status`);
        const data = await response.json();
        
        // Обновляем онлайн на главной странице
        const onlineElement = document.querySelector('.online-counter, [class*="online"], [id*="online"]');
        if (onlineElement) {
            onlineElement.textContent = `Онлайн: ${data.online}/${data.max}`;
        }
        
        // Обновляем версию
        const versionElement = document.querySelector('.version, [class*="version"], [id*="version"]');
        if (versionElement && data.version) {
            versionElement.textContent = `Версия: ${data.version}`;
        }
        
        return data;
    } catch (error) {
        console.error("Ошибка получения статуса:", error);
        return { online: 0, max: 100, status: "offline" };
    }
}

// Отправка команды в консоль
async function sendMinecraftCommand(command) {
    try {
        console.log("Отправляю команду:", command);
        
        const response = await fetch(`${API_URL}/api/command`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            <script src="admin.js"></script>
            body: JSON.stringify({ command: command })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log("✅ Команда выполнена:", result.output);
            return { success: true, message: result.output };
        } else {
            console.error("❌ Ошибка:", result.output);
            return { success: false, message: result.output };
        }
    } catch (error) {
        console.error("❌ Ошибка подключения:", error);
        return { success: false, message: "Ошибка подключения к серверу" };
    }
}

// Вешаем обработчики на кнопки в админке
document.addEventListener('DOMContentLoaded', function() {
    // Кнопка отправки команды
    const sendButton = document.querySelector('button[type="submit"], #send-command, .send-button');
    const commandInput = document.querySelector('input[type="text"], #command-input, .command-input');
    
    if (sendButton && commandInput) {
        sendButton.addEventListener('click', async function(e) {
            e.preventDefault();
            const command = commandInput.value.trim();
            if (command) {
                const result = await sendMinecraftCommand(command);
                alert(result.message);
                commandInput.value = '';
            }
        });
    }
    
    // Быстрые команды (кнопки)
    const quickCommands = document.querySelectorAll('.quick-command, [data-command]');
    quickCommands.forEach(button => {
        button.addEventListener('click', async function() {
            const command = this.getAttribute('data-command') || this.textContent;
            const result = await sendMinecraftCommand(command);
            alert(result.message);
        });
    });
    
    // Обновляем статус каждые 30 секунд
    updateServerStatus();
    setInterval(updateServerStatus, 30000);
});
