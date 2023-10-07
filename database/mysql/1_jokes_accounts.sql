CREATE USER IF NOT EXISTS 'reader' IDENTIFIED BY 'test'; 
GRANT SELECT ON bavarian_jokes.joke TO 'reader';
GRANT SELECT ON bavarian_jokes.jk_pair TO 'reader';
GRANT SELECT ON bavarian_jokes.keyword TO 'reader';
