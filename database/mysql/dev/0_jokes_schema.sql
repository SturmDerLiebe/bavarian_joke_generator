CREATE DATABASE IF NOT EXISTS bavarian_jokes;

USE bavarian_jokes;

CREATE TABLE
IF NOT EXISTS user (
    id SERIAL,
    username VARCHAR(30) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (username)
);

CREATE TABLE
IF NOT EXISTS authenticator (
    id SERIAL,
    credentialid TEXT NOT NULL,
    credentialpublickey BLOB NOT NULL,
    counter BIGINT UNSIGNED NOT NULL,
    credentialdevicetype ENUM('singleDevice', 'multiDevice') NOT NULL,
    credentialbackedup BOOL NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    transports
    SET(
        'ble',
        'cable',
        'hybrid',
        'internal',
        'nfc',
        'smart-card',
        'usb'
    ) DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user (
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
    FOREIGN KEY (submitted_by) REFERENCES user (
        id
    ) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE
IF NOT EXISTS keyword (
    id SERIAL,
    title VARCHAR(30) NOT NULL, 
    times_searched BIGINT UNSIGNED DEFAULT 
    PRIMARY KEY (id),
    UNIQUE (title)
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

