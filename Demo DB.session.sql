DELETE FROM users
WHERE id = (
    SELECT id FROM users
    ORDER BY 5 DESC
    LIMIT 1
);
