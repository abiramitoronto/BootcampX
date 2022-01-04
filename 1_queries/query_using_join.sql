SELECT students.name AS students_name, students.start_date AS students_start_date, cohorts.name AS cohort_name, cohorts.start_date AS cohort_start_date
FROM students JOIN cohorts ON cohorts.id = students.cohort_id AND cohorts.start_date != students.start_date;
ORDER BY cohorts.start_date;