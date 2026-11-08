
/* ==========================================
   DIGITAL ATTENDANCE SYSTEM
   script.js
   ========================================== */

const STORAGE = {
    admin: "das_admin",
    employees: "das_employees",
    attendance: "das_attendance",
    session: "das_session"
};

const departments = [
    "BSCRIM",
    "BSIT",
    "BSHM",
    "BSED",
    "BSBA",
    "BEED"
];

/* ==========================================
   STORAGE HELPERS
   ========================================== */

function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getAdmin() {
    return JSON.parse(localStorage.getItem(STORAGE.admin));
}

function getEmployees() {
    return getData(STORAGE.employees);
}

function getAttendance() {
    return getData(STORAGE.attendance);
}

function generateID(prefix = "EMP") {
    return prefix + Date.now().toString().slice(-6);
}

function today() {
    return new Date().toISOString().split("T")[0];
}

function currentTime() {
    return new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}

/* ==========================================
   PASSWORD EYE ICON
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".toggle-password").forEach(button => {
        button.addEventListener("click", function () {
            const input = this.parentElement.querySelector("input");

            if (!input) return;

            input.type = input.type === "password" ? "text" : "password";

            this.textContent = input.type === "password" ? "👁" : "🙈";
        });
    });
});

/* ==========================================
   ADMIN INITIAL SETUP
   ========================================== */

function setupAdmin(username, password) {
    if (!username || !password) {
        alert("Please enter username and password.");
        return false;
    }

    if (getAdmin()) {
        alert("Admin account is already registered.");
        return false;
    }

    const admin = {
        username: username.trim(),
        password: password,
        dateCreated: new Date().toLocaleDateString()
    };

    localStorage.setItem(STORAGE.admin, JSON.stringify(admin));

    alert("Admin account successfully created!");

    return true;
}

/* ==========================================
   ADMIN LOGIN
   ========================================== */

function adminLogin(username, password) {
    const admin = getAdmin();

    if (!admin) {
        alert("No admin account found. Please create an admin account first.");
        return false;
    }

    if (
        username.trim() === admin.username &&
        password === admin.password
    ) {
        sessionStorage.setItem(STORAGE.session, "admin");

        window.location.href = "dashboard.html";

        return true;
    }

    alert("Incorrect username or password.");
    return false;
}

/* ==========================================
   LOGOUT
   ========================================== */

function logout() {
    sessionStorage.removeItem(STORAGE.session);
    window.location.href = "index.html";
}

/* ==========================================
   ADMIN SESSION CHECK
   ========================================== */

function checkAdminSession() {
    if (sessionStorage.getItem(STORAGE.session) !== "admin") {
        window.location.href = "index.html";
    }
}

/* ==========================================
   EMPLOYEE REGISTRATION
   ========================================== */

function registerEmployee(employeeData) {
    const employees = getEmployees();

    const employeeID = employeeData.employeeID.trim();

    if (
        !employeeID ||
        !employeeData.name ||
        !employeeData.position ||
        !employeeData.department ||
        !employeeData.password
    ) {
        alert("Please complete all employee information.");
        return false;
    }

    const existingEmployee = employees.find(
        employee => employee.employeeID === employeeID
    );

    if (existingEmployee) {
        alert("Employee ID already exists.");
        return false;
    }

    const employee = {
        employeeID: employeeID,
        name: employeeData.name.trim(),
        position: employeeData.position,
        department: employeeData.department,
        password: employeeData.password,
        dateRegistered: new Date().toLocaleDateString(),
        dateCreated: new Date().toISOString()
    };

    employees.push(employee);

    saveData(STORAGE.employees, employees);

    alert("Employee successfully registered!");

    return true;
}

/* ==========================================
   DISPLAY EMPLOYEES
   ========================================== */

function displayEmployees() {
    const container = document.getElementById("employeesList");

    if (!container) return;

    const employees = getEmployees();

    container.innerHTML = "";

    departments.forEach(department => {
        const departmentEmployees = employees.filter(
            employee => employee.department === department
        );

        const folder = document.createElement("div");

        folder.className = "department-folder";

        folder.innerHTML = `
            <h3>📁 ${department}</h3>
            <p>${departmentEmployees.length} Employee(s)</p>
            <div class="department-employee-list"></div>
        `;

        const list = folder.querySelector(".department-employee-list");

        departmentEmployees.forEach(employee => {
            const item = document.createElement("div");

            item.className = "employee-item";

            item.innerHTML = `
                <strong>${escapeHTML(employee.name)}</strong>
                <p>ID: ${escapeHTML(employee.employeeID)}</p>
                <p>Position: ${escapeHTML(employee.position)}</p>
                <p>Date Registered: ${escapeHTML(employee.dateRegistered)}</p>

                <button onclick="editEmployee('${employee.employeeID}')">
                    Edit
                </button>

                <button onclick="deleteEmployee('${employee.employeeID}')">
                    Delete
                </button>
            `;

            list.appendChild(item);
        });

        container.appendChild(folder);
    });
}

/* ==========================================
   EDIT EMPLOYEE
   ========================================== */

function editEmployee(employeeID) {
    const employees = getEmployees();

    const employee = employees.find(
        item => item.employeeID === employeeID
    );

    if (!employee) {
        alert("Employee not found.");
        return;
    }

    const newName = prompt("Enter Employee Name:", employee.name);

    if (newName === null || newName.trim() === "") {
        return;
    }

    const newPosition = prompt(
        "Enter Position (Faculty or Staff):",
        employee.position
    );

    if (newPosition === null || newPosition.trim() === "") {
        return;
    }

    const newDepartment = prompt(
        "Enter Department:",
        employee.department
    );

    if (newDepartment === null || !departments.includes(newDepartment.trim())) {
        alert("Invalid department.");
        return;
    }

    employee.name = newName.trim();
    employee.position = newPosition.trim();
    employee.department = newDepartment.trim();

    saveData(STORAGE.employees, employees);

    alert("Employee information updated!");

    displayEmployees();
}

/* ==========================================
   DELETE EMPLOYEE
   ========================================== */

function deleteEmployee(employeeID) {
    if (!confirm("Are you sure you want to delete this employee?")) {
        return;
    }

    let employees = getEmployees();

    employees = employees.filter(
        employee => employee.employeeID !== employeeID
    );

    saveData(STORAGE.employees, employees);

    alert("Employee successfully deleted!");

    displayEmployees();
}

/* ==========================================
   EMPLOYEE AUTHENTICATION
   ========================================== */

function employeeLogin(employeeID, password) {
    const employees = getEmployees();

    const employee = employees.find(
        item =>
            item.employeeID === employeeID &&
            item.password === password
    );

    if (!employee) {
        alert("Invalid Employee ID or Password.");
        return null;
    }

    sessionStorage.setItem(
        "das_employee_session",
        employee.employeeID
    );

    return employee;
}

/* ==========================================
   TIME IN
   ========================================== */

function employeeTimeIn(employeeID, password) {
    const employee = employeeLogin(employeeID, password);

    if (!employee) return false;

    const attendance = getAttendance();

    const existingRecord = attendance.find(
        record =>
            record.employeeID === employee.employeeID &&
            record.date === today()
    );

    if (existingRecord && existingRecord.timeIn) {
        alert("You have already recorded your Time In today.");
        return false;
    }

    const record = {
        attendanceID: generateID("ATT"),
        employeeID: employee.employeeID,
        employeeName: employee.name,
        department: employee.department,
        date: today(),
        timeIn: currentTime(),
        timeOut: "",
        status: "Present"
    };

    attendance.push(record);

    saveData(STORAGE.attendance, attendance);

    alert("Time In successfully recorded!");

    return true;
}

/* ==========================================
   TIME OUT
   ========================================== */

function employeeTimeOut(employeeID, password) {
    const employee = employeeLogin(employeeID, password);

    if (!employee) return false;

    const attendance = getAttendance();

    const record = attendance.find(
        item =>
            item.employeeID === employee.employeeID &&
            item.date === today()
    );

    if (!record || !record.timeIn) {
        alert("Please record your Time In first.");
        return false;
    }

    if (record.timeOut) {
        alert("You have already recorded your Time Out.");
        return false;
    }

    record.timeOut = currentTime();

    saveData(STORAGE.attendance, attendance);

    alert("Time Out successfully recorded!");

    return true;
}

/* ==========================================
   ATTENDANCE RECORD
   ========================================== */

function displayAttendance() {
    const tableBody = document.getElementById("attendanceTableBody");

    if (!tableBody) return;

    const attendance = getAttendance();

    tableBody.innerHTML = "";

    attendance.forEach(record => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(record.employeeID)}</td>
            <td>${escapeHTML(record.employeeName)}</td>
            <td>${escapeHTML(record.department)}</td>
            <td>${escapeHTML(record.date)}</td>
            <td>${escapeHTML(record.timeIn || "-")}</td>
            <td>${escapeHTML(record.timeOut || "-")}</td>
            <td>${escapeHTML(record.status)}</td>
        `;

        tableBody.appendChild(row);
    });
}

/* ==========================================
   MONTHLY RECORD
   ========================================== */

function displayMonthlyRecord(month, department) {
    const tableBody = document.getElementById("monthlyTableBody");

    if (!tableBody) return;

    const attendance = getAttendance();

    const filteredRecords = attendance.filter(record => {
        const recordMonth = record.date.substring(0, 7);

        return (
            recordMonth === month &&
            (department === "All" || record.department === department)
        );
    });

    tableBody.innerHTML = "";

    filteredRecords.forEach(record => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(record.employeeID)}</td>
            <td>${escapeHTML(record.employeeName)}</td>
            <td>${escapeHTML(record.department)}</td>
            <td>${escapeHTML(record.date)}</td>
            <td>${escapeHTML(record.timeIn || "-")}</td>
            <td>${escapeHTML(record.timeOut || "-")}</td>
            <td>${escapeHTML(record.status)}</td>
        `;

        tableBody.appendChild(row);
    });
}

/* ==========================================
   DASHBOARD SUMMARY
   ========================================== */

function displayDashboardSummary() {
    const employees = getEmployees();
    const attendance = getAttendance();

    const todayRecords = attendance.filter(
        record => record.date === today()
    );

    const totalEmployees = employees.length;

    const present = todayRecords.filter(
        record => record.status === "Present"
    ).length;

    const absent = Math.max(0, totalEmployees - present);

    const totalElement = document.getElementById("totalEmployees");
    const presentElement = document.getElementById("presentEmployees");
    const absentElement = document.getElementById("absentEmployees");

    if (totalElement) totalElement.textContent = totalEmployees;
    if (presentElement) presentElement.textContent = present;
    if (absentElement) absentElement.textContent = absent;
}

/* ==========================================
   SEARCH EMPLOYEE
   ========================================== */

function searchEmployee(keyword) {
    const employees = getEmployees();

    const result = employees.filter(employee =>
        employee.name.toLowerCase().includes(keyword.toLowerCase()) ||
        employee.employeeID.toLowerCase().includes(keyword.toLowerCase()) ||
        employee.department.toLowerCase().includes(keyword.toLowerCase())
    );

    return result;
}

/* ==========================================
   SAFE HTML TEXT
   ========================================== */

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ==========================================
   INITIALIZE PAGE
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {
    displayEmployees();
    displayAttendance();
    displayDashboardSummary();
});
