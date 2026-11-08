
/* ==========================================
   DIGITAL ATTENDANCE SYSTEM
   SCRIPT.JS
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    // STORAGE
    let employees = JSON.parse(localStorage.getItem("das_employees")) || [];
    let attendanceRecords = JSON.parse(localStorage.getItem("das_attendance")) || [];

    let currentDepartment = "";
    let currentMonthlyDepartment = "";

    const loginPage = document.getElementById("loginPage");
    const dashboardPage = document.getElementById("dashboardPage");
    const employeeAttendancePage = document.getElementById("employeeAttendancePage");

    const adminLoginForm = document.getElementById("adminLoginForm");
    const employeeRegistrationForm = document.getElementById("employeeRegistrationForm");
    const employeeAttendanceForm = document.getElementById("employeeAttendanceForm");

    // SAVE DATA
    function saveEmployees() {
        localStorage.setItem("das_employees", JSON.stringify(employees));
    }

    function saveAttendance() {
        localStorage.setItem("das_attendance", JSON.stringify(attendanceRecords));
    }

    // DATE AND TIME
    function getToday() {
        const date = new Date();
        return date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, "0") + "-" +
            String(date.getDate()).padStart(2, "0");
    }

    function getCurrentTime() {
        return new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    }

    function updateTodayDate() {
        const todayDate = document.getElementById("todayDate");

        if (todayDate) {
            todayDate.textContent = new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            });
        }
    }

    // ADMIN LOGIN
    adminLoginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("adminUsername").value.trim();
        const password = document.getElementById("adminPassword").value;

        const loginMessage = document.getElementById("loginMessage");

        // DEMO ADMIN ACCOUNT
        if (username === "admin" && password === "admin123") {

            loginMessage.textContent = "Login successful!";
            loginMessage.style.color = "green";

            loginPage.style.display = "none";
            dashboardPage.style.display = "flex";
            employeeAttendancePage.style.display = "none";

            updateTodayDate();
            updateDashboard();
            showPage("dashboard");

        } else {

            loginMessage.textContent = "Invalid username or password.";
            loginMessage.style.color = "red";

        }
    });

    // SHOW / HIDE ADMIN PASSWORD
    const togglePassword = document.getElementById("togglePassword");

    if (togglePassword) {
        togglePassword.addEventListener("click", function () {

            const passwordInput = document.getElementById("adminPassword");

            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                togglePassword.textContent = "🙈";
            } else {
                passwordInput.type = "password";
                togglePassword.textContent = "👁";
            }

        });
    }

    // FORGOT PASSWORD
    const forgotPassword = document.getElementById("forgotPassword");

    if (forgotPassword) {
        forgotPassword.addEventListener("click", function (event) {
            event.preventDefault();

            alert(
                "Forgot your password?\n\n" +
                "Please contact the system administrator to reset your password."
            );
        });
    }

    // LOGOUT
    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {

            const confirmLogout = confirm("Are you sure you want to logout?");

            if (confirmLogout) {

                dashboardPage.style.display = "none";
                loginPage.style.display = "flex";

                adminLoginForm.reset();

                document.getElementById("loginMessage").textContent = "";

            }

        });
    }

    // NAVIGATION
    function showPage(pageName) {

        const pages = {
            dashboard: document.getElementById("dashboardOverview"),
            employeeRegistration: document.getElementById("employeeRegistrationPage"),
            attendanceRecord: document.getElementById("attendanceRecordPage"),
            monthlyRecord: document.getElementById("monthlyRecordPage")
        };

        Object.values(pages).forEach(function (page) {
            if (page) {
                page.style.display = "none";
            }
        });

        if (pages[pageName]) {
            pages[pageName].style.display = "block";
        }

        const pageTitle = document.getElementById("pageTitle");
        const pageSubtitle = document.getElementById("pageSubtitle");

        const titles = {
            dashboard: ["Dashboard", "Welcome to your Digital Attendance System."],
            employeeRegistration: ["Employee Registration", "Register faculty and staff information."],
            attendanceRecord: ["Attendance Record", "View and monitor employee attendance."],
            monthlyRecord: ["Monthly Record", "View monthly employee attendance."]
        };

        if (titles[pageName]) {
            pageTitle.textContent = titles[pageName][0];
            pageSubtitle.textContent = titles[pageName][1];
        }

        document.querySelectorAll(".menu-item").forEach(function (item) {
            item.classList.remove("active");

            if (item.dataset.page === pageName) {
                item.classList.add("active");
            }
        });

        if (pageName === "dashboard") {
            updateDashboard();
        }

        if (pageName === "attendanceRecord") {
            showAttendanceDepartments();
        }

        if (pageName === "monthlyRecord") {
            showMonthlyDepartments();
        }
    }

    document.querySelectorAll(".menu-item").forEach(function (item) {
        item.addEventListener("click", function (event) {
            event.preventDefault();
            showPage(item.dataset.page);
        });
    });

    document.querySelectorAll(".quick-action-button").forEach(function (button) {
        button.addEventListener("click", function () {
            showPage(button.dataset.page);
        });
    });

    // EMPLOYEE REGISTRATION
    employeeRegistrationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const employeeID = document.getElementById("employeeID").value.trim();
        const employeeName = document.getElementById("employeeName").value.trim();
        const employeePosition = document.getElementById("employeePosition").value;
        const employeeDepartment = document.getElementById("employeeDepartment").value;
        const employeePassword = document.getElementById("employeePassword").value;

        const registrationMessage = document.getElementById("registrationMessage");

        const existingEmployee = employees.find(function (employee) {
            return employee.employeeID === employeeID;
        });

        if (existingEmployee) {

            registrationMessage.textContent = "Employee ID already registered.";
            registrationMessage.style.color = "red";
            return;

        }

        const newEmployee = {
            employeeID: employeeID,
            employeeName: employeeName,
            position: employeePosition,
            department: employeeDepartment,
            password: employeePassword
        };

        employees.push(newEmployee);

        saveEmployees();

        registrationMessage.textContent = "Employee registered successfully!";
        registrationMessage.style.color = "green";

        employeeRegistrationForm.reset();

        updateDashboard();
    });

    // EMPLOYEE ATTENDANCE PAGE REGISTRATION LINK
    const employeeRegisterLink = document.getElementById("employeeRegisterLink");

    if (employeeRegisterLink) {
        employeeRegisterLink.addEventListener("click", function (event) {
            event.preventDefault();

            alert("Please ask the administrator to open the Employee Registration page.");
        });
    }

    // EMPLOYEE ATTENDANCE VALIDATION
    function validateEmployeeAttendance() {

        const employeeID = document.getElementById("attendanceEmployeeID").value.trim();
        const employeeName = document.getElementById("attendanceEmployeeName").value.trim();
        const employeePassword = document.getElementById("attendanceEmployeePassword").value;

        const employee = employees.find(function (item) {
            return item.employeeID === employeeID &&
                item.employeeName.toLowerCase() === employeeName.toLowerCase() &&
                item.password === employeePassword;
        });

        if (!employee) {
            document.getElementById("employeeAttendanceMessage").textContent =
                "Invalid employee information. Please check your details.";
            document.getElementById("employeeAttendanceMessage").style.color = "red";

            return null;
        }

        return employee;
    }

    // TIME IN
    const timeInButton = document.getElementById("timeInButton");

    if (timeInButton) {
        timeInButton.addEventListener("click", function () {

            if (!employeeAttendanceForm.reportValidity()) {
                return;
            }

            const employee = validateEmployeeAttendance();

            if (!employee) {
                return;
            }

            const today = getToday();

            let record = attendanceRecords.find(function (item) {
                return item.employeeID === employee.employeeID &&
                    item.date === today;
            });

            if (record && record.timeIn) {

                document.getElementById("employeeAttendanceMessage").textContent =
                    "You have already recorded your Time In today.";
                document.getElementById("employeeAttendanceMessage").style.color = "red";

                return;
            }

            if (!record) {

                record = {
                    employeeID: employee.employeeID,
                    employeeName: employee.employeeName,
                    department: employee.department,
                    date: today,
                    timeIn: getCurrentTime(),
                    timeOut: "",
                    status: "Present"
                };

                attendanceRecords.push(record);

            } else {

                record.timeIn = getCurrentTime();
                record.status = "Present";

            }

            saveAttendance();

            document.getElementById("employeeAttendanceMessage").textContent =
                "Time In recorded successfully!";
            document.getElementById("employeeAttendanceMessage").style.color = "green";

            updateDashboard();

        });
    }

    // TIME OUT
    const timeOutButton = document.getElementById("timeOutButton");

    if (timeOutButton) {
        timeOutButton.addEventListener("click", function () {

            if (!employeeAttendanceForm.reportValidity()) {
                return;
            }

            const employee = validateEmployeeAttendance();

            if (!employee) {
                return;
            }

            const today = getToday();

            const record = attendanceRecords.find(function (item) {
                return item.employeeID === employee.employeeID &&
                    item.date === today;
            });

            if (!record || !record.timeIn) {

                document.getElementById("employeeAttendanceMessage").textContent =
                    "Please record your Time In first.";
                document.getElementById("employeeAttendanceMessage").style.color = "red";

                return;
            }

            if (record.timeOut) {

                document.getElementById("employeeAttendanceMessage").textContent =
                    "You have already recorded your Time Out today.";
                document.getElementById("employeeAttendanceMessage").style.color = "red";

                return;
            }

            record.timeOut = getCurrentTime();

            saveAttendance();

            document.getElementById("employeeAttendanceMessage").textContent =
                "Time Out recorded successfully!";
            document.getElementById("employeeAttendanceMessage").style.color = "green";

            updateDashboard();

        });
    }

    // DASHBOARD UPDATE
    function updateDashboard() {

        const today = getToday();

        const totalEmployees = employees.length;

        const presentEmployees = employees.filter(function (employee) {

            return attendanceRecords.some(function (record) {
                return record.employeeID === employee.employeeID &&
                    record.date === today &&
                    record.timeIn;
            });

        });

        const presentCount = presentEmployees.length;

        const absentCount = totalEmployees - presentCount;

        const onTimeCount = presentEmployees.length;

        document.getElementById("totalEmployees").textContent = totalEmployees;
        document.getElementById("presentCount").textContent = presentCount;
        document.getElementById("absentCount").textContent = absentCount;
        document.getElementById("onTimeCount").textContent = onTimeCount;
        document.getElementById("chartTotal").textContent = totalEmployees;

        const attendanceChart = document.getElementById("attendanceChart");

        if (attendanceChart) {

            let presentPercentage = 0;

            if (totalEmployees > 0) {
                presentPercentage = (presentCount / totalEmployees) * 100;
            }

            const presentDegrees = presentPercentage * 3.6;

            attendanceChart.style.background =
                "conic-gradient(#2563eb 0deg " +
                presentDegrees +
                "deg, #ef4444 " +
                presentDegrees +
                "deg 360deg)";

        }

    }

    // ATTENDANCE DEPARTMENT FOLDERS
    function showAttendanceDepartments() {

        document.querySelectorAll(".department-folder").forEach(function (folder) {

            folder.onclick = function () {

                currentDepartment = folder.dataset.department;

                document.getElementById("departmentAttendanceRecords").style.display = "block";

                document.getElementById("attendanceDepartmentTitle").textContent =
                    currentDepartment + " Attendance Records";

                renderAttendanceRecords();

            };

        });

    }

    // ATTENDANCE RECORD TABLE
    function renderAttendanceRecords() {

        const tableBody = document.getElementById("attendanceTableBody");

        const selectedDate = document.getElementById("attendanceDateFilter").value;

        let filteredRecords = attendanceRecords.filter(function (record) {

            return record.department === currentDepartment;

        });

        if (selectedDate) {

            filteredRecords = filteredRecords.filter(function (record) {
                return record.date === selectedDate;
            });

        }

        tableBody.innerHTML = "";

        if (filteredRecords.length === 0) {

            tableBody.innerHTML =
                '<tr><td colspan="7">No attendance records available.</td></tr>';

            return;

        }

        filteredRecords.forEach(function (record) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${record.employeeID}</td>
                <td>${record.employeeName}</td>
                <td>${record.department}</td>
                <td>${record.date}</td>
                <td>${record.timeIn || "-"}</td>
                <td>${record.timeOut || "-"}</td>
                <td>${record.status || "-"}</td>
            `;

            tableBody.appendChild(row);

        });

    }

    document.getElementById("attendanceDateFilter").addEventListener("change", function () {
        renderAttendanceRecords();
    });

    document.getElementById("backToDepartments").addEventListener("click", function () {

        document.getElementById("departmentAttendanceRecords").style.display = "none";

        currentDepartment = "";

    });

    // MONTHLY DEPARTMENT FOLDERS
    function showMonthlyDepartments() {

        document.querySelectorAll(".monthly-department-folder").forEach(function (folder) {

            folder.onclick = function () {

                currentMonthlyDepartment = folder.dataset.department;

                document.getElementById("monthlyDepartmentRecords").style.display = "block";

                document.getElementById("monthlyDepartmentTitle").textContent =
                    currentMonthlyDepartment + " Monthly Records";

                renderMonthlyRecords();

            };

        });

    }

    // MONTHLY TABLE
    function renderMonthlyRecords() {

        const tableBody = document.getElementById("monthlyTableBody");

        const selectedMonth = document.getElementById("monthlyFilter").value;
        const selectedYear = document.getElementById("monthlyYearFilter").value;

        let filteredRecords = attendanceRecords.filter(function (record) {

            return record.department === currentMonthlyDepartment;

        });

        if (selectedMonth) {

            filteredRecords = filteredRecords.filter(function (record) {
                return record.date.substring(5, 7) === selectedMonth;
            });

        }

        if (selectedYear) {

            filteredRecords = filteredRecords.filter(function (record) {
                return record.date.substring(0, 4) === selectedYear;
            });

        }

        tableBody.innerHTML = "";

        if (filteredRecords.length === 0) {

            tableBody.innerHTML =
                '<tr><td colspan="7">No monthly records available.</td></tr>';

            return;

        }

        filteredRecords.forEach(function (record) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${record.employeeID}</td>
                <td>${record.employeeName}</td>
                <td>${record.department}</td>
                <td>${record.date}</td>
                <td>${record.timeIn || "-"}</td>
                <td>${record.timeOut || "-"}</td>
                <td>${record.status || "-"}</td>
            `;

            tableBody.appendChild(row);

        });

    }

    document.getElementById("monthlyFilter").addEventListener("change", function () {
        renderMonthlyRecords();
    });

    document.getElementById("monthlyYearFilter").addEventListener("change", function () {
        renderMonthlyRecords();
    });

    document.getElementById("backToMonthlyDepartments").addEventListener("click", function () {

        document.getElementById("monthlyDepartmentRecords").style.display = "none";

        currentMonthlyDepartment = "";

    });

    // YEAR FILTER
    function populateYearFilter() {

        const yearFilter = document.getElementById("monthlyYearFilter");

        const currentYear = new Date().getFullYear();

        for (let year = currentYear; year >= currentYear - 5; year--) {

            const option = document.createElement("option");

            option.value = year;
            option.textContent = year;

            yearFilter.appendChild(option);

        }

    }

    populateYearFilter();

    // INITIALIZATION
    updateTodayDate();
    updateDashboard();

});
