# Student Attendance System

A complete full-stack web application for managing student attendance records. Built with Node.js/Express backend, SQLite database, and a responsive HTML/CSS/JavaScript frontend.

## Features

✅ **Student Management**
- Add, edit, and delete students
- Store student details (roll number, name, email, class)
- View all students in a table format

✅ **Attendance Tracking**
- Mark attendance for multiple students at once
- Record attendance status: Present, Absent, Late, Leave
- Add remarks for special cases
- Date-based attendance records

✅ **Reports & Analytics**
- Generate attendance reports for date ranges
- View attendance statistics per student
- Calculate attendance percentage
- Export reports to CSV format

✅ **Dashboard**
- Quick overview of total students
- Today's attendance summary
- Real-time statistics

## Project Structure

```
student-attendance-system/
├── public/
│   ├── index.html          # Main frontend HTML
│   ├── style.css           # CSS styling
│   └── script.js           # Frontend JavaScript
├── server.js               # Express backend server
├── database.js             # SQLite database setup and helpers
├── package.json            # Dependencies
├── attendance.db           # SQLite database (created on first run)
└── README.md              # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `sqlite3` - Database
- `cors` - Cross-origin resource sharing
- `body-parser` - Request parsing
- `nodemon` - Auto-reload during development (optional)

### Step 2: Start the Server

**For production:**
```bash
npm start
```

**For development (with auto-reload):**
```bash
npm run dev
```

The server will start at: `http://localhost:5000`

### Step 3: Open in Browser

Navigate to: **http://localhost:5000**

## Usage Guide

### 1. Dashboard
- View quick statistics on total students and today's attendance
- Monitor attendance patterns at a glance

### 2. Students Section
- **Add Student**: Fill in the form and click "Add Student"
  - Roll Number (required)
  - Name (required)
  - Email (optional)
  - Class/Section (required)
- **Edit Student**: Click "Edit" button and update information
- **Delete Student**: Click "Delete" to remove a student (warning: this action is final)

### 3. Mark Attendance
- Select a date using the date picker
- Click "Load Attendance for Date"
- For each student, select status from dropdown:
  - **Present** - Student was present
  - **Absent** - Student was absent
  - **Late** - Student arrived late
  - **Leave** - Student had authorized leave
- Add remarks if needed (optional)
- Click "Save" to record attendance

### 4. Reports
- Select start and end dates
- Click "Generate Report"
- View attendance statistics:
  - Total days in period
  - Present days
  - Absent days
  - Late days
  - Leave days
  - Attendance percentage
- Click "Export as CSV" to download the report

## API Endpoints

### Students API
```
GET    /api/students              - Get all students
GET    /api/students/:id          - Get single student
POST   /api/students              - Add new student
PUT    /api/students/:id          - Update student
DELETE /api/students/:id          - Delete student
```

### Attendance API
```
POST   /api/attendance            - Mark attendance
GET    /api/attendance/date/:date - Get attendance for specific date
GET    /api/attendance/student/:id - Get student's attendance history
GET    /api/attendance/report     - Get attendance report
```

### Health Check
```
GET    /api/health                - Check server status
```

## API Request Examples

### Add Student
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "rollNumber": "001",
    "name": "John Doe",
    "email": "john@example.com",
    "className": "10A"
  }'
```

### Mark Attendance
```bash
curl -X POST http://localhost:5000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "date": "2024-05-03",
    "status": "Present",
    "remarks": ""
  }'
```

### Get Report
```bash
curl "http://localhost:5000/api/attendance/report?startDate=2024-05-01&endDate=2024-05-31"
```

## Database Schema

### Students Table
```sql
CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  rollNumber TEXT UNIQUE,
  name TEXT,
  email TEXT,
  className TEXT,
  createdAt DATETIME
)
```

### Attendance Table
```sql
CREATE TABLE attendance (
  id INTEGER PRIMARY KEY,
  studentId INTEGER,
  date TEXT,
  status TEXT (Present|Absent|Late|Leave),
  remarks TEXT,
  createdAt DATETIME,
  FOREIGN KEY (studentId) REFERENCES students(id)
)
```

### Classes Table
```sql
CREATE TABLE classes (
  id INTEGER PRIMARY KEY,
  className TEXT UNIQUE,
  section TEXT,
  createdAt DATETIME
)
```

## Troubleshooting

### Port 5000 Already in Use
Change the port in `server.js`:
```javascript
const PORT = process.env.PORT || 3000; // Change to 3000 or any available port
```

### Database Issues
Delete `attendance.db` and restart the server to reset the database.

### CORS Errors
The application is configured with CORS enabled. If you get CORS errors, check that:
- The frontend is running on the same or whitelisted domain
- The API URL in `script.js` is correct

### Changes Not Saving
- Check browser console (F12) for JavaScript errors
- Verify the server is running (`npm start`)
- Check network tab in DevTools to see API responses

## Performance Tips

1. **For Large Datasets**: Add indexes to frequently queried fields
2. **Database Backup**: Regularly backup `attendance.db`
3. **CSV Export**: Use CSV exports for large reports instead of viewing in browser

## Future Enhancements

- [ ] User authentication and role-based access
- [ ] Email notifications for low attendance
- [ ] Monthly/yearly attendance trends
- [ ] Parent/guardian access portal
- [ ] SMS alerts
- [ ] Biometric integration
- [ ] Mobile app
- [ ] Database migration to PostgreSQL for production
- [ ] Advanced analytics and charts

## License

MIT License - Feel free to use this project for educational and commercial purposes.

## Support

For issues or questions, please check:
1. Server console for error messages
2. Browser DevTools console (F12) for frontend errors
3. Network tab to check API responses

---

**Created**: May 2026
**Version**: 1.0.0
