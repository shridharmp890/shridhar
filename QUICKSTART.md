# Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies (1 minute)
```bash
npm install
```

### Step 2: Start the Server (30 seconds)
```bash
npm start
```

You should see:
```
Server running at http://localhost:5000
API endpoints:
  GET  /api/students
  GET  /api/students/:id
  POST /api/students
  PUT  /api/students/:id
  DELETE /api/students/:id
  POST /api/attendance
  GET  /api/attendance/date/:date
  GET  /api/attendance/student/:studentId
  GET  /api/attendance/report?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

### Step 3: Open Browser (30 seconds)
Go to: **http://localhost:5000**

---

## First Steps

### Add Some Test Students
1. Go to **Students** tab
2. Fill in the form:
   - Roll Number: 001
   - Name: John Doe
   - Email: john@example.com
   - Class: 10A
3. Click **Add Student**
4. Repeat for more students

### Mark Attendance
1. Go to **Mark Attendance** tab
2. The date will be set to today (change if needed)
3. Click **Load Attendance for Date**
4. For each student:
   - Select status (Present/Absent/Late/Leave)
   - Add remarks (optional)
   - Click **Save**

### View Reports
1. Go to **Reports** tab
2. Select date range
3. Click **Generate Report**
4. View attendance statistics
5. Click **Export as CSV** to download

---

## Common Tasks

### Reset Everything
```bash
# Stop the server (Ctrl+C)
rm attendance.db
npm start
```

### Use a Different Port
Edit `server.js` line 5:
```javascript
const PORT = process.env.PORT || 3000; // Change 5000 to 3000
```

### Check If Server Is Running
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"status":"Server is running"}
```

---

## File Structure Explained

| File | Purpose |
|------|---------|
| `server.js` | Main backend server with all API endpoints |
| `database.js` | SQLite database setup and helper functions |
| `package.json` | Project metadata and dependencies |
| `public/index.html` | Main webpage |
| `public/style.css` | All styling |
| `public/script.js` | Frontend functionality |
| `attendance.db` | Database file (created automatically) |

---

## Troubleshooting

**Q: Getting "Cannot find module 'express'"**
A: Run `npm install` first

**Q: Port 5000 is already in use**
A: Change the port in `server.js` or kill the process using port 5000

**Q: Page is blank or showing error**
A: Check browser console (F12) and server logs

**Q: Can't add students**
A: Make sure server is running and all required fields are filled

---

## Next Steps

- Read README.md for complete documentation
- Explore the API endpoints with curl or Postman
- Customize styling in `public/style.css`
- Add more features to `server.js`

Happy tracking! 📚
