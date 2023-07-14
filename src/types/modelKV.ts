export const model: { [key: string]: string } = {
  User: `
    CREATE TABLE User (
      id varchar(255) NOT NULL,
      email varchar(255) UNIQUE,
      email_verified datetime,
      password_hash varchar(255),
      image varchar(255),
      registered_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    )
  `,
  Blog: `
    CREATE TABLE Blog (
      id INT AUTO_INCREMENT NOT NULL,
      title varchar(255) NOT NULL UNIQUE,
      subtitle varchar(255),
      body TEXT NOT NULL,
      banner_photo varchar(255),
      date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
      published BOOLEAN NOT NULL,
      author_id varchar(255) NOT NULL,
      reads INT NOT NULL DEFAULT 0,
      PRIMARY KEY (id),
      INDEX (author_id)
    )
  `,
  BlogLike: `
    CREATE TABLE BlogLike (
      id INT AUTO_INCREMENT NOT NULL,
      user_id varchar(255) NOT NULL,
      blog_id INT NOT NULL,
      PRIMARY KEY (id),
      INDEX (user_id),
      INDEX (blog_id)
    )
  `,
  Project: `
    CREATE TABLE Project (
      id INT AUTO_INCREMENT NOT NULL,
      title varchar(255) NOT NULL UNIQUE,
      subtitle varchar(255),
      body TEXT NOT NULL,
      banner_photo varchar(255),
      date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
      published BOOLEAN NOT NULL,
      author_id varchar(255) NOT NULL,
      reads INT NOT NULL DEFAULT 0,
      PRIMARY KEY (id),
      INDEX (author_id)
    )
  `,
  ProjectLike: `
    CREATE TABLE ProjectLike (
      id INT AUTO_INCREMENT NOT NULL,
      user_id varchar(255) NOT NULL,
      project_id INT NOT NULL,
      PRIMARY KEY (id),
      INDEX (user_id),
      INDEX (project_id)
    )
  `,
  Comment: `
    CREATE TABLE Comment (
      id INT AUTO_INCREMENT NOT NULL,
      body varchar(255) NOT NULL,
      blog_id INT,
      project_id INT,
      parent_comment_id INT,
      commenter_id varchar(255) NOT NULL,
      PRIMARY KEY (id),
      INDEX (commenter_id),
      INDEX (blog_id),
      INDEX (project_id),
      INDEX (parent_comment_id)
    )
  `,
  CommentReaction: `
    CREATE TABLE CommentReaction (
      id INT AUTO_INCREMENT NOT NULL,
      type varchar(255) NOT NULL,
      comment_id INT NOT NULL,
      user_id varchar(255) NOT NULL,
      PRIMARY KEY (id),
      INDEX (comment_id)
    )
  `,
};
