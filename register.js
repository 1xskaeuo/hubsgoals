 // DOM элементы
 const usernameInput = document.getElementById('username');
 const emailInput = document.getElementById('email');
 const passwordInput = document.getElementById('password');
 const confirmPasswordInput = document.getElementById('confirm-password');
 const registerBtn = document.getElementById('registerBtn');
 
 // Элементы ошибок
 const usernameError = document.getElementById('usernameError');
 const emailError = document.getElementById('emailError');
 const passwordError = document.getElementById('passwordError');
 const confirmPasswordError = document.getElementById('confirmPasswordError');
 
 // Уведомление
 const notification = document.getElementById('notification');
 const notificationTitle = document.getElementById('notificationTitle');
 const notificationMessage = document.getElementById('notificationMessage');
 
 // Разрешенные почтовые домены
 const allowedDomains = [
     'gmail.com', 'yandex.ru', 'mail.ru', 'yahoo.com', 
     'outlook.com', 'hotmail.com', 'protonmail.com', 
     'icloud.com', 'rambler.ru', 'bk.ru', 'list.ru', 
     'inbox.ru', 'live.com', 'me.com', 'aol.com', 'zoho.com'
 ];
 
 // Флаги валидности полей
 let isUsernameValid = false;
 let isEmailValid = false;
 let isPasswordValid = false;
 let isConfirmPasswordValid = false;
 
 // Проверка существующих пользователей в localStorage
 function getRegisteredUsers() {
     const users = localStorage.getItem('registeredUsers');
     return users ? JSON.parse(users) : [];
 }
 
 // Проверка, залогинен ли пользователь
 function isUserLoggedIn() {
     return localStorage.getItem('currentUser') !== null;
 }
 
 // Проверка логина на уникальность
 function isUsernameUnique(username) {
     const users = getRegisteredUsers();
     return !users.some(user => user.username.toLowerCase() === username.toLowerCase());
 }
 
 // Проверка email на уникальность
 function isEmailUnique(email) {
     const users = getRegisteredUsers();
     return !users.some(user => user.email.toLowerCase() === email.toLowerCase());
 }
 
 // Проверка логина
 function validateUsername() {
     const username = usernameInput.value.trim();
     const regex = /^[a-zA-Z0-9_]{4,20}$/;
     
     if (!username) {
         showError(usernameInput, usernameError, 'Логин обязателен');
         isUsernameValid = false;
         return;
     }
     
     if (!regex.test(username)) {
         showError(usernameInput, usernameError, 'Логин должен содержать от 4 до 20 символов (только буквы, цифры и _)');
         isUsernameValid = false;
         return;
     }
     
     if (!isUsernameUnique(username)) {
         showError(usernameInput, usernameError, 'Этот логин уже занят');
         isUsernameValid = false;
         return;
     }
     
     hideError(usernameInput, usernameError);
     isUsernameValid = true;
 }
 
 // Проверка email
 function validateEmail() {
     const email = emailInput.value.trim();
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     
     if (!email) {
         showError(emailInput, emailError, 'Email обязателен');
         isEmailValid = false;
         return;
     }
     
     if (!emailRegex.test(email)) {
         showError(emailInput, emailError, 'Неверный формат email');
         isEmailValid = false;
         return;
     }
     
     // Проверка домена
     const domain = email.split('@')[1];
     if (!allowedDomains.includes(domain)) {
         showError(emailInput, emailError, 'Используйте популярный почтовый сервис (gmail.com, yandex.ru и т.д.)');
         isEmailValid = false;
         return;
     }
     
     if (!isEmailUnique(email)) {
         showError(emailInput, emailError, 'Этот email уже зарегистрирован');
         isEmailValid = false;
         return;
     }
     
     hideError(emailInput, emailError);
     isEmailValid = true;
 }
 
 // Проверка пароля
 function validatePassword() {
     const password = passwordInput.value;
     
     if (!password) {
         showError(passwordInput, passwordError, 'Пароль обязателен');
         isPasswordValid = false;
         return;
     }
     
     if (password.length < 8) {
         showError(passwordInput, passwordError, 'Пароль должен содержать минимум 8 символов');
         isPasswordValid = false;
         return;
     }
     
     if (!/\d/.test(password)) {
         showError(passwordInput, passwordError, 'Пароль должен содержать хотя бы одну цифру');
         isPasswordValid = false;
         return;
     }
     
     if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
         showError(passwordInput, passwordError, 'Пароль должен содержать хотя бы один спецсимвол');
         isPasswordValid = false;
         return;
     }
     
     hideError(passwordInput, passwordError);
     isPasswordValid = true;
     
     // Проверка подтверждения пароля, если оно уже введено
     if (confirmPasswordInput.value) {
         validateConfirmPassword();
     }
 }
 
 // Проверка подтверждения пароля
 function validateConfirmPassword() {
     const password = passwordInput.value;
     const confirmPassword = confirmPasswordInput.value;
     
     if (!confirmPassword) {
         showError(confirmPasswordInput, confirmPasswordError, 'Подтвердите пароль');
         isConfirmPasswordValid = false;
         return;
     }
     
     if (password !== confirmPassword) {
         showError(confirmPasswordInput, confirmPasswordError, 'Пароли не совпадают');
         isConfirmPasswordValid = false;
         return;
     }
     
     hideError(confirmPasswordInput, confirmPasswordError);
     isConfirmPasswordValid = true;
 }
 
 // Показать ошибку
 function showError(input, errorElement, message) {
     input.classList.add('error');
     errorElement.textContent = message;
     errorElement.style.display = 'block';
 }
 
 // Скрыть ошибку
 function hideError(input, errorElement) {
     input.classList.remove('error');
     errorElement.style.display = 'none';
 }
 
 // Показать уведомление
 function showNotification(type, title, message) {
     notification.className = `notification ${type} show`;
     notificationTitle.textContent = title;
     notificationMessage.textContent = message;
     
     setTimeout(() => {
         notification.classList.remove('show');
     }, 5000);
 }
 
 // Проверить все поля и активировать кнопку
 function checkFormValidity() {
     if (isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
         registerBtn.disabled = false;
     } else {
         registerBtn.disabled = true;
     }
 }
 
 // Слушатели событий
 usernameInput.addEventListener('input', () => {
     validateUsername();
     checkFormValidity();
 });
 
 emailInput.addEventListener('input', () => {
     validateEmail();
     checkFormValidity();
 });
 
 passwordInput.addEventListener('input', () => {
     validatePassword();
     checkFormValidity();
     updatePasswordStrength();
 });
 
 confirmPasswordInput.addEventListener('input', () => {
     validateConfirmPassword();
     checkFormValidity();
 });
 
 // Функция для переключения видимости пароля
 function setupPasswordToggle(buttonId, inputId) {
     const toggleBtn = document.getElementById(buttonId);
     const passwordInput = document.getElementById(inputId);
     
     toggleBtn.addEventListener('click', function() {
         const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
         passwordInput.setAttribute('type', type);
         
         if (type === 'password') {
             this.innerHTML = `
                 <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M12 5C5 5 1 12 1 12C1 12 5 19 12 19C19 19 23 12 23 12C23 12 19 5 12 5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                     <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                 </svg>
                 Показать пароль`;
         } else {
             this.innerHTML = `
                 <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M4.5 3.75L19.5 20.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                     <path d="M14.522 14.7749C13.7868 15.4439 12.8145 15.7935 11.821 15.7517C10.8275 15.7098 9.88737 15.3794 9.20874 14.8319C8.53011 14.2844 8.15997 13.5635 8.17237 12.8177C8.18477 12.0719 8.57884 11.3611 9.27403 10.8309" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                     <path d="M6.9375 6.43066C3.1125 8.36291 1.5 11.9999 1.5 11.9999C1.5 11.9999 4.5 18.7499 12 18.7499C13.7574 18.7639 15.4929 18.3588 17.0625 17.5692" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                     <path d="M19.5563 15.8535C21.6001 14.0227 22.5001 11.9999 22.5001 11.9999C22.5001 11.9999 19.5001 5.24991 12.0001 5.24991C11.3506 5.24891 10.7026 5.30191 10.0613 5.40791" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                     <path d="M12.7031 8.31641C13.5007 8.46911 14.2279 8.87688 14.7586 9.46991C15.2893 10.0629 15.5914 10.8065 15.615 11.5809" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                 </svg>
                 Скрыть пароль`;
         }
     });
 }

 // Индикатор сложности пароля
 function updatePasswordStrength() {
     const password = passwordInput.value;
     let strength = 0;
     let hint = '';

     // Проверка длины
     if (password.length >= 8) strength += 1;
     if (password.length >= 12) strength += 1;
     
     // Проверка на наличие цифр
     if (/\d/.test(password)) strength += 1;
     
     // Проверка на наличие спецсимволов
     if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
     
     // Проверка на наличие букв разного регистра
     if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;

     // Установка цвета и ширины индикатора
     let color = '#ff4d4d'; // красный
     if (strength === 1) {
         color = '#ff4d4d';
         hint = 'Слабый пароль';
     } else if (strength === 2 || strength === 3) {
         color = '#ffcc00';
         hint = 'Средний пароль';
     } else if (strength >= 4) {
         color = '#00cc66';
         hint = 'Сильный пароль';
     } else {
         hint = 'Пароль должен содержать минимум 8 символов';
     }

     document.getElementById('strengthMeter').style.width = `${strength * 20}%`;
     document.getElementById('strengthMeter').style.background = color;
     document.getElementById('passwordHint').textContent = hint;
     document.getElementById('passwordHint').style.color = color;
 }

 // Настройка переключателей паролей
 setupPasswordToggle('togglePassword', 'password');
 setupPasswordToggle('toggleConfirmPassword', 'confirm-password');

 // Обработчик кнопки регистрации
 registerBtn.addEventListener('click', function(e) {
     e.preventDefault();
     
     // Дополнительная проверка на всякий случай
     validateUsername();
     validateEmail();
     validatePassword();
     validateConfirmPassword();
     
     if (!isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
         showNotification('error', 'Ошибка', 'Пожалуйста, заполните все поля корректно');
         return;
     }
     
     // Получаем данные формы
     const username = usernameInput.value.trim();
     const email = emailInput.value.trim();
     const password = passwordInput.value;
     
     // Получаем список зарегистрированных пользователей
     const registeredUsers = getRegisteredUsers();
     
     // Проверяем, не зарегистрирован ли уже такой пользователь
     const userExists = registeredUsers.some(user => 
         user.username.toLowerCase() === username.toLowerCase() || 
         user.email.toLowerCase() === email.toLowerCase()
     );
     
     if (userExists) {
         showNotification('error', 'Ошибка', 'Пользователь с таким логином или email уже существует');
         return;
     }
     
     // Создаем нового пользователя
     const newUser = {
         username: username,
         email: email,
         password: password
     };
     
     // Добавляем нового пользователя в список
     registeredUsers.push(newUser);
     localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
     
     // Автоматически логиним пользователя
     localStorage.setItem('currentUser', JSON.stringify(newUser));
     
     // Показываем успешное уведомление
     showNotification('success', 'Успешно!', 'Регистрация прошла успешно');
     
     // Через 2 секунды переходим на главную
     setTimeout(() => {
         window.location.href = 'home.html';
     }, 2000);
 });
 
 // Проверка, если пользователь уже залогинен
 // if (isUserLoggedIn()) {
 //     window.location.href = 'home.html';
 // }
 
 // Инициализация
 validateUsername();
 validateEmail();
 validatePassword();
 validateConfirmPassword();
 checkFormValidity();