-- Households, set up with their goals on the owner's first sign-in, and the members they invite.

CREATE TABLE IF NOT EXISTS households (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  -- Budgets are whole baht. usage_years is the default lifetime used to work out an item's daily cost.
  annual_budget INT UNSIGNED NOT NULL,
  monthly_budget INT UNSIGNED NOT NULL,
  usage_years TINYINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS household_members (
  -- A user belongs to at most one household.
  user_id INT UNSIGNED NOT NULL PRIMARY KEY,
  household_id INT UNSIGNED NOT NULL,
  role ENUM('owner', 'editor', 'viewer') NOT NULL,
  joined_at DATETIME NOT NULL,
  KEY household_members_household_id (household_id),
  CONSTRAINT household_members_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT household_members_household_id FOREIGN KEY (household_id) REFERENCES households (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS household_invites (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  -- SHA-256 of the token in the invite link. Each link lets one person join and is deleted when used.
  token_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  household_id INT UNSIGNED NOT NULL,
  -- Who the link is for, e.g. "แม่", so the owner can tell pending links apart.
  name VARCHAR(50) NOT NULL DEFAULT '',
  role ENUM('editor', 'viewer') NOT NULL,
  created_by INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  UNIQUE KEY household_invites_token_hash (token_hash),
  KEY household_invites_household_id (household_id),
  CONSTRAINT household_invites_household_id FOREIGN KEY (household_id) REFERENCES households (id) ON DELETE CASCADE,
  CONSTRAINT household_invites_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
