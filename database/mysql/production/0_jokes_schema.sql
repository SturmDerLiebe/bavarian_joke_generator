CREATE DATABASE IF NOT EXISTS bavarian_jokes;

USE bavarian_jokes;

CREATE TABLE
IF NOT EXISTS users (
    id SERIAL,
    username VARCHAR(30) NOT NULL,
    current_challange TEXT DEFAULT NULL, 
    PRIMARY KEY (id),
    UNIQUE INDEX (username(30))
);

CREATE TABLE
IF NOT EXISTS authenticator (
    id SERIAL,
    credential_id TEXT NOT NULL,
    credential_public_key BLOB NOT NULL,
    counter BIGINT UNSIGNED NOT NULL,
    credential_device_type VARCHAR(32) NOT NULL,
    credential_backed_up BOOL NOT NULL,
    transports VARCHAR(255) DEFAULT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    INDEX (credential_id(50)), -- max lenght is currently 26
    FOREIGN KEY (user_id) REFERENCES users (
        id
    ) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE
IF NOT EXISTS joke (
    id SERIAL,
    content TEXT NOT NULL,
    -- content_hash,
    explanation TEXT NOT NULL,
    submitted_by BIGINT UNSIGNED DEFAULT NULL,
    PRIMARY KEY (id),
    -- UNIQUE (content_hash),
    FOREIGN KEY (submitted_by) REFERENCES users (
        id
    ) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE
IF NOT EXISTS keyword (
    id SERIAL,
    title VARCHAR(30) NOT NULL,
    times_searched BIGINT UNSIGNED DEFAULT 0,
    PRIMARY KEY (id),
    UNIQUE INDEX (title(30))
);

-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

CREATE TABLE
IF NOT EXISTS jk_pair (
    joke_id BIGINT UNSIGNED NOT NULL,
    keyword_id BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (joke_id, keyword_id),
    FOREIGN KEY (joke_id) REFERENCES joke (
        id
    ) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (keyword_id) REFERENCES keyword (
        id
    ) ON DELETE CASCADE ON UPDATE CASCADE
);
