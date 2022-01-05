SELECT assignments.id,assignments.name,assignments.day,assignments.chapter, COUNT(assistance_requests.*) AS total_requests
FROM assistance_requests
JOIN assignments ON assignment_id = assignments.id
GROUP BY assignments.id,assignments.name,assignments.day,assignments.chapter
ORDER BY total_requests DESC;