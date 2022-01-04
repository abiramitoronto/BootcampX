SELECT day, COUNT(assignments.*)
FROM assignments
GROUP BY day
HAVING COUNT(assignments.*) >= 10
ORDER BY day;
