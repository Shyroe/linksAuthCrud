CREATE DATABASE favoritelinks;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL
)

CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  url VARCHAR(255) NOT NULL,
  description TEXT,
  user_id INT(11),
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  FOREIGN KEY(user_id) REFERENCES users(id)
);