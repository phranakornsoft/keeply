-- Keeply schema for MariaDB 10.6+ or MySQL 8+. The server applies the files in this folder in name order on startup.
-- IF NOT EXISTS lets this first file run on databases that were created from it before migrations existed.

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  -- LINE user ID ("U" + 32 hex), compared case-sensitively.
  line_sub VARCHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  line_name VARCHAR(100) NOT NULL,
  line_picture VARCHAR(1024) NULL,
  line_email VARCHAR(255) NULL,
  -- The Keeply profile. It starts from the LINE name and email and is then edited by the user.
  name VARCHAR(50) NOT NULL DEFAULT '',
  email VARCHAR(100) NOT NULL DEFAULT '',
  phone VARCHAR(20) NOT NULL DEFAULT '',
  birthday DATE NULL,
  bio VARCHAR(80) NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL,
  last_sign_in_at DATETIME NOT NULL,
  UNIQUE KEY users_line_sub (line_sub)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
  -- SHA-256 of the cookie token; the token itself is never stored.
  token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  KEY sessions_expires_at (expires_at),
  CONSTRAINT sessions_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
