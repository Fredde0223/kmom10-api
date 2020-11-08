CREATE TABLE IF NOT EXISTS accounts (
    email VARCHAR(255) NOT NULL,
    balance INT DEFAULT 0,
    gold INT DEFAULT 0,
    silver INT DEFAULT 0,
    copper INT DEFAULT 0,
    iron INT DEFAULT 0,
    aluminium INT DEFAULT 0,
    UNIQUE(email)
);
