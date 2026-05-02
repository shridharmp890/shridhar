// Sample Data Loader
// Run this file to populate the database with test data
// Usage: node load-sample-data.js

const { dbHelper } = require('./database');

const sampleStudents = [
    { rollNumber: '001', name: 'Aarav Kumar', email: 'aarav.kumar@school.edu', className: '10A' },
    { rollNumber: '002', name: 'Bhavna Patel', email: 'bhavna.patel@school.edu', className: '10A' },
    { rollNumber: '003', name: 'Chirag Singh', email: 'chirag.singh@school.edu', className: '10A' },
    { rollNumber: '004', name: 'Diya Sharma', email: 'diya.sharma@school.edu', className: '10B' },
    { rollNumber: '005', name: 'Eshan Gupta', email: 'eshan.gupta@school.edu', className: '10B' },
    { rollNumber: '006', name: 'Fatima Khan', email: 'fatima.khan@school.edu', className: '10B' },
    { rollNumber: '007', name: 'Gaurav Verma', email: 'gaurav.verma@school.edu', className: '10C' },
    { rollNumber: '008', name: 'Harshita Das', email: 'harshita.das@school.edu', className: '10C' },
    { rollNumber: '009', name: 'Ishan Reddy', email: 'ishan.reddy@school.edu', className: '10C' },
    { rollNumber: '010', name: 'Jaya Nair', email: 'jaya.nair@school.edu', className: '10A' }
];

const sampleAttendance = [
    // Today's attendance (set dynamically)
    // Previous week's attendance
    { rollNumber: '001', date: '2024-04-29', status: 'Present' },
    { rollNumber: '001', date: '2024-04-30', status: 'Present' },
    { rollNumber: '002', date: '2024-04-29', status: 'Absent' },
    { rollNumber: '002', date: '2024-04-30', status: 'Present' },
    { rollNumber: '003', date: '2024-04-29', status: 'Late' },
    { rollNumber: '003', date: '2024-04-30', status: 'Present' },
    { rollNumber: '004', date: '2024-04-29', status: 'Present' },
    { rollNumber: '004', date: '2024-04-30', status: 'Leave' },
    { rollNumber: '005', date: '2024-04-29', status: 'Present' },
    { rollNumber: '005', date: '2024-04-30', status: 'Present' },
    { rollNumber: '006', date: '2024-04-29', status: 'Present' },
    { rollNumber: '006', date: '2024-04-30', status: 'Absent' },
    { rollNumber: '007', date: '2024-04-29', status: 'Present' },
    { rollNumber: '007', date: '2024-04-30', status: 'Present' },
    { rollNumber: '008', date: '2024-04-29', status: 'Late' },
    { rollNumber: '008', date: '2024-04-30', status: 'Present' },
    { rollNumber: '009', date: '2024-04-29', status: 'Absent' },
    { rollNumber: '009', date: '2024-04-30', status: 'Present' },
    { rollNumber: '010', date: '2024-04-29', status: 'Present' },
    { rollNumber: '010', date: '2024-04-30', status: 'Present' },
    // This month's attendance
    { rollNumber: '001', date: '2024-05-01', status: 'Present' },
    { rollNumber: '002', date: '2024-05-01', status: 'Present' },
    { rollNumber: '003', date: '2024-05-01', status: 'Late' },
    { rollNumber: '004', date: '2024-05-01', status: 'Absent' },
    { rollNumber: '005', date: '2024-05-01', status: 'Present' },
    { rollNumber: '006', date: '2024-05-01', status: 'Present' },
    { rollNumber: '007', date: '2024-05-01', status: 'Present' },
    { rollNumber: '008', date: '2024-05-01', status: 'Present' },
    { rollNumber: '009', date: '2024-05-01', status: 'Absent' },
    { rollNumber: '010', date: '2024-05-01', status: 'Leave' },
];

async function loadSampleData() {
    try {
        console.log('Loading sample data...\n');

        // Add students
        console.log('Adding students...');
        const studentMap = {};
        for (const student of sampleStudents) {
            try {
                const id = await dbHelper.addStudent(
                    student.rollNumber,
                    student.name,
                    student.email,
                    student.className
                );
                studentMap[student.rollNumber] = id;
                console.log(`✓ Added: ${student.name}`);
            } catch (error) {
                // Student might already exist, try to get it
                console.log(`! ${student.name} already exists`);
            }
        }

        console.log('\nAdding attendance records...');
        
        // Get all students to match roll numbers with IDs
        const students = await dbHelper.getAllStudents();
        const studentsByRoll = {};
        students.forEach(s => {
            studentsByRoll[s.rollNumber] = s.id;
        });

        // Add attendance
        for (const record of sampleAttendance) {
            const studentId = studentsByRoll[record.rollNumber];
            if (studentId) {
                try {
                    await dbHelper.markAttendance(
                        studentId,
                        record.date,
                        record.status
                    );
                    console.log(`✓ ${record.rollNumber} - ${record.date}: ${record.status}`);
                } catch (error) {
                    console.log(`! ${record.rollNumber} - ${record.date} already exists`);
                }
            }
        }

        console.log('\n✅ Sample data loaded successfully!');
        console.log('\nNext steps:');
        console.log('1. Start the server: npm start');
        console.log('2. Open http://localhost:5000');
        console.log('3. View the dashboard to see test data');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error loading sample data:', error);
        process.exit(1);
    }
}

// Run the function
loadSampleData();
