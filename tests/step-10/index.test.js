const readCSV = require('../../src/csvReader');
const executeSELECTQuery = require('../../src/index');


test('Execute COUNT Aggregate Query', async () => {
    const query = 'SELECT COUNT(*) FROM student';
    const result = await executeSELECTQuery(query);
    expect(result).toEqual([{ 'COUNT(*)': 4 }]);
});

test('Execute SUM Aggregate Query', async () => {
    const query = 'SELECT SUM(age) FROM student';
    const result = await executeSELECTQuery(query);
    expect(result).toEqual([{ 'SUM(age)': 101 }]);
});

test('Execute AVG Aggregate Query', async () => {
    const query = 'SELECT AVG(age) FROM student';
    const result = await executeSELECTQuery(query);
    // Assuming AVG returns a single decimal point value
    expect(result).toEqual([{ 'AVG(age)': 25.25 }]);
});

test('Execute MIN Aggregate Query', async () => {
    const query = 'SELECT MIN(age) FROM student';
    const result = await executeSELECTQuery(query);
    expect(result).toEqual([{ 'MIN(age)': 22 }]);
});

test('Execute MAX Aggregate Query', async () => {
    const query = 'SELECT MAX(age) FROM student';
    const result = await executeSELECTQuery(query);
    expect(result).toEqual([{ 'MAX(age)': 30 }]);
});

test('Count students per age', async () => {
    const query = 'SELECT age, COUNT(*) FROM student GROUP BY age';
    const result = await executeSELECTQuery(query);
    expect(result).toEqual([
        { age: '22', 'COUNT(*)': 1 },
        { age: '24', 'COUNT(*)': 1 },
        { age: '25', 'COUNT(*)': 1 },
        { age: '30', 'COUNT(*)': 1 }
    ]);
});

test('Count enrollments per course', async () => {
    const query = 'SELECT course, COUNT(*) FROM enrollment GROUP BY course';
    const result = await executeSELECTQuery(query);
    expect(result).toEqual([
        { course: 'Mathematics', 'COUNT(*)': 2 },
        { course: 'Physics', 'COUNT(*)': 1 },
        { course: 'Chemistry', 'COUNT(*)': 1 },
        { course: 'Biology', 'COUNT(*)': 1 }
    ]);
});


test('Count courses per student', async () => {
    const query = 'SELECT student_id, COUNT(*) FROM enrollment GROUP BY student_id';
    const result = await executeSELECTQuery(query);
    expect(result).toEqual([
        { student_id: '1', 'COUNT(*)': 2 },
        { student_id: '2', 'COUNT(*)': 1 },
        { student_id: '3', 'COUNT(*)': 1 },
        { student_id: '5', 'COUNT(*)': 1 }
    ]);
});

test('Count students within a specific age range', async () => {
    const query = 'SELECT age, COUNT(*) FROM student WHERE age > 22 GROUP BY age';
    const result = await executeSELECTQuery(query);
    expect(result).toEqual([
        { age: '24', 'COUNT(*)': 1 },
        { age: '25', 'COUNT(*)': 1 },
        { age: '30', 'COUNT(*)': 1 }
    ]);
});

test('Count enrollments for a specific course', async () => {
    const query = 'SELECT course, COUNT(*) FROM enrollment WHERE course = "Mathematics" GROUP BY course';
    const result = await executeSELECTQuery(query);
    expect(result).toEqual([
        { course: 'Mathematics', 'COUNT(*)': 2 }
    ]);
});

test('Count courses for a specific student', async () => {
    const query = 'SELECT student_id, COUNT(*) FROM enrollment WHERE student_id = 1 GROUP BY student_id';
    const result = await executeSELECTQuery(query);
    expect(result).toEqual([
        { student_id: '1', 'COUNT(*)': 2 }
    ]);
});

test('Average age of students above a certain age', async () => {
    const query = 'SELECT AVG(age) FROM student WHERE age > 22';
    const result = await executeSELECTQuery(query);
    const expectedAverage = (25 + 30 + 24) / 3; // Average age of students older than 22
    expect(result).toEqual([{ 'AVG(age)': expectedAverage }]);
});