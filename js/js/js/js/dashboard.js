
document.addEventListener("DOMContentLoaded", function () {
    const totalEmployeesElement = document.getElementById("totalEmployees");
    const presentEmployeesElement = document.getElementById("presentEmployees");
    const absentEmployeesElement = document.getElementById("absentEmployees");
    const onTimeEmployeesElement = document.getElementById("onTimeEmployees");

    function loadDashboardSummary() {
        const employees = JSON.parse(
            localStorage.getItem("das_employees") || "[]"
        );

        const attendance = JSON.parse(
            localStorage.getItem("das_attendance") || "[]"
        );

        const today = new Date().toLocaleDateString();

        const todayAttendance = attendance.filter(
            record => record.date === today
        );

        const presentIDs = new Set(
            todayAttendance.map(record => record.employeeID)
        );

        const totalEmployees = employees.length;
        const presentEmployees = presentIDs.size;
        const absentEmployees = Math.max(
            totalEmployees - presentEmployees,
            0
        );

        if (totalEmployeesElement) {
            totalEmployeesElement.textContent = totalEmployees;
        }

        if (presentEmployeesElement) {
            presentEmployeesElement.textContent = presentEmployees;
        }

        if (absentEmployeesElement) {
            absentEmployeesElement.textContent = absentEmployees;
        }

        if (onTimeEmployeesElement) {
            onTimeEmployeesElement.textContent = todayAttendance.filter(
                record => record.status === "Present"
            ).length;
        }
    }

    loadDashboardSummary();

    window.loadDashboardSummary = loadDashboardSummary;
});
