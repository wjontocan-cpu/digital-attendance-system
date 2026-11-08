
document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("adminLoginForm");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginMessage = document.getElementById("loginMessage");

    const togglePassword = document.getElementById("togglePassword");
    const forgotPassword = document.getElementById("forgotPassword");

    // PASSWORD SHOW / HIDE
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", function () {

            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                togglePassword.textContent = "🙈";
                togglePassword.setAttribute("aria-label", "Hide password");
            } else {
                passwordInput.type = "password";
                togglePassword.textContent = "👁";
                togglePassword.setAttribute("aria-label", "Show password");
            }

        });
    }

    // ADMIN LOGIN
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            if (!username || !password) {
                showMessage("Please enter your username and password.", "error");
                return;
            }

            const adminData = JSON.parse(
                localStorage.getItem("das_admin") || "null"
            );

            if (!adminData) {
                showMessage(
                    "No admin account found. Please configure the admin account first.",
                    "error"
                );
                return;
            }

            if (
                adminData.username === username &&
                adminData.password === password
            ) {
                localStorage.setItem("das_session", JSON.stringify({
                    username: username,
                    loggedIn: true,
                    loginDate: new Date().toISOString()
                }));

                showMessage("Login successful!", "success");

                setTimeout(function () {
                    window.location.href = "dashboard.html";
                }, 500);

            } else {
                showMessage("Incorrect username or password.", "error");
            }

        });
    }

    // FORGOT PASSWORD
    if (forgotPassword) {
        forgotPassword.addEventListener("click", function (event) {
            event.preventDefault();

            alert(
                "Please contact the system administrator to reset your password."
            );
        });
    }

    // MESSAGE DISPLAY
    function showMessage(message, type) {
        if (!loginMessage) return;

        loginMessage.textContent = message;
        loginMessage.className = "login-message " + type;
        loginMessage.style.display = "block";
    }

});
