DROP TABLE IF EXISTS users;

CREATE TYPE userrole AS ENUM ('admin', 'user');

CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_time = current_timestamp;
    NEW.create_time = OLD.create_time;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    create_time TIMESTAMPTZ DEFAULT current_timestamp,
    update_time TIMESTAMPTZ DEFAULT current_timestamp,
    first_name VARCHAR(256) NOT NULL,
    last_name VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL,
    hashed_password VARCHAR(256) NOT NULL,
    role userrole,
    flag VARCHAR(256)
);

CREATE TRIGGER update_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();
