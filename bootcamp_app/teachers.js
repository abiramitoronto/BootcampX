const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'nagaabirami'
});

const myArgs = process.argv.slice(2);
const cohort_name = myArgs[0];
console.log(cohort_name);
pool.query(`
SELECT teachers.name AS teacher, cohorts.name AS cohort, COUNT(*) AS total_assistances 
FROM assistance_requests
JOIN teachers ON teacher_id = teachers.id
JOIN students ON student_id = students.id
JOIN cohorts ON cohort_id = cohorts.id
WHERE cohorts.name LIKE '%${cohort_name}%'
GROUP BY teacher, cohort
ORDER BY teacher;
`)
.then(res => {
  res.rows.forEach(user => {
    console.log(`${user.teacher} has an tot assistance id of ${user.total_assistances} and was in the ${user.cohort} cohort`);
  })
})
.catch(err => console.error('query error', err.stack));