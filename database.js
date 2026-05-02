const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'attendance.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Create students table
    db.run(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rollNumber TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT,
        className TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create attendance table
    db.run(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId INTEGER NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('Present', 'Absent', 'Late', 'Leave')),
        remarks TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (studentId) REFERENCES students(id),
        UNIQUE(studentId, date)
      )
    `);

    // Create classes table
    db.run(`
      CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        className TEXT UNIQUE NOT NULL,
        section TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables initialized successfully');
  });
}

// Database helper functions
const dbHelper = {
  // Student operations
  getAllStudents: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM students ORDER BY name', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  getStudentById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM students WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  addStudent: (rollNumber, name, email, className) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO students (rollNumber, name, email, className) VALUES (?, ?, ?, ?)',
        [rollNumber, name, email, className],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  },

  deleteStudent: (id) => {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM students WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    });
  },

  updateStudent: (id, rollNumber, name, email, className) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE students SET rollNumber = ?, name = ?, email = ?, className = ? WHERE id = ?',
        [rollNumber, name, email, className, id],
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  },

  // Attendance operations
  markAttendance: (studentId, date, status, remarks = '') => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT OR REPLACE INTO attendance (studentId, date, status, remarks) VALUES (?, ?, ?, ?)',
        [studentId, date, status, remarks],
        (err) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });
  },

  getAttendanceByDate: (date) => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT a.id, a.studentId, s.name, s.rollNumber, a.date, a.status, a.remarks
         FROM attendance a
         JOIN students s ON a.studentId = s.id
         WHERE a.date = ?
         ORDER BY s.name`,
        [date],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  },

  getStudentAttendance: (studentId) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM attendance WHERE studentId = ? ORDER BY date DESC',
        [studentId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  },

  getAttendanceReport: (startDate, endDate) => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT s.id, s.name, s.rollNumber, s.className,
                COUNT(*) as totalDays,
                SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) as presentDays,
                SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) as absentDays,
                SUM(CASE WHEN a.status = 'Late' THEN 1 ELSE 0 END) as lateDays,
                SUM(CASE WHEN a.status = 'Leave' THEN 1 ELSE 0 END) as leaveDays
         FROM students s
         LEFT JOIN attendance a ON s.id = a.studentId AND a.date BETWEEN ? AND ?
         GROUP BY s.id
         ORDER BY s.name`,
        [startDate, endDate],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
};

module.exports = { db, dbHelper };
