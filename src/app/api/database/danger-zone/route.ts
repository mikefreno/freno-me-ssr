import { NextRequest, NextResponse } from "next/server";
import { ConnectionFactory } from "../ConnectionFactory";
import { env } from "@/env.mjs";

interface InputData {
  table: string | undefined;
  tables: string[] | undefined;
  password: string;
}

export async function POST(input: NextRequest) {
  const inputData = (await input.json()) as InputData;
  const { password } = inputData;

  async function initDB() {
    const conn = ConnectionFactory();

    const tables = [
      `CREATE TABLE User (
    id varchar(255) NOT NULL,
    name varchar(255),
    email varchar(255) UNIQUE,
    emailVerified datetime,
    image varchar(255),
    registered_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
    )`,
      `CREATE TABLE Blog (
    id INT AUTO_INCREMENT NOT NULL,
    title varchar(255) NOT NULL,
    subtitle varchar(255),
    body TEXT NOT NULL,
    banner_photo varchar(255),
    date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published BOOLEAN NOT NULL,
    author_id varchar(255) NOT NULL,
    reads INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY (author_id) REFERENCES User(id),
    INDEX (author_id)
  )`,
      `CREATE TABLE Project (
    id INT AUTO_INCREMENT NOT NULL,
    title varchar(255) NOT NULL,
    subtitle varchar(255),
    body TEXT NOT NULL,
    banner_photo varchar(255),
    date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published BOOLEAN NOT NULL,
    author_id varchar(255) NOT NULL,
    reads INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY (author_id) REFERENCES User(id),
    INDEX (author_id)
  )`,
      `CREATE TABLE Comment (
    id INT AUTO_INCREMENT NOT NULL,
    body varchar(255) NOT NULL,
    blog_id INT,
    project_id INT,
    parent_comment_id INT,
    commenter_id varchar(255) NOT NULL,
    points INT NOT NULL DEFAULT 0,
    upVotingUserIDs varchar(255) NOT NULL DEFAULT '',
    downVotingUserIDs varchar(255) NOT NULL DEFAULT '',
    PRIMARY KEY (id),
    FOREIGN KEY (commenter_id) REFERENCES User(id),
    FOREIGN KEY (blog_id) REFERENCES Blog(id),
    FOREIGN KEY (project_id) REFERENCES Project(id),
    FOREIGN KEY (parent_comment_id) REFERENCES Comment(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    INDEX (commenter_id),
    INDEX (blog_id),
    INDEX (project_id),
    INDEX (parent_comment_id)
  )`,
      `CREATE TABLE ProjectLike (
    id INT AUTO_INCREMENT NOT NULL,
    user_id varchar(255) NOT NULL,
    project_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (project_id) REFERENCES Project(id),
    INDEX (user_id),
    INDEX (project_id)
  )`,
      `CREATE TABLE BlogLike (
    id INT AUTO_INCREMENT NOT NULL,
    user_id varchar(255) NOT NULL,
    blog_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (blog_id) REFERENCES Blog(id),
    INDEX (user_id),
    INDEX (blog_id)
  )`,
      `CREATE TABLE CommentReaction (
    id INT AUTO_INCREMENT NOT NULL,
    type varchar(255) NOT NULL,
    count INT NOT NULL,
    comment_id INT NOT NULL,
    reactingUsers varchar(255),
    PRIMARY KEY (id),
    FOREIGN KEY (comment_id) REFERENCES Comment(id),
    INDEX (comment_id)
  )`,
    ];

    for (const table of tables) {
      const result = await conn.execute(table);
      console.log(result);
    }
  }

  if (password == env.DANGEROUS_DBCOMMAND_PASSWORD) {
    initDB()
      .then(() => {
        return NextResponse.json(
          { message: "project initialized" },
          { status: 201 }
        );
      })
      .catch((e) => {
        return NextResponse.json({ err: e }, { status: 500 });
      });
  } else {
    return NextResponse.json({ message: "password err" }, { status: 401 });
  }
}

export async function DELETE(input: NextRequest) {
  const inputData = (await input.json()) as InputData;
  const { table, tables, password } = inputData;

  async function dropTable() {
    if (table && !tables) {
      const conn = ConnectionFactory();
      const query = `DROP TABLE ${table}`;
      const results = await conn.execute(query);
      console.log(results);
    } else if (!table && tables) {
      const conn = ConnectionFactory();
      for (const thisTable of tables) {
        const query = `DROP TABLE ${thisTable}`;
        const result = await conn.execute(query);
        console.log(result);
      }
    }
  }

  if (password == env.DANGEROUS_DBCOMMAND_PASSWORD) {
    dropTable()
      .then(() => {
        return NextResponse.json(
          { message: tables ? "tables dropped" : "table dropped" },
          { status: 201 }
        );
      })
      .catch((e) => {
        return NextResponse.json({ err: e }, { status: 500 });
      });
  } else {
    return NextResponse.json({ message: "password err" }, { status: 401 });
  }
}
