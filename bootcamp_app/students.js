const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'nagaabirami'
});

const myArgs = process.argv.slice(2);
const cohort_name = myArgs[0];
const limit = myArgs[1];
pool.query(`
SELECT students.id, students.name AS student_name, cohorts.name AS cohort_name
FROM students 
JOIN cohorts ON students.cohort_id = cohorts.id
WHERE cohorts.name LIKE '%${cohort_name}%'
LIMIT ${limit};
`)
.then(res => {
  res.rows.forEach(user => {
    console.log(`${user.student_name} has an id of ${user.id} and was in the ${user.cohort_name} cohort`);
  })
})
.catch(err => console.error('query error', err.stack));