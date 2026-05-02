// API Base URL
const API_URL = 'http://localhost:5000/api';

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupStudentForm();
    setupEditModal();
    setupAttendanceForm();
    setupReportForm();
    setTodayDate();
    loadDashboard();
    loadStudents();
});

// ==================== NAVIGATION ====================

function setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and sections
            navBtns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked button and corresponding section
            btn.classList.add('active');
            const sectionId = btn.dataset.section;
            document.getElementById(sectionId).classList.add('active');

            // Reload section data
            if (sectionId === 'dashboard') loadDashboard();
            if (sectionId === 'students') loadStudents();
        });
    });
}

// ==================== DASHBOARD ====================

async function loadDashboard() {
    try {
        const students = await fetch(`${API_URL}/students`).then(r => r.json());
        const today = getTodayDate();
        const attendance = await fetch(`${API_URL}/attendance/date/${today}`).then(r => r.json());

        document.getElementById('totalStudents').textContent = students.length;
        
        const presentCount = attendance.filter(a => a.status === 'Present').length;
        const absentCount = attendance.filter(a => a.status === 'Absent').length;

        document.getElementById('presentToday').textContent = presentCount;
        document.getElementById('absentToday').textContent = absentCount;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// ==================== STUDENTS MANAGEMENT ====================

function setupStudentForm() {
    const form = document.getElementById('studentForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const student = {
            rollNumber: document.getElementById('rollNumber').value,
            name: document.getElementById('studentName').value,
            email: document.getElementById('studentEmail').value,
            className: document.getElementById('className').value
        };

        try {
            const response = await fetch(`${API_URL}/students`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });

            if (response.ok) {
                showAlert('Student added successfully!', 'success');
                form.reset();
                loadStudents();
            } else {
                const error = await response.json();
                showAlert(error.error || 'Error adding student', 'error');
            }
        } catch (error) {
            showAlert('Error adding student: ' + error.message, 'error');
        }
    });
}

async function loadStudents() {
    try {
        const students = await fetch(`${API_URL}/students`).then(r => r.json());
        const tbody = document.getElementById('studentsTableBody');

        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No students added yet</td></tr>';
            return;
        }

        tbody.innerHTML = students.map(student => `
            <tr>
                <td>${student.rollNumber}</td>
                <td>${student.name}</td>
                <td>${student.email || '-'}</td>
                <td>${student.className}</td>
                <td>
                    <button class="btn btn-edit" onclick="openEditModal(${student.id}, '${student.rollNumber}', '${student.name}', '${student.email || ''}', '${student.className}')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteStudent(${student.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading students:', error);
        document.getElementById('studentsTableBody').innerHTML = '<tr><td colspan="5" class="text-center">Error loading students</td></tr>';
    }
}

async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
        const response = await fetch(`${API_URL}/students/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showAlert('Student deleted successfully', 'success');
            loadStudents();
        } else {
            showAlert('Error deleting student', 'error');
        }
    } catch (error) {
        showAlert('Error: ' + error.message, 'error');
    }
}

// ==================== EDIT STUDENT MODAL ====================

function setupEditModal() {
    const modal = document.getElementById('editModal');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('editStudentForm');

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('editStudentId').value;
        const student = {
            rollNumber: document.getElementById('editRollNumber').value,
            name: document.getElementById('editStudentName').value,
            email: document.getElementById('editStudentEmail').value,
            className: document.getElementById('editClassName').value
        };

        try {
            const response = await fetch(`${API_URL}/students/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });

            if (response.ok) {
                showAlert('Student updated successfully', 'success');
                modal.style.display = 'none';
                loadStudents();
            } else {
                showAlert('Error updating student', 'error');
            }
        } catch (error) {
            showAlert('Error: ' + error.message, 'error');
        }
    });
}

function openEditModal(id, rollNumber, name, email, className) {
    document.getElementById('editStudentId').value = id;
    document.getElementById('editRollNumber').value = rollNumber;
    document.getElementById('editStudentName').value = name;
    document.getElementById('editStudentEmail').value = email;
    document.getElementById('editClassName').value = className;
    document.getElementById('editModal').style.display = 'block';
}

// ==================== ATTENDANCE ====================

function setupAttendanceForm() {
    document.getElementById('loadAttendanceBtn').addEventListener('click', loadAttendanceForDate);
}

async function loadAttendanceForDate() {
    const date = document.getElementById('attendanceDate').value;
    if (!date) {
        showAlert('Please select a date', 'error');
        return;
    }

    try {
        const students = await fetch(`${API_URL}/students`).then(r => r.json());
        const attendance = await fetch(`${API_URL}/attendance/date/${date}`).then(r => r.json());

        const attendanceMap = {};
        attendance.forEach(a => {
            attendanceMap[a.studentId] = { status: a.status, remarks: a.remarks };
        });

        const tbody = document.getElementById('attendanceTableBody');
        tbody.innerHTML = students.map(student => {
            const record = attendanceMap[student.id] || { status: '', remarks: '' };
            return `
                <tr>
                    <td>${student.rollNumber}</td>
                    <td>${student.name}</td>
                    <td>
                        <select class="attendance-status" data-student-id="${student.id}">
                            <option value="">--</option>
                            <option value="Present" ${record.status === 'Present' ? 'selected' : ''}>Present</option>
                            <option value="Absent" ${record.status === 'Absent' ? 'selected' : ''}>Absent</option>
                            <option value="Late" ${record.status === 'Late' ? 'selected' : ''}>Late</option>
                            <option value="Leave" ${record.status === 'Leave' ? 'selected' : ''}>Leave</option>
                        </select>
                    </td>
                    <td>
                        <input type="text" class="attendance-remarks" data-student-id="${student.id}" value="${record.remarks}" placeholder="Remarks">
                    </td>
                    <td>
                        <button class="btn btn-primary" onclick="saveAttendance(${student.id}, '${date}')">Save</button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        showAlert('Error loading attendance: ' + error.message, 'error');
    }
}

async function saveAttendance(studentId, date) {
    const status = document.querySelector(`.attendance-status[data-student-id="${studentId}"]`).value;
    const remarks = document.querySelector(`.attendance-remarks[data-student-id="${studentId}"]`).value;

    if (!status) {
        showAlert('Please select a status', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/attendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, date, status, remarks })
        });

        if (response.ok) {
            showAlert('Attendance saved successfully', 'success');
        } else {
            showAlert('Error saving attendance', 'error');
        }
    } catch (error) {
        showAlert('Error: ' + error.message, 'error');
    }
}

// ==================== REPORTS ====================

function setupReportForm() {
    document.getElementById('generateReportBtn').addEventListener('click', generateReport);
    document.getElementById('exportReportBtn').addEventListener('click', exportReportAsCSV);
}

async function generateReport() {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;

    if (!startDate || !endDate) {
        showAlert('Please select both start and end dates', 'error');
        return;
    }

    try {
        const report = await fetch(`${API_URL}/attendance/report?startDate=${startDate}&endDate=${endDate}`)
            .then(r => r.json());

        const tbody = document.getElementById('reportTableBody');

        if (report.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center">No data available for selected period</td></tr>';
            return;
        }

        tbody.innerHTML = report.map(row => {
            const totalDays = row.totalDays || 0;
            const percentage = totalDays > 0 ? ((row.presentDays / totalDays) * 100).toFixed(2) : 0;
            return `
                <tr>
                    <td>${row.rollNumber}</td>
                    <td>${row.name}</td>
                    <td>${row.className}</td>
                    <td>${totalDays}</td>
                    <td>${row.presentDays || 0}</td>
                    <td>${row.absentDays || 0}</td>
                    <td>${row.lateDays || 0}</td>
                    <td>${row.leaveDays || 0}</td>
                    <td><strong>${percentage}%</strong></td>
                </tr>
            `;
        }).join('');

        document.getElementById('exportReportBtn').style.display = 'inline-block';
        showAlert('Report generated successfully', 'success');
    } catch (error) {
        showAlert('Error generating report: ' + error.message, 'error');
    }
}

function exportReportAsCSV() {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    
    const headers = ['Roll No.', 'Name', 'Class', 'Total Days', 'Present', 'Absent', 'Late', 'Leave', 'Percentage'];
    const rows = [];
    
    document.querySelectorAll('#reportTableBody tr').forEach(tr => {
        const cells = Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim());
        rows.push(cells.join(','));
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${startDate}-to-${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// ==================== UTILITY FUNCTIONS ====================

function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function setTodayDate() {
    const today = getTodayDate();
    const dateInput = document.getElementById('attendanceDate');
    if (dateInput) {
        dateInput.value = today;
    }
}

function showAlert(message, type) {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    // Insert at top of container
    const container = document.querySelector('.container');
    container.insertBefore(alert, container.firstChild);

    // Remove after 3 seconds
    setTimeout(() => {
        alert.remove();
    }, 3000);
}
