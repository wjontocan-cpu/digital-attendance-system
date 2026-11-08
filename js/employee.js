
document.addEventListener("DOMContentLoaded", function () {
    const registrationForm = document.getElementById("employeeRegistrationForm");

    if (!registrationForm) return;

    registrationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const employeeData = {
            employeeID: document.getElementById("employeeID").value.trim(),
            name: document.getElementById("employeeName").value.trim(),
            position: document.getElementById("employeePosition").value,
            department: document.getElementById("employeeDepartment").value,
            password: document.getElementById("employeePassword").value
        };

        if (
            !employeeData.employeeID ||
            !employeeData.name ||
            !employeeData.position ||
            !employeeData.department ||
            !employeeData.password
        ) {
            alert("Please complete all required fields.");
            return;
        }

        const employees = JSON.parse(
            localStorage.getItem("das_employees") || "[]"
        );

        const existingEmployee = employees.find(
            employee => employee.employeeID === employeeData.employeeID
        );

        if (existingEmployee) {
            alert("Employee ID already exists.");
            return;
        }

        employeeData.dateRegistered = new Date().toLocaleDateString();

        employees.push(employeeData);

        localStorage.setItem("das_employees", JSON.stringify(employees));

        alert("Employee registered successfully!");

        registrationForm.reset();

        if (typeof displayEmployees === "function") {
            displayEmployees();
        }
    });
});
