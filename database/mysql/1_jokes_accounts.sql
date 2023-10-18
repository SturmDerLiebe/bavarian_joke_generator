CREATE USER IF NOT EXISTS 'reader' IDENTIFIED BY 'readerPW'; 
GRANT SELECT ON bavarian_jokes.joke TO 'reader';
GRANT SELECT ON bavarian_jokes.jk_pair TO 'reader';
GRANT SELECT ON bavarian_jokes.keyword TO 'reader';

CREATE USER IF NOT EXISTS 'submitter' IDENTIFIED BY 'submitterPW'; 
GRANT SELECT ON bavarian_jokes.joke TO 'submitter';
GRANT SELECT ON bavarian_jokes.jk_pair TO 'submitter';
GRANT SELECT ON bavarian_jokes.keyword TO 'submitter';
