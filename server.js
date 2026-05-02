const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { dbHelper } = require('./database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ==================== STUDENT ENDPOINTS ====================

// Get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await dbHelper.getAllStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single student
app.get('/api/students/:id', async (req, res) => {
  try {
    const student = await dbHelper.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new student
app.post('/api/students', async (req, res) => {
  try {
    const { rollNumber, name, email, className } = req.body;
    if (!rollNumber || !name || !className) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const studentId = await dbHelper.addStudent(rollNumber, name, email, className);
    res.json({ id: studentId, message: 'Student added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student
app.put('/api/students/:id', async (req, res) => {
  try {
    const { rollNumber, name, email, className } = req.body;
    if (!rollNumber || !name || !className) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    await dbHelper.updateStudent(req.params.id, rollNumber, name, email, className);
    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete student
app.delete('/api/students/:id', async (req, res) => {
  try {
    await dbHelper.deleteStudent(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ATTENDANCE ENDPOINTS ====================

// Mark attendance
app.post('/api/attendance', async (req, res) => {
  try {
    const { studentId, date, status, remarks } = req.body;
    if (!studentId || !date || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    await dbHelper.markAttendance(studentId, date, status, remarks || '');
    res.json({ message: 'Attendance marked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance by date
app.get('/api/attendance/date/:date', async (req, res) => {
  try {
    const attendance = await dbHelper.getAttendanceByDate(req.params.date);
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student attendance history
app.get('/api/attendance/student/:studentId', async (req, res) => {
  try {
    const attendance = await dbHelper.getStudentAttendance(req.params.studentId);
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance report
app.get('/api/attendance/report', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }
    const report = await dbHelper.getAttendanceReport(startDate, endDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('API endpoints:');
  console.log('  GET  /api/students');
  console.log('  GET  /api/students/:id');
  console.log('  POST /api/students');
  console.log('  PUT  /api/students/:id');
  console.log('  DELETE /api/students/:id');
  console.log('  POST /api/attendance');
  console.log('  GET  /api/attendance/date/:date');
  console.log('  GET  /api/attendance/student/:studentId');
  console.log('  GET  /api/attendance/report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD');
});
