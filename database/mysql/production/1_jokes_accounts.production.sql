-- READER:
CREATE USER IF NOT EXISTS reader IDENTIFIED BY 'amOcsWJcAmvIWn';

GRANT SELECT ON bavarian_jokes.joke TO reader;
GRANT SELECT ON bavarian_jokes.jk_pair TO reader;
GRANT SELECT ON bavarian_jokes.keyword TO reader;
GRANT SELECT ON bavarian_jokes.users TO reader;
GRANT UPDATE (times_searched) ON bavarian_jokes.keyword TO reader;

-- SUBMITTER:
CREATE USER IF NOT EXISTS submitter IDENTIFIED BY 'zvARGGsgnstrnNSOGLwmACI';

GRANT INSERT ON bavarian_jokes.joke TO submitter;
GRANT INSERT ON bavarian_jokes.jk_pair TO submitter;
GRANT SELECT, INSERT, UPDATE ON bavarian_jokes.keyword TO submitter;
GRANT SELECT ON bavarian_jokes.users TO submitter;

-- AUTHENTICATOR
CREATE USER IF NOT EXISTS authenticator IDENTIFIED BY 'KJHiuHJKbBHfuWXAChiw';

GRANT SELECT, INSERT, UPDATE (current_challange) ON bavarian_jokes.users TO authenticator;
GRANT SELECT, INSERT, UPDATE (counter) ON bavarian_jokes.authenticator TO authenticator;
