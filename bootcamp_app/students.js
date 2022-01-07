const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'nagaabirami'
});

const myArgs = process.argv.slice(2);
const val = [`%${myArgs[0]}%`,myArgs[1]];

const queryString =`SELECT students.id, students.name AS student_name, cohorts.name AS cohort_name
FROM students 
JOIN cohorts ON students.cohort_id = cohorts.id
WHERE cohorts.name LIKE $1
LIMIT $2;`

pool.query(queryString,val)
.then(res => {
  res.rows.forEach(user => {
    console.log(`${user.student_name} has an id of ${user.id} and was in the ${user.cohort_name} cohort`);
  })
})
.catch(err => console.error('query error', err.stack));