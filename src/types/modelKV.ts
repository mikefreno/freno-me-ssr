export const model: { [key: string]: string } = {
  User: `
  CREATE TABLE User 
    (
      id varchar(255) NOT NULL,
      email varchar(255) UNIQUE,
      email_verified boolean NOT NULL DEFAULT FALSE,
      password_hash varchar(255),
      display_name varchar(255),
      provider varchar(255),
      image varchar(255),
      registered_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    );
  `,
  Post: `
  CREATE TABLE Post
    (
      id INT AUTO_INCREMENT NOT NULL,
      title varchar(255) NOT NULL UNIQUE,
      subtitle varchar(255),
      body TEXT NOT NULL,
      banner_photo varchar(255),
      date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
      published BOOLEAN NOT NULL,
      category varchar(255),
      author_id varchar(255) NOT NULL,
      reads INT NOT NULL DEFAULT 0,
      attachments TEXT,
      PRIMARY KEY (id),
      INDEX (category)
    );
  `,
  PostLike: `
  CREATE TABLE PostLike 
    (
      id INT AUTO_INCREMENT NOT NULL,
      user_id varchar(255) NOT NULL,
      post_id INT NOT NULL,
      PRIMARY KEY (id),
      INDEX (post_id),
      UNIQUE KEY user_type_unique (user_id, post_id)
    );
  `,
  Comment: `
  CREATE TABLE Comment 
    (
      id INT AUTO_INCREMENT NOT NULL,
      body varchar(255) NOT NULL,
      post_id INT,
      parent_comment_id INT,
      date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
      edited BOOLEAN NOT NULL DEFAULT FALSE,
      commenter_id varchar(255) NOT NULL,
      PRIMARY KEY (id),
      INDEX (commenter_id),
      INDEX (parent_comment_id),
      INDEX (post_id)
    );
  `,
  CommentReaction: `
  CREATE TABLE CommentReaction 
    (
      id INT AUTO_INCREMENT NOT NULL,
      type varchar(255) NOT NULL,
      comment_id INT NOT NULL,
      user_id varchar(255) NOT NULL,
      PRIMARY KEY (id),
      INDEX (comment_id),
      INDEX (user_id),
      UNIQUE KEY user_type_unique (user_id, type, comment_id)
    );
  `,
  Connection: `
  CREATE TABLE Connection 
    (
      id INT AUTO_INCREMENT NOT NULL,
      user_id varchar(255) NOT NULL,
      connection_id varchar(255) NOT NULL,
      post_id INT,
      INDEX (post_id),
      PRIMARY KEY (id)
    );
  `,
  Tag: `
  CREATE TABLE Tag
    (
      id INT AUTO_INCREMENT NOT NULL,
      value varchar(255) NOT NULL,
      post_id INT NOT NULL,
      INDEX (post_id),
      PRIMARY KEY (id)
    );
  `,
};
