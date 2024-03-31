const readCSV = require('../../src/csvReader.js');
const {parseJoinClause, parseQuery} = require('../../src/queryParser.js');
const executeSELECTQuery = require('../../src/index.js');

test('Read CSV File', async () => {
    const data = await readCSV('./sample.csv');
    expect(data.length).toBeGreaterThan(0);
    expect(data.length).toBe(3);
    expect(data[0].name).toBe('John');
    expect(data[0].age).toBe('30');
});

test('Parse SQL Query', () => {
    const query = 'SELECT id, name FROM sample';
    const parsed = parseQuery(query);
    expect(parsed).toEqual({
        fields: ['id', 'name'],
        table: 'sample',
        whereClauses: [],
        joinType: null, // Add this line
        joinCondition: null,
        joinTable: null,
        groupByFields: null,
        hasAggregateWithoutGroupBy: false
    });
});


test('Execute SQL Query', async () => {
    const query = 'SELECT id, name FROM sample';
    const result = await executeSELECTQuery(query);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('name');
    expect(result[0]).not.toHaveProperty('age');
    expect(result[0]).toEqual({ id: '1', name: 'John' });
});

test('Parse SQL Query with WHERE Clause', () => {
    const query = 'SELECT id, name FROM sample WHERE age = 25';
    const parsed = parseQuery(query);
    expect(parsed).toEqual({
        fields: ['id', 'name'],
        table: 'sample',
        whereClauses: [{
            "field": "age",
            "operator": "=",
            "value": "25",
        }],
        joinType: null,
        joinCondition: null,
        joinTable: null,
        groupByFields: null,
        hasAggregateWithoutGroupBy: false
    });
});

test('Execute SQL Query with WHERE Clause', async () => {
    const query = 'SELECT id, name FROM sample WHERE age = 25';
    const result = await executeSELECTQuery(query);
    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('name');
    expect(result[0].id).toBe('2');
});

test('Parse SQL Query with Multiple WHERE Clauses', () => {
    const query = 'SELECT id, name FROM sample WHERE age = 30 AND name = John';
    const parsed = parseQuery(query);
    expect(parsed).toEqual({
        fields: ['id', 'name'],
        table: 'sample',
        whereClauses: [
            {
                field: 'age',
                operator: '=',
                value: '30'
            },
            {
                field: 'name',
                operator: '=',
                value: 'John'
            }
        ],
        joinType: null,
        joinCondition: null,
        joinTable: null,
        groupByFields: null,
        hasAggregateWithoutGroupBy: false
    });
});


test('Execute SQL Query with Complex WHERE Clause', async () => {
    const query = 'SELECT id, name FROM sample WHERE age = 30 AND name = John';
    const result = await executeSELECTQuery(query);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual({ id: '1', name: 'John' });
});

test('Execute SQL Query with Greater Than', async () => {
    const queryWithGT = 'SELECT id FROM sample WHERE age > 22';
    const result = await executeSELECTQuery(queryWithGT);
    expect(result.length).toEqual(3);
    expect(result[0]).toHaveProperty('id');
});

test('Execute SQL Query with Not Equal to', async () => {
    const queryWithGT = 'SELECT name FROM sample WHERE age != 25';
    const result = await executeSELECTQuery(queryWithGT);
    expect(result.length).toEqual(3);
    expect(result[0]).toHaveProperty('name');
});

test('Parse SQL Query with INNER JOIN', async () => {
    const query = 'SELECT sample.name, enrollment.course FROM sample INNER JOIN enrollment ON sample.id=enrollment.sample_id';
    const result = await parseQuery(query);
    expect(result).toEqual({
        fields: ['sample.name', 'enrollment.course'],
        table: 'sample',
        whereClauses: [],
        joinTable: 'enrollment',
        joinType:'INNER',
        joinCondition: { left: 'sample.id', right: 'enrollment.sample_id' },
        groupByFields: null,
        hasAggregateWithoutGroupBy: false
    })
});

test('Parse SQL Query with INNER JOIN and WHERE Clause', async () => {
    const query = 'SELECT sample.name, enrollment.course FROM sample INNER JOIN enrollment ON sample.id = enrollment.sample_id WHERE sample.age > 20';
    const result = await parseQuery(query);
    expect(result).toEqual({
        fields: ['sample.name', 'enrollment.course'],
        table: 'sample',
        whereClauses: [{ field: 'sample.age', operator: '>', value: '20' }],
        joinTable: 'enrollment',
        joinType: 'INNER',
        joinCondition: { left: 'sample.id', right: 'enrollment.sample_id' },
        groupByFields: null,
        hasAggregateWithoutGroupBy: false
    })
});

test('Execute SQL Query with INNER JOIN', async () => {
    const query = 'SELECT sample.name, enrollment.course FROM sample INNER JOIN enrollment ON sample.id=enrollment.sample_id';
    const result = await executeSELECTQuery(query);
    expect(result.length).toEqual(3);
    expect(result[0]).toEqual(expect.objectContaining({
        "enrollment.course": "Mathematics",
        "sample.name": "John"
    }));
});

test('Execute SQL Query with INNER JOIN and a WHERE Clause', async () => {
    const query = 'SELECT sample.name, enrollment.course, sample.age FROM sample INNER JOIN enrollment ON sample.id = enrollment.sample_id WHERE sample.age > 25';
    const result = await executeSELECTQuery(query);
    
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual(expect.objectContaining({
        "enrollment.course": "Mathematics",
        "sample.name": "John"
    }));
});