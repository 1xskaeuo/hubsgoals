// Данные задач
let tasks = [];
const XP_PER_LEVEL = {
    easy: 10,
    medium: 25,
    hard: 25000
};
let dino = {
    level: 1,
    xp: 0,
    nextLevel: 100
};
const BASE_XP = 100;
const DINO_IMAGES = {
    1: '1.png',    // Уровни 1-9
    10: '2.png',   // Уровни 10-19
    20: '3.png',   // Уровни 20-29
    30: '4.png',   // Уровни 30-39
    40: '5.png'    // Уровни 40+
};
// Элементы интерфейса
const taskInput = document.getElementById('taskInput');
const difficultySelect = document.getElementById('difficultySelect');
const deadlineInput = document.getElementById('deadlineInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasksList');
const deadlinesList = document.getElementById('deadlinesList');
const allTasksList = document.getElementById('allTasksList');
const tasksCount = document.querySelector('.tasks-count');
const viewAllBtn = document.getElementById('viewAllTasks');
const allTasksModal = document.getElementById('allTasksModal');
const closeAllTasks = document.getElementById('closeAllTasks');
const filterBtns = document.querySelectorAll('.filter-btn');

// Элементы модальных окон
const profileAvatar = document.getElementById('profileAvatar');
const profileModal = document.getElementById('profileModal');
const closeProfile = document.getElementById('closeProfile');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const logoutBtn = document.getElementById('logoutBtn');
const themeBtns = document.querySelectorAll('.theme-btn');
const uploadBtn = document.getElementById('uploadBtn');
const avatarUpload = document.getElementById('avatarUpload');
const avatarPreview = document.getElementById('avatarPreview');
const profileAvatarLarge = document.getElementById('profileAvatarLarge');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');

// Добавление новой задачи
// Функция добавления новой задачи
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const difficultySelect = document.getElementById('difficultySelect');
    const deadlineInput = document.getElementById('deadlineInput');
    
    const taskText = taskInput.value.trim();
    const difficulty = difficultySelect.value;
    const deadline = deadlineInput.value;
    
    if (!taskText) {
        showNotification("Ошибка!",'Введите текст задачи', 'error');
        taskInput.focus();
        shakeElement(taskInput);
        return;
    }

     if (!difficulty) {
        showNotification("Ошибка!",'Выберите сложность задачи', 'error');
        difficultySelect.focus();
        shakeElement(difficultySelect);
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        difficulty: difficulty,
        deadline: deadline,
        completed: false,
        createdAt: new Date()
    };
    
    tasks.push(newTask);
    updateTasksDisplay();
    
    // Очищаем поля ввода
    taskInput.value = '';
    difficultySelect.value = '';
    deadlineInput.value = '';
    
    // Показываем уведомление об успехе
    showNotification("Успешно!",'Задача добавлена!', 'success');
}

// Функция показа уведомления
function showNotification(text, type = 'error') {
    const notification = document.getElementById('notification');
    const notificationText = notification.querySelector('.notification-text');
    const icon = notification.querySelector('i');
    
    // Настраиваем стиль по типу
    notification.className = 'notification';
    notification.classList.add(type);
    
    if (type === 'error') {
        notification.style.background = '#ff5252';
        icon.className = 'fas fa-exclamation-circle';
    } else {
        notification.style.background = '#4CAF50';
        icon.className = 'fas fa-check-circle';
    }
    
    notificationText.textContent = text;
    notification.classList.add('active');
    
    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}
function checkLevelUp() {
    while (dinoStats.xp >= dinoStats.requiredXp) {
        dinoStats.xp -= dinoStats.requiredXp;
        dinoStats.level++;
        dinoStats.requiredXp = Math.floor(BASE_XP * Math.pow(1.2, dinoStats.level - 1));
        
        // Меняем изображение
        updateDinoImage();
        
        // Уведомление о новом уровне
        showNotification(`🎉 Уровень ${dinoStats.level}!`, 'success');
    }
}

// Начисление опыта за выполнение задачи
function addXP(difficulty) {
    // Сохраняем текущий уровень ДО начисления опыта
    const oldLevel = dino.level;
    
    // Начисляем опыт (ваш текущий код)
    const xpGained = XP_PER_LEVEL[difficulty] || 0;
    dino.xp += xpGained;
    
    // Проверка повышения уровня (ваш текущий код)
    while (dino.xp >= dino.nextLevel) {
        dino.xp -= dino.nextLevel;
        dino.level++;
        dino.nextLevel = Math.floor(dino.nextLevel * 1.2);
    }
    
    // Проверяем, прошли ли мы кратный 10 уровень
    if (Math.floor(oldLevel / 10) !== Math.floor(dino.level / 10)) {
        updateDinoImage(); // Меняем картинку только здесь!
    }
    
    updateDinoUI();
    saveDinoProgress();
}


// Функция для обновления изображения динозаврика
function updateDinoImage() {
    const img = document.getElementById('dinoImage');
    if (!img) {
        console.error('Элемент dinoImage не найден!');
        return;
    }

    // Определяем, какое изображение использовать
    const milestoneLevels = Object.keys(DINO_IMAGES).map(Number).sort((a,b) => b-a);
    let imageToUse = DINO_IMAGES[1]; // По умолчанию
    
    for (const level of milestoneLevels) {
        if (dino.level >= level) {
            imageToUse = DINO_IMAGES[level];
            break;
        }
    }

    // Проверяем, не пытаемся ли загрузить текущее изображение
    if (img.src.endsWith(imageToUse)) {
        console.log('Изображение уже актуально');
        return;
    }

    // Загружаем новое изображение
    const testImage = new Image();
    testImage.onload = function() {
        img.src = imageToUse;
        console.log(`Обновлено изображение на уровень ${dino.level}: ${imageToUse}`);
    };
    testImage.onerror = function() {
        console.error(`Ошибка загрузки: ${imageToUse}`);
        img.src = 'images/dino-level1.png'; // Фолбэк
    };
    testImage.src = imageToUse;
}


// Функция для обновления интерфейса
function updateDinoUI() {
    const levelElement = document.getElementById('dinoLevel');
    const xpElement = document.getElementById('currentXP');
    const nextLevelElement = document.getElementById('requiredXP');
    const progressBar = document.getElementById('dinoProgress');
    
    if (levelElement) levelElement.textContent = dino.level;
    if (xpElement) xpElement.textContent = dino.xp;
    if (nextLevelElement) nextLevelElement.textContent = dino.nextLevel;
    
    const progressPercent = (dino.xp / dino.nextLevel) * 100;
    if (progressBar) progressBar.style.width = `${progressPercent}%`;
    
    console.log('Интерфейс динозаврика обновлён');
}

// Функция для сохранения прогресса
function saveDinoProgress() {
    localStorage.setItem('dinoProgress', JSON.stringify(dino));
    console.log('Прогресс сохранён:', dino);
}

// Функция для загрузки прогресса
function loadDinoProgress() {
    try {
        const saved = localStorage.getItem('dinoProgress');
        if (saved) {
            const parsed = JSON.parse(saved);
            
            // Валидация данных
            if (parsed && typeof parsed === 'object') {
                dinoState = {
                    level: Number(parsed.level) || 1,
                    xp: Number(parsed.xp) || 0,
                    requiredXp: Number(parsed.requiredXp) || BASE_XP
                };
            }
            
            console.log('Прогресс загружен:', dinoState);
            updateDinoUI();
            updateDinoImage();
        }
    } catch (error) {
        console.error('Ошибка загрузки прогресса:', error);
        // Значения по умолчанию
        dinoState = {
            level: 1,
            xp: 0,
            requiredXp: BASE_XP
        };
    }
    updateDinoImage();
}

// Анимация "тряски" для инпута
function shakeElement(element) {
    element.style.transform = 'translateX(0)';
    element.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-10px)' },
        { transform: 'translateX(10px)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(0)' }
    ], {
        duration: 400,
        iterations: 1
    });
}
// Сохранение задач в localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
// Загрузка задач из localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    updateTasksDisplay();
}

// Обновление отображения задач
function updateTasksDisplay() {
    const tasksList = document.getElementById('tasksList');
    const deadlinesList = document.getElementById('deadlinesList');
    const tasksCount = document.querySelector('.tasks-count');
    
    // Получаем только активные (не выполненные) задачи
    const activeTasks = tasks.filter(task => !task.completed);
    
    // Обновляем счетчик
    tasksCount.textContent = `${activeTasks.length} ${getTaskWord(activeTasks.length)}`;
    
    // Очищаем и пересоздаем список задач
    tasksList.innerHTML = '';
    
    if (activeTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-tasks">
                <div class="empty-icon">📝</div>
                <div>Нет активных задач</div>
            </div>
        `;
    } else {
        activeTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            tasksList.appendChild(taskElement);
        });
    }
    
    // То же самое для дедлайнов
    deadlinesList.innerHTML = '';
    const tasksWithDeadlines = activeTasks.filter(task => task.deadline);
    
    if (tasksWithDeadlines.length === 0) {
        deadlinesList.innerHTML = `
            <div class="empty-deadlines">
                <div class="empty-icon">⏰</div>
                <div>Нет задач с дедлайнами</div>
            </div>
        `;
    } else {
        tasksWithDeadlines.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
            .forEach(task => {
                deadlinesList.appendChild(createDeadlineElement(task));
            });
    }
}


// Создание элемента задачи
function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = `task-item ${task.difficulty}`;
    taskElement.dataset.id = task.id;
    
    const deadlineInfo = task.deadline ? getDeadlineInfo(task.deadline) : null;
    
    taskElement.innerHTML = `
        <div class="task-header">
            <span class="task-text">${task.text}</span>
            <span class="task-difficulty">${getDifficultyText(task.difficulty)}</span>
        </div>
        <div class="task-footer">
            ${task.deadline ? `
                <div class="task-timer ${deadlineInfo.class}">
                    <i class="far fa-clock"></i>
                    <span class="timer-text">${deadlineInfo.text}</span>
                </div>
            ` : '<div></div>'}
            <div class="task-actions">
                <button class="task-action-btn complete-btn" title="Завершить"><i class="far fa-check-circle"></i></button>
                <button class="task-action-btn edit-btn" title="Редактировать"><i class="far fa-edit"></i></button>
                <button class="task-action-btn delete-btn" title="Удалить"><i class="far fa-trash-alt"></i></button>
            </div>
        </div>
    `;
    
    return taskElement;
}

// Создание элемента дедлайна
function createDeadlineElement(task) {
    const deadlineInfo = getDeadlineInfo(task.deadline);
    
    const deadlineElement = document.createElement('div');
    deadlineElement.className = `deadline-item ${deadlineInfo.class}`;
    deadlineElement.dataset.id = task.id;
    
    deadlineElement.innerHTML = `
        <div class="deadline-text">
            <i class="fas fa-tasks"></i>
            ${task.text}
            <span class="deadline-timer">${deadlineInfo.text}</span>
        </div>
        <div class="deadline-time">
            <i class="far fa-calendar-alt"></i>
            ${formatDateTime(task.deadline)}
        </div>
    `;
    
    return deadlineElement;
}

// Получение информации о дедлайне
function getDeadlineInfo(deadline) {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffMs <= 0) {
        return {
            text: 'Просрочено!',
            class: 'urgent'
        };
    } else if (diffDays === 0 && diffHours < 12) {
        return {
            text: `Осталось ${diffHours}ч ${diffMinutes}м`,
            class: 'urgent'
        };
    } else if (diffDays < 3) {
        return {
            text: `Осталось ${diffDays}д ${diffHours}ч`,
            class: 'warning'
        };
    } else {
        return {
            text: `Осталось ${diffDays} дней`,
            class: 'normal'
        };
    }
}

// Форматирование даты и времени
function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Обновление таймеров
function updateTimers() {
    document.querySelectorAll('.timer-text').forEach(timer => {
        const taskElement = timer.closest('.task-item');
        const taskId = parseInt(taskElement.dataset.id);
        const task = tasks.find(t => t.id === taskId);
        
        if (task && task.deadline) {
            const deadlineInfo = getDeadlineInfo(task.deadline);
            timer.textContent = deadlineInfo.text;
            
            // Обновляем класс таймера
            const timerContainer = timer.closest('.task-timer');
            timerContainer.className = `task-timer ${deadlineInfo.class}`;
        }
    });
    
    document.querySelectorAll('.deadline-timer').forEach(timer => {
        const deadlineElement = timer.closest('.deadline-item');
        const taskId = parseInt(deadlineElement.dataset.id);
        const task = tasks.find(t => t.id === taskId);
        
        if (task && task.deadline) {
            const deadlineInfo = getDeadlineInfo(task.deadline);
            timer.textContent = deadlineInfo.text;
            
            // Обновляем класс дедлайна
            deadlineElement.className = `deadline-item ${deadlineInfo.class}`;
        }
    });
}

// Получение текста сложности
function getDifficultyText(difficulty) {
    switch(difficulty) {
        case 'easy': return 'Легкая';
        case 'medium': return 'Средняя';
        case 'hard': return 'Сложная';
        default: return '';
    }
}

// Правильное склонение слова "задача"
function getTaskWordForm(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return 'задач';
    }
    
    if (lastDigit === 1) {
        return 'задача';
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
        return 'задачи';
    }
    
    return 'задач';
}

// Открытие модального окна всех задач
function openAllTasksModal(filter = 'all') {
    allTasksList.innerHTML = '';
    
    let filteredTasks = [...tasks];
    
    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (filter === 'easy') {
        filteredTasks = tasks.filter(task => task.difficulty === 'easy');
    } else if (filter === 'medium') {
        filteredTasks = tasks.filter(task => task.difficulty === 'medium');
    } else if (filter === 'hard') {
        filteredTasks = tasks.filter(task => task.difficulty === 'hard');
    } else if (filter === 'deadline') {
        filteredTasks = tasks.filter(task => task.deadline);
    }
    
    if (filteredTasks.length === 0) {
        allTasksList.innerHTML = `
            <div class="empty-all-tasks">
                <div class="empty-icon">📝</div>
                <div>Нет задач по выбранному фильтру</div>
            </div>
        `;
    } else {
        // Сортируем: сначала невыполненные, затем выполненные
        filteredTasks.sort((a, b) => {
            if (a.completed === b.completed) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return a.completed ? 1 : -1;
        });
        
        filteredTasks.forEach(task => {
            const taskElement = createAllTaskElement(task);
            allTasksList.appendChild(taskElement);
        });
    }
    
    allTasksModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Создание элемента задачи для модального окна
function createAllTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.className = `task-item ${task.difficulty} ${task.completed ? 'completed' : ''}`;
    taskElement.dataset.id = task.id;
    
    const deadlineInfo = task.deadline ? getDeadlineInfo(task.deadline) : null;
    
    taskElement.innerHTML = `
        <div class="task-header">
            <span class="task-text">${task.text}</span>
            <span class="task-difficulty">${getDifficultyText(task.difficulty)}</span>
        </div>
        <div class="task-footer">
            ${task.deadline ? `
                <div class="task-timer ${deadlineInfo.class}">
                    <i class="far fa-clock"></i>
                    <span class="timer-text">${deadlineInfo.text}</span>
                </div>
            ` : '<div></div>'}
            <div class="task-time">
                <i class="far fa-calendar-alt"></i>
                ${formatDateTime(task.createdAt)}
            </div>
            <div class="task-actions">
                <button class="task-action-btn toggle-btn" title="${task.completed ? 'Возобновить' : 'Завершить'}">
                    <i class="far ${task.completed ? 'fa-undo-alt' : 'fa-check-circle'}"></i>
                </button>
                <button class="task-action-btn edit-btn" title="Редактировать">
                    <i class="far fa-edit"></i>
                </button>
                <button class="task-action-btn delete-btn" title="Удалить">
                    <i class="far fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `;
    
    return taskElement;
}

// Закрытие модального окна всех задач
function closeAllTasksModal() {
    allTasksModal.classList.remove('active');
    document.body.style.overflow = '';
}

async function handleTaskAction(e) {
    const target = e.target;
    
    // Находим ближайший элемент задачи
    const taskElement = target.closest('.task-item');
    if (!taskElement) return;
    
    // Получаем ID задачи
    const taskId = parseInt(taskElement.dataset.id);
    if (isNaN(taskId)) return;
    
    // Находим задачу в массиве
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;
    
    const task = tasks[taskIndex];
    
    // Обработка выполнения задачи
    if (target.closest('.complete-btn') || target.closest('.toggle-btn')) {
        try {
            // Начисляем опыт в зависимости от сложности
            switch(task.difficulty) {
                case 'easy': addXP("easy"); break;
                case 'medium': addXP("medium"); break;
                case 'hard': addXP("hard"); break;
                default: addXP(10);
            }
            
            // Удаляем задачу из массива
            tasks.splice(taskIndex, 1);
            
            // Сохраняем и обновляем
            await saveTasks();
            updateTasksDisplay();
            
            // Уведомление
            showNotification('Задача выполнена!', 'success');
        } catch (error) {
            console.error('Ошибка при выполнении задачи:', error);
            showNotification('Ошибка при выполнении задачи', 'error');
        }
        return;
    }
    // Обработка отметки выполнения
    if (target.closest('.toggle-btn, .complete-btn')) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        updateTasksDisplay();
        
        showSuccessNotification(
            tasks[taskIndex].completed 
                ? 'Задача завершена!' 
                : 'Задача возобновлена'
        );
        
        if (allTasksModal.classList.contains('active')) {
            const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;
            openAllTasksModal(currentFilter);
        }
    } 
    // Обработка редактирования
    else if (target.closest('.edit-btn')) {
        editTask(taskIndex); // Твоя существующая функция редактирования
        
        showNotification(
            'Редактирование задачи',
            'Внесите изменения в форму редактирования',
            'info'
        );
    }
    // Обработка удаления
    else if (target.closest('.delete-btn')) {
        const confirmed = await showConfirmDialog(
            'Удалить задачу?',
            'Это действие нельзя отменить',
            'Удалить',
            'Отмена'
        );
        
        if (confirmed) {
            tasks.splice(taskIndex, 1);
            saveTasks();
            updateTasksDisplay();
            
            showSuccessNotification('Задача удалена');
            
            if (allTasksModal.classList.contains('active')) {
                const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;
                openAllTasksModal(currentFilter);
            }
        }
    }
}   

// Универсальная функция подтверждения
function showConfirmDialog(title, message, confirmText, cancelText) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            width: 320px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border: 1px solid #e5e7eb;
            overflow: hidden;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.2s ease-out;
        `;
        
        modal.innerHTML = `
            <div style="padding: 16px;">
                <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #111827;">${title}</h3>
                <p style="color: #6b7280; font-size: 14px;">${message}</p>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 8px; padding: 12px 16px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                <button class="cancel-btn" style="padding: 6px 12px; border-radius: 4px; color: #374151; background: white; border: 1px solid #d1d5db; cursor: pointer;">
                    ${cancelText}
                </button>
                <button class="confirm-btn" style="padding: 6px 12px; border-radius: 4px; color: white; background: #ef4444; border: none; cursor: pointer;">
                    ${confirmText}
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.transform = 'translateY(0)';
        }, 10);
        
        modal.querySelector('.confirm-btn').addEventListener('click', () => {
            removeModal();
            resolve(true);
        });
        
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            removeModal();
            resolve(false);
        });
        
        function removeModal() {
            modal.style.opacity = '0';
            modal.style.transform = 'translateY(-20px)';
            setTimeout(() => document.body.removeChild(modal), 200);
        }
    });
}

// Универсальная функция уведомлений
function showNotification(title, message, type = 'success') {
    const colors = {
        success: { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0', icon: 'M5 13l4 4L19 7' },
        error: { bg: '#fef2f2', text: '#991b1b', border: '#fecaca', icon: 'M6 18L18 6M6 6l12 12' },
        info: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
    };
    
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        padding: 12px 16px;
        background: ${colors[type].bg};
        color: ${colors[type].text};
        border-radius: 8px;
        border: 1px solid ${colors[type].border};
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.2s ease-out;
    `;
    
    notif.innerHTML = `
        <svg style="width: 20px; height: 20px; margin-right: 8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="${colors[type].icon}" />
        </svg>
        <div>
            <div style="font-weight: 600;">${title}</div>
            ${message ? `<div style="font-size: 0.9em; margin-top: 2px;">${message}</div>` : ''}
        </div>
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.style.opacity = '1';
        notif.style.transform = 'translateY(0)';
    }, 10);
    
    setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateY(-20px)';
        setTimeout(() => document.body.removeChild(notif), 200);
    }, 3000);
}

// Алиасы для удобства
function showSuccessNotification(message, title = 'Успех') {
    showNotification(title, message, 'success');
}
// Редактирование задачи
function editTask(taskIndex) {
    const task = tasks[taskIndex];
    
    taskInput.value = task.text;
    difficultySelect.value = task.difficulty;
    deadlineInput.value = task.deadline || '';
    
    // Удаляем старую задачу
    tasks.splice(taskIndex, 1);
    saveTasks();
    updateTasksDisplay();
}

// Обработка фильтров
function handleFilterClick(e) {
    const filter = e.target.dataset.filter;
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    openAllTasksModal(filter);
}

// Управление модальными окнами
function setupModalControls() {
    // Профиль
    profileAvatar.addEventListener('click', () => {
        profileModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeProfile.addEventListener('click', () => {
        profileModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Настройки
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    closeSettings.addEventListener('click', () => {
        settingsModal.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Выход
    logoutBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
    
    // Закрытие модальных окон при клике вне их
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// Управление темой
function setupThemeSwitcher() {
    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (btn.dataset.theme === 'dark') {
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
            }
        });
    });
    
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeBtn = document.querySelector(`.theme-btn[data-theme="${savedTheme}"]`);
    if (themeBtn) {
        themeBtn.click();
    }
}

// Управление аватаром
function setupAvatarUpload() {
    uploadBtn.addEventListener('click', () => {
        avatarUpload.click();
    });
    
    avatarUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                avatarPreview.src = event.target.result;
                profileAvatar.src = event.target.result;
                profileAvatarLarge.src = event.target.result;
                localStorage.setItem('avatar', event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Проверяем сохраненный аватар
    const savedAvatar = localStorage.getItem('avatar');
    if (savedAvatar) {
        avatarPreview.src = savedAvatar;
        profileAvatar.src = savedAvatar;
        profileAvatarLarge.src = savedAvatar;
    }
}

// Сохранение настроек
function setupSettingsSave() {
    saveSettingsBtn.addEventListener('click', () => {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword && newPassword !== confirmPassword) {
            alert('Пароли не совпадают!');
            return;
        }
        
        if (newPassword) {
            // Здесь должна быть логика смены пароля
            alert('Пароль успешно изменен!');
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmPassword').value = '';
        }
        
        settingsModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Инициализация приложения
function init() {
    loadTasks();
    loadDinoProgress();

    // Настройка обработчиков событий
    setupModalControls();
    setupThemeSwitcher();
    setupAvatarUpload();
    setupSettingsSave();
    
    // Обновляем таймеры каждую минуту
    setInterval(updateTimers, 60000);
    
    // События
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    viewAllBtn.addEventListener('click', () => openAllTasksModal('all'));
    closeAllTasks.addEventListener('click', closeAllTasksModal);
    
    // Клики по задачам (делегирование событий)
    tasksList.addEventListener('click', handleTaskAction);
    deadlinesList.addEventListener('click', handleTaskAction);
    allTasksList.addEventListener('click', handleTaskAction);
    
    // Фильтры
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', init);


// Функция создания элемента задачи для списка дедлайнов
function createDeadlineElement(task) {
    const deadlineElement = document.createElement('div');
    deadlineElement.className = 'deadline-item';
    
    // Определяем статус дедлайна
    const now = new Date();
    const deadlineDate = new Date(task.deadline);
    const timeDiff = deadlineDate - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    let timerClass = 'normal';
    let timerText = '';
    
    if (timeDiff < 0) {
        // Дедлайн прошел
        timerClass = 'urgent';
        timerText = 'Просрочено';
    } else if (hoursDiff < 24) {
        // Меньше 24 часов осталось
        timerClass = 'urgent';
        timerText = `Осталось: ${Math.floor(hoursDiff)} ч`;
    } else if (hoursDiff < 72) {
        // Меньше 3 дней осталось
        timerClass = 'warning';
        timerText = `Осталось: ${Math.floor(hoursDiff / 24)} д`;
    } else {
        // Больше 3 дней осталось
        timerClass = 'normal';
        timerText = `Осталось: ${Math.floor(hoursDiff / 24)} д`;
    }
    
    // Форматируем дату дедлайна
    const deadlineFormatted = deadlineDate.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    deadlineElement.innerHTML = `
        <div class="deadline-text">
            <i class="fas fa-calendar-alt"></i>
            ${task.text}
            <span class="deadline-timer ${timerClass}">
                <i class="fas fa-clock"></i> ${timerText}
            </span>
        </div>
        <div class="deadline-time">
            <i class="fas fa-calendar-check"></i>
            Дедлайн: ${deadlineFormatted}
        </div>
    `;
    
    return deadlineElement;
}

// Вспомогательная функция для правильного склонения слова "задача"
function getTaskWord(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return 'задач';
    }
    
    if (lastDigit === 1) {
        return 'задача';
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
        return 'задачи';
    }
    
    return 'задач';
}





// Функция обновления статистики профиля
function updateProfileStats() {
    // Считаем статистику
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const activeTasks = totalTasks - completedTasks;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Считаем статистику по сложности
    const easyTasks = tasks.filter(task => task.difficulty === 'easy').length;
    const mediumTasks = tasks.filter(task => task.difficulty === 'medium').length;
    const hardTasks = tasks.filter(task => task.difficulty === 'hard').length;
    
    const totalWithDifficulty = easyTasks + mediumTasks + hardTasks;
    const easyPercentage = totalWithDifficulty > 0 ? Math.round((easyTasks / totalWithDifficulty) * 100) : 0;
    const mediumPercentage = totalWithDifficulty > 0 ? Math.round((mediumTasks / totalWithDifficulty) * 100) : 0;
    const hardPercentage = totalWithDifficulty > 0 ? Math.round((hardTasks / totalWithDifficulty) * 100) : 0;
    
    // Обновляем основную статистику
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('activeTasks').textContent = activeTasks;
    
    // Обновляем прогресс выполнения
    document.getElementById('completionPercent').textContent = `${completionPercentage}%`;
    document.getElementById('progressFill').style.width = `${completionPercentage}%`;
    document.getElementById('progressCount').textContent = `${completedTasks} из ${totalTasks} задач`;
    
    // Обновляем сложность задач
    document.getElementById('easyPercent').textContent = `${easyPercentage}%`;
    document.getElementById('easyProgress').style.width = `${easyPercentage}%`;
    document.getElementById('easyCount').textContent = `${easyTasks} задач`;
    
    document.getElementById('mediumPercent').textContent = `${mediumPercentage}%`;
    document.getElementById('mediumProgress').style.width = `${mediumPercentage}%`;
    document.getElementById('mediumCount').textContent = `${mediumTasks} задач`;
    
    document.getElementById('hardPercent').textContent = `${hardPercentage}%`;
    document.getElementById('hardProgress').style.width = `${hardPercentage}%`;
    document.getElementById('hardCount').textContent = `${hardTasks} задач`;
    
    // Добавляем анимацию для прогресс-баров
    animateProgressBars();
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar-fill, .difficulty-progress');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

function awardXP(difficulty) {
    // Получаем XP за задание
    const xpGained = XP_RATES[difficulty] || 0;
    
    // Добавляем к текущему XP
    dinoXP += xpGained;
    
    // Проверяем уровень
    while(dinoXP >= xpNeeded) {
        dinoXP -= xpNeeded;
        dinoLevel++;
        xpNeeded = Math.floor(BASE_XP * Math.pow(1.2, dinoLevel-1));
        
        // Меняем картинку
        updateDinoImage();
        
        // Показываем уведомление
        showNotification(`Уровень UP! Теперь у вас ${dinoLevel} уровень`, 'success');
    }
    
    // Обновляем прогресс бар
    updateProgressBar();
    
    // Сохраняем
    saveDinoProgress();
}

// В обработчике задач добавляем:
if (target.closest('.complete-btn, .toggle-btn')) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    
    // Начисляем XP только при завершении (не при отмене)
    if (tasks[taskIndex].completed) {
        awardXP(tasks[taskIndex].difficulty);
    }
    
    saveTasks();
    updateTasksDisplay();
}


// Назначаем обработчик кнопке добавления задачи
document.getElementById('addTaskBtn').addEventListener('click', addTask);


// Пути к картинкам динозавра по десяткам уровней



async function handleTaskAction(e) {
    // Находим конкретную кнопку, на которую кликнули
    const target = e.target.closest('button');
    if (!target) return;
    
    // Находим родительский элемент задачи
    const taskElement = target.closest('.task-item, .deadline-item');
    if (!taskElement) return;
    
    // Получаем ID задачи
    const taskId = parseInt(taskElement.dataset.id);
    if (isNaN(taskId)) return;
    
    // Находим задачу в массиве
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    // Обработка завершения задачи
    if (target.classList.contains('complete-btn') || target.classList.contains('toggle-btn')) {
        // Начисляем опыт
        if (!tasks[taskIndex].completed) {
            addXP(tasks[taskIndex].difficulty);
        }
        
        // УДАЛЯЕМ задачу после завершения (как ты и просил)
        tasks.splice(taskIndex, 1);
        saveTasks();
        updateTasksDisplay();
        
        // Обновляем модальное окно, если оно открыто
        if (allTasksModal.classList.contains('active')) {
            const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;
            openAllTasksModal(currentFilter);
        }
        
        showNotification('Задача выполнена и удалена!', 'success');
        return;
    }
    
    // Обработка редактирования
    if (target.classList.contains('edit-btn')) {
        const task = tasks[taskIndex];
        taskInput.value = task.text;
        difficultySelect.value = task.difficulty;
        deadlineInput.value = task.deadline || '';
        
        // Удаляем старую задачу
        tasks.splice(taskIndex, 1);
        saveTasks();
        updateTasksDisplay();
        
        // Закрываем модальное окно, если открыто
        if (allTasksModal.classList.contains('active')) {
            closeAllTasksModal();
        }
        
        showNotification("Успешно!",'Редактируйте задачу', 'info');
        return;
    }
    
    // Обработка удаления
    if (target.classList.contains('delete-btn')) {
        const confirmed = await showConfirmDialog(
            'Удалить задачу?',
            'Это действие нельзя отменить',
            'Удалить',
            'Отмена'
        );
        
        if (confirmed) {
            tasks.splice(taskIndex, 1);
            saveTasks();
            updateTasksDisplay();
            
            if (allTasksModal.classList.contains('active')) {
                const currentFilter = document.querySelector('.filter-btn.active').dataset.filter;
                openAllTasksModal(currentFilter);
            }
            
            showNotification("Успешно!",'Задача удалена', 'success');
        }
    }
}

// Функция для "тряски" элемента при ошибке
function shakeElement(element) {
    element.style.animation = 'shake 0.5s';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}