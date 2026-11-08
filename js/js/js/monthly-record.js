
document.addEventListener("DOMContentLoaded", function () {
    const monthInput = document.getElementById("monthlyMonth");
    const departmentSelect = document.getElementById("monthlyDepartment");
    const tableBody = document.getElementById("monthlyTableBody");

    const totalRecords = document.getElementById("monthlyTotalRecords");
    const presentCount = document.getElementById("monthlyPresent");
    const employeeCount = document.getElementById("monthlyEmployees");

    if (!tableBody) return;

    function loadMonthlyRecords() {
        const attendance = JSON.parse(
            localStorage.getItem("das_attendance") || "[]"
        );

        const employees = JSON.parse(
            localStorage.getItem("das_employees") || "[]"
        );

        const selectedMonth = monthInput ? monthInput.value : "";
        const selectedDepartment = departmentSelect
            ? departmentSelect.value
            : "";

        const records = attendance.filter(record => {
            const employee = employees.find(
                item => item.employeeID === record.employeeID
            );

            const matchesMonth =
                !selectedMonth ||
                record.date.substring(0, 7) === selectedMonth;

            const matchesDepartment =
                !selectedDepartment ||
                (employee && employee.department === selectedDepartment);

            return matchesMonth && matchesDepartment;
        });

        tableBody.innerHTML = "";

        const uniqueEmployees = new Set(
            records.map(record => record.employeeID)
        );

        if (totalRecords) totalRecords.textContent = records.length;
        if (presentCount) {
            presentCount.textContent = records.filter(
                record => record.status === "Present"
            ).length;
        }

        if (employeeCount) employeeCount.textContent = uniqueEmployees.size;

        if (records.length === 0) {
            tableBody.innerHTML =
                `<tr><td colspan="7">No monthly records found.</td></tr>`;
            return;
        }

        records.forEach(record => {
            const employee = employees.find(
                item => item.employeeID === record.employeeID
            );

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${escapeHTML(record.employeeID)}</td>
                <td>${escapeHTML(employee ? employee.name : "Unknown")}</td>
                <td>${escapeHTML(employee ? employee.department : "Unknown")}</td>
                <td>${escapeHTML(record.date)}</td>
                <td>${escapeHTML(record.timeIn || "--")}</td>
                <td>${escapeHTML(record.timeOut || "--")}</td>
                <td>${escapeHTML(record.status || "Present")}</td>
            `;

            tableBody.appendChild(row);
        });
    }

    window.loadMonthlyRecords = loadMonthlyRecords;

    if (monthInput) {
        monthInput.addEventListener("change", loadMonthlyRecords);
    }

    if (departmentSelect) {
        departmentSelect.addEventListener("change", loadMonthlyRecords);
    }

    loadMonthlyRecords();
});
