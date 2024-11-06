PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

CREATE TABLE Comment (
  id INTEGER PRIMARY KEY,
  body TEXT NOT NULL,
  post_id INTEGER,
  parent_comment_id INTEGER,
  date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  edited INTEGER NOT NULL DEFAULT 0,
  commenter_id TEXT NOT NULL
);

CREATE TABLE CommentReaction (
  id INTEGER PRIMARY KEY,
  type TEXT NOT NULL,
  comment_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  UNIQUE(user_id, type, comment_id)
);

CREATE TABLE Connection (
  id INTEGER PRIMARY KEY,
  user_id TEXT NOT NULL,
  connection_id TEXT NOT NULL,
  post_id INTEGER
);

CREATE TABLE Post (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL UNIQUE,
  subtitle TEXT,
  body TEXT NOT NULL,
  banner_photo TEXT,
  date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published INTEGER NOT NULL,
  category TEXT,
  author_id TEXT NOT NULL,
  reads INTEGER NOT NULL DEFAULT 0,
  attachments TEXT
);

CREATE TABLE PostLike (
  id INTEGER PRIMARY KEY,
  user_id TEXT NOT NULL,
  post_id INTEGER NOT NULL,
  UNIQUE(user_id, post_id)
);

CREATE TABLE Tag (
  id INTEGER PRIMARY KEY,
  value TEXT NOT NULL,
  post_id INTEGER NOT NULL
);

CREATE TABLE User (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  password_hash TEXT,
  image TEXT,
  registered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  display_name TEXT,
  provider TEXT,
  email_verified INTEGER
);

CREATE INDEX idx_comment_commenter ON Comment(commenter_id);
CREATE INDEX idx_comment_parent ON Comment(parent_comment_id);
CREATE INDEX idx_comment_post ON Comment(post_id);
CREATE INDEX idx_comment_reaction ON CommentReaction(comment_id);
CREATE INDEX idx_connection_post ON Connection(post_id);
CREATE INDEX idx_post_category ON Post(category);
CREATE INDEX idx_post_title_cat_pub ON Post(title, category, published);
CREATE INDEX idx_tag_post ON Tag(post_id);

COMMIT;

