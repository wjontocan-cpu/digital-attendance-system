
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginMessage = document.getElementById("loginMessage");

    const setupForm = document.getElementById("setupAdminForm");
    const setupUsername = document.getElementById("setupUsername");
    const setupPassword = document.getElementById("setupPassword");
    const setupMessage = document.getElementById("setupMessage");

    // Check if an admin account already exists
    const adminAccount = localStorage.getItem("das_admin");

    if (setupForm && loginForm) {
        if (!adminAccount) {
            setupForm.style.display = "block";
            loginForm.style.display = "none";
        } else {
            setupForm.style.display = "none";
            loginForm.style.display = "block";
        }
    }

    // Create the first admin account
    if (setupForm) {
        setupForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = setupUsername.value.trim();
            const password = setupPassword.value;

            if (username.length < 4) {
                showMessage(setupMessage, "Username must be at least 4 characters.", "error");
                return;
            }

            if (password.length < 8) {
                showMessage(setupMessage, "Password must be at least 8 characters.", "error");
                return;
            }

            if (typeof setupAdmin === "function") {
                setupAdmin(username, password);

                showMessage(
                    setupMessage,
                    "Admin account created successfully!",
                    "success"
                );

                setupForm.style.display = "none";
                loginForm.style.display = "block";
            } else {
                showMessage(
                    setupMessage,
                    "Setup function is missing. Please check script.js.",
                    "error"
                );
            }
        });
    }

    // Admin login
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            if (!username || !password) {
                showMessage(loginMessage, "Please enter your username and password.", "error");
                return;
            }

            if (typeof adminLogin === "function") {
                const success = adminLogin(username, password);

                if (success) {
                    showMessage(loginMessage, "Login successful!", "success");
                    window.location.href = "dashboard.html";
                } else {
                    showMessage(
                        loginMessage,
                        "Incorrect username or password.",
                        "error"
                    );
                }
            } else {
                showMessage(
                    loginMessage,
                    "Login function is missing. Please check script.js.",
                    "error"
                );
            }
        });
    }

    // Password visibility toggle
    document.querySelectorAll(".toggle-password").forEach(function (button) {
        button.addEventListener("click", function () {
            const wrapper = button.parentElement;
            const input = wrapper.querySelector("input");

            if (!input) return;

            if (input.type === "password") {
                input.type = "text";
                button.textContent = "Hide";
            } else {
                input.type = "password";
                button.textContent = "Show";
            }
        });
    });

    function showMessage(element, message, type) {
        if (!element) return;

        element.textContent = message;
        element.className = "message " + type;
        element.style.display = "block";
    }
});
