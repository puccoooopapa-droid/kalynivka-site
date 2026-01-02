const API_URL = "https://kalynivka-site.onrender.com";

// Обновить онлайн на сайте
async function updateOnline() {
    try {
        const response = await fetch(`${API_URL}/api/status`);
        const data = await response.json();
        
        // Ищем где у вас онлайн (на главной странице)
        const onlineElements = document.querySelectorAll('div, span, p');
        onlineElements.forEach(el => {
            if (el.textContent.includes('Онлайн:') || el.textContent.includes('онлайн:')) {
                el.innerHTML = `<strong>Онлайн: ${data.online}/${data.max}</strong>`;
            }
            if (el.textContent.includes('Версия:') || el.textContent.includes('версия:')) {
                el.textContent = `Версия: ${data.version || '1.20.1'}`;
            }
        });
        
        console.log("✅ Онлайн обновлен:", data.online);
        return data;
    } catch (e) {
        console.log("❌ Ошибка онлайна:", e);
        return {online: 0, max: 100};
    }
}

// Отправить команду
async function sendCommand(command) {
    try {
        console.log("📤 Команда:", command);
        const response = await fetch(`${API_URL}/api/command`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({command: command})
        });
        const result = await response.json();
        
        if (result.success) {
            alert(`✅ Успех!\n${result.output}`);
            return true;
        } else {
            alert(`❌ Ошибка:\n${result.output}`);
            return false;
        }
    } catch (e) {
        alert("❌ Нет подключения к серверу");
        return false;
    }
}

// Автозапуск
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Minecraft API загружен!");
    
    // Обновляем онлайн
    updateOnline();
    setInterval(updateOnline, 30000);
    
    // Кнопки в админке
    const sendBtn = document.querySelector('button[type="submit"], .send-button');
    const cmdInput = document.querySelector('input[type="text"], textarea');
    
    if (sendBtn && cmdInput) {
        sendBtn.onclick = async function(e) {
            e.preventDefault();
            if (cmdInput.value.trim()) {
                await sendCommand(cmdInput.value.trim());
                cmdInput.value = '';
            }
        };
    }
    
    // Быстрые команды
    const commands = {
        'Креатив себе': 'gamemode creative @p',
        'Выживание всем': 'gamemode survival @a', 
        '64 алмаза': 'give @p diamond 64',
        'ТП на спавн': 'tp @p 0 64 0',
        '100 уровней': 'xp add @p 100 levels',
        'Список игроков': 'list',
        'Кик игрока': 'kick [ник]'
    };
    
    // Вешаем на все кнопки
    document.querySelectorAll('button').forEach(btn => {
        const text = btn.textContent.trim();
        if (commands[text]) {
            btn.onclick = () => sendCommand(commands[text]);
        }
    });
});

// Экспорт для консоли
window.sendMinecraftCommand = sendCommand;
window.getMinecraftStatus = updateOnline;
