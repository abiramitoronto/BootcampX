SELECT students.name AS student, AVG(assignment_submissions.duration) AS average_assignment_duration, AVG(assignments.duration) AS average_estimated_duration
FROM assignment_submissions
JOIN students ON students.id = student_id
JOIN assignments ON assignment_id = assignments.id
WHERE students.end_date IS NULL
GROUP BY students.name
HAVING AVG(assignment_submissions.duration) < AVG(assignments.duration)
ORDER BY average_assignment_duration, average_estimated_duration;