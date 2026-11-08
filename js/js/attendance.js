
document.addEventListener("DOMContentLoaded", function () {
    const attendanceTable = document.getElementById("attendanceTableBody");
    const searchInput = document.getElementById("attendanceSearch");
    const departmentFilter = document.getElementById("departmentFilter");
    const dateFilter = document.getElementById("dateFilter");

    if (!attendanceTable) return;

    function loadAttendance() {
        const attendance = JSON.parse(
            localStorage.getItem("das_attendance") || "[]"
        );

        const employees = JSON.parse(
            localStorage.getItem("das_employees") || "[]"
        );

        const search = searchInput ? searchInput.value.toLowerCase() : "";
        const department = departmentFilter ? departmentFilter.value : "";
        const date = dateFilter ? dateFilter.value : "";

        const filtered = attendance.filter(record => {
            const employee = employees.find(
                item => item.employeeID === record.employeeID
            );

            const employeeName = employee ? employee.name : "";

            const matchesSearch =
                record.employeeID.toLowerCase().includes(search) ||
                employeeName.toLowerCase().includes(search);

            const matchesDepartment =
                !department ||
                (employee && employee.department === department);

            const matchesDate = !date || record.date === date;

            return matchesSearch && matchesDepartment && matchesDate;
        });

        attendanceTable.innerHTML = "";

        if (filtered.length === 0) {
            attendanceTable.innerHTML =
                `<tr><td colspan="7">No attendance records found.</td></tr>`;
            return;
        }

        filtered.forEach(record => {
            const employee = employees.find(
                item => item.employeeID === record.employeeID
            );

            const name = employee ? employee.name : "Unknown";
            const dept = employee ? employee.department : "Unknown";

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${escapeHTML(record.employeeID)}</td>
                <td>${escapeHTML(name)}</td>
                <td>${escapeHTML(dept)}</td>
                <td>${escapeHTML(record.date)}</td>
                <td>${escapeHTML(record.timeIn || "--")}</td>
                <td>${escapeHTML(record.timeOut || "--")}</td>
                <td>${escapeHTML(record.status || "Present")}</td>
            `;

            attendanceTable.appendChild(row);
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", loadAttendance);
    }

    if (departmentFilter) {
        departmentFilter.addEventListener("change", loadAttendance);
    }

    if (dateFilter) {
        dateFilter.addEventListener("change", loadAttendance);
    }

    loadAttendance();
});
