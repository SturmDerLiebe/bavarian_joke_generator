-- READER:
CREATE USER IF NOT EXISTS reader IDENTIFIED BY 'readerPW';

GRANT
SELECT
ON bavarian_jokes.joke TO reader;

GRANT
SELECT
ON bavarian_jokes.jk_pair TO reader;

GRANT
SELECT
ON bavarian_jokes.keyword TO reader;

-- SUBMITTER:
CREATE USER IF NOT EXISTS submitter IDENTIFIED BY 'submitterPW';

GRANT INSERT ON bavarian_jokes.joke TO submitter;
GRANT INSERT ON bavarian_jokes.jk_pair TO submitter;
GRANT INSERT ON bavarian_jokes.keyword TO submitter;

-- LOGGED_IN_USER:
CREATE USER IF NOT EXISTS logged_in_user IDENTIFIED BY 'logged_in_userPW';

GRANT DELETE,
UPDATE (content, explanation) ON bavarian_jokes.joke TO logged_in_user;

