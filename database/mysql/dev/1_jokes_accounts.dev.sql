-- READER:
CREATE USER IF NOT EXISTS reader IDENTIFIED BY 'readerPW';

GRANT SELECT ON bavarian_jokes.joke TO reader;
GRANT SELECT ON bavarian_jokes.jk_pair TO reader;
GRANT SELECT ON bavarian_jokes.keyword TO reader;
GRANT SELECT ON bavarian_jokes.users TO reader;
GRANT UPDATE (times_searched) ON bavarian_jokes.keyword TO reader;

-- SUBMITTER:
CREATE USER IF NOT EXISTS submitter IDENTIFIED BY 'submitterPW';

GRANT INSERT ON bavarian_jokes.joke TO submitter;
GRANT INSERT ON bavarian_jokes.jk_pair TO submitter;
GRANT SELECT, INSERT, UPDATE ON bavarian_jokes.keyword TO submitter;
GRANT SELECT ON bavarian_jokes.users TO submitter;

-- AUTHENTICATOR
CREATE USER IF NOT EXISTS authenticator IDENTIFIED BY 'authenticatorPW';

GRANT SELECT, INSERT, UPDATE (current_challange) ON bavarian_jokes.users TO authenticator;
GRANT SELECT, INSERT ON bavarian_jokes.authenticator TO authenticator;

-- LOGGED_IN_USER:
CREATE USER IF NOT EXISTS logged_in_user IDENTIFIED BY 'logged_in_userPW';

GRANT DELETE,
UPDATE (content, explanation) ON bavarian_jokes.joke TO logged_in_user;

-- TESTER is not part of production:
CREATE USER IF NOT EXISTS tester IDENTIFIED BY 'testerPW';

GRANT ALL ON bavarian_jokes.* TO tester;
