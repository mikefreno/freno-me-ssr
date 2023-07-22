import { ConnectionFactory } from "@/app/api/database/ConnectionFactory";
import { env } from "@/env.mjs";
import { model } from "@/types/modelKV";

export default function DatabasePage() {
  async function ProjInit(input: FormData) {
    "use server";

    const password = input.get("password")?.toString();
    if (password == env.DANGEROUS_DBCOMMAND_PASSWORD) {
      const conn = ConnectionFactory();

      const tables = model;
      for (const tableName in tables) {
        const sqlStatement = tables[tableName];
        const result = await conn.execute(sqlStatement);
        console.log(result);
      }
    }
  }

  async function DropTable(input: FormData) {
    "use server";

    const password = input.get("password")?.toString();
    if (password == env.DANGEROUS_DBCOMMAND_PASSWORD) {
      const table = input.get("table")?.toString();

      const tables = table?.split(", ");

      if (table && tables && tables.length <= 1) {
        const conn = ConnectionFactory();
        const query = `DROP TABLE ${table}`;
        const results = await conn.execute(query);
        console.log(results);
      } else if (tables && tables.length > 1) {
        const conn = ConnectionFactory();
        for (const thisTable of tables) {
          const query = `DROP TABLE ${thisTable}`;
          const result = await conn.execute(query);
          console.log(result);
        }
      }
    }
  }
  async function AddTable(input: FormData) {
    "use server";

    const password = input.get("password")?.toString();
    if (password == env.DANGEROUS_DBCOMMAND_PASSWORD) {
      const inputTable = input.get("table")?.toString();
      const inputTables = inputTable?.split(", ");

      const tables = model;
      const conn = ConnectionFactory();
      if (inputTable && inputTables && inputTables.length <= 1) {
        const sqlStatement = tables[inputTable];
        const result = await conn.execute(sqlStatement);
        console.log(result);
      } else if (inputTables && inputTables.length > 1) {
        for (const table in tables) {
          if (inputTables.includes(table)) {
            const sqlStatement = tables[table];
            const results = await conn.execute(sqlStatement);
            console.log(results);
          }
        }
      }
    }
  }

  async function ProjReset(input: FormData) {
    "use server";

    const password = input.get("password")?.toString();
    if (password == env.DANGEROUS_DBCOMMAND_PASSWORD) {
      const conn = ConnectionFactory();
      const tables = [
        "Blog",
        "BlogLike",
        "Comment",
        "CommentReaction",
        "Project",
        "ProjectLike",
        "User",
      ];
      for (const table of tables) {
        const dropTableQuery = `DROP TABLE ${table}`;
        const result = await conn.execute(dropTableQuery);
      }
    }
  }

  async function AddToTable(input: FormData) {
    "use server";

    const password = input.get("password")?.toString();

    if (password == env.DANGEROUS_DBCOMMAND_PASSWORD) {
      const tables = [
        "Blog",
        "BlogLike",
        "Comment",
        "CommentReaction",
        "Project",
        "ProjectLike",
        "User",
      ];
      const updateTarget = input.get("table")?.toString();
      if (updateTarget && tables.includes(updateTarget)) {
        const conn = ConnectionFactory();
        const column = input.get("columnName")?.toString();
        const type = input.get("dataType")?.toString();
        const query = `ALTER TABLE ${updateTarget} ADD ${column} ${type}`;
        const res = await conn.execute(query);
        console.log(res);
      }
    }
  }
  async function RemoveFromTable(input: FormData) {
    "use server";

    const password = input.get("password")?.toString();

    if (password == env.DANGEROUS_DBCOMMAND_PASSWORD) {
      const tables = [
        "Blog",
        "BlogLike",
        "Comment",
        "CommentReaction",
        "Project",
        "ProjectLike",
        "User",
      ];
      const updateTarget = input.get("table")?.toString();
      if (updateTarget && tables.includes(updateTarget)) {
        const conn = ConnectionFactory();
        const column = input.get("columnName")?.toString();
        const query = `ALTER TABLE ${updateTarget} DROP COLUMN ${column}`;
        const res = await conn.execute(query);
        console.log(res);
      }
    }
  }

  return (
    <div className="mx-auto w-1/4">
      <div className="text-2xl text-center pt-24 pb-8">Database Control</div>
      <div className="text-xl text-center py-4">Project Init</div>
      <form action={ProjInit}>
        <div className="input-group w-96">
          <input
            type="password"
            required
            className="bg-transparent underlinedInput w-full"
            name="password"
            placeholder=" "
          />
          <span className="bar"></span>
          <label className="underlinedInputLabel">DB Command Password</label>
        </div>
        <div className="flex justify-end py-4">
          <button className="rounded border border-black hover:text-white dark:text-white shadow-md dark:border-white bg-transparent hover:border-blue-400 hover:bg-blue-400 active:scale-90 transition-all duration-300 ease-in-out px-4 py-2">
            Init Project
          </button>
        </div>
      </form>
      <div className="text-xl text-center pt-8 pb-4">Table Addition</div>
      <form action={AddTable}>
        <div className="textarea-group">
          <textarea
            required
            name="table"
            placeholder=" "
            className="bg-transparent underlinedInput w-full"
            rows={4}
          />
          <span className="bar" />
          <label className="underlinedInputLabel">
            Separate table names with (&quot;, &quot;)
          </label>
        </div>
        <div className="input-group">
          <input
            type="password"
            required
            className="bg-transparent underlinedInput w-full"
            name="password"
            placeholder=" "
          />
          <span className="bar"></span>
          <label className="underlinedInputLabel">DB Command Password</label>
        </div>
        <div className="flex justify-end py-4">
          <button className="rounded border border-black hover:text-white dark:text-white shadow-md dark:border-white bg-transparent hover:border-blue-400 hover:bg-blue-400 active:scale-90 transition-all duration-300 ease-in-out px-4 py-2">
            Add Table(s)
          </button>
        </div>
      </form>
      <div className="text-xl text-center pt-8 pb-4">Column Addition</div>
      <form action={AddToTable}>
        <div className="input-group">
          <input
            type="text"
            required
            className="bg-transparent underlinedInput w-full"
            name="table"
            placeholder=" "
          />
          <span className="bar"></span>
          <label className="underlinedInputLabel">Table Name</label>
        </div>
        <div className="input-group">
          <input
            type="text"
            required
            className="bg-transparent underlinedInput w-full"
            name="columnName"
            placeholder=" "
          />
          <span className="bar"></span>
          <label className="underlinedInputLabel">Column Name</label>
        </div>
        <div className="input-group">
          <input
            type="text"
            required
            className="bg-transparent underlinedInput w-full"
            name="dataType"
            placeholder=" "
          />
          <span className="bar"></span>
          <label className="underlinedInputLabel">Column Type</label>
        </div>
        <div className="input-group">
          <input
            type="password"
            required
            className="bg-transparent underlinedInput w-full"
            name="password"
            placeholder=" "
          />
          <span className="bar"></span>
          <label className="underlinedInputLabel">DB Command Password</label>
        </div>
        <div className="flex justify-end py-4">
          <button className="rounded border border-black hover:text-white dark:text-white shadow-md dark:border-white bg-transparent hover:border-blue-400 hover:bg-blue-400 active:scale-90 transition-all duration-300 ease-in-out px-4 py-2">
            Add Column
          </button>
        </div>
      </form>
      <div className="text-xl text-center pt-8 pb-4">Column Deletion</div>
      <form action={RemoveFromTable}>
        <div className="input-group">
          <input
            type="text"
            required
            className="bg-transparent underlinedInput w-full"
            name="table"
            placeholder=" "
          />
          <span className="bar"></span>
          <label className="underlinedInputLabel">Table Name</label>
        </div>
        <div className="input-group">
          <input
            type="text"
            required
            className="bg-transparent underlinedInput w-full"
            name="columnName"
            placeholder=" "
          />
          <span className="bar"></span>
          <label className="underlinedInputLabel">Column Name</label>
        </div>
        <div className="input-group">
          <input
            type="password"
            required
            className="bg-transparent underlinedInput w-full"
            name="password"
            placeholder=" "
          />
          <span className="bar"></span>
          <label className="underlinedInputLabel">DB Command Password</label>
        </div>
        <div className="flex justify-end py-4">
          <button className="rounded border border-black hover:text-white dark:text-white shadow-md dark:border-white bg-transparent hover:border-blue-400 hover:bg-blue-400 active:scale-90 transition-all duration-300 ease-in-out px-4 py-2">
            Drop Column
          </button>
        </div>
      </form>
      <div className="text-xl text-center pt-8 pb-4">Table Deletion</div>
      <form action={DropTable}>
        <div className="textarea-group">
          <textarea
            required
            name="table"
            placeholder=" "
            className="bg-transparent underlinedInput w-full"
            rows={4}
          />
          <span className="bar" />
          <label className="underlinedInputLabel">
            Separate table names with (&quot;, &quot;)
          </label>
        </div>
        <div className="input-group">
          <input
            type="password"
            required
            className="bg-transparent underlinedInput w-full"
            name="password"
            placeholder=" "
          />
          <span className="bar"></span>
          <label className="underlinedInputLabel">DB Command Password</label>
        </div>
        <div className="flex justify-end py-4">
          <button className="rounded border border-black hover:text-white dark:text-white shadow-md dark:border-white bg-transparent hover:border-blue-400 hover:bg-blue-400 active:scale-90 transition-all duration-300 ease-in-out px-4 py-2">
            Drop Table(s)
          </button>
        </div>
      </form>
      <div className="text-xl text-center pt-8 pb-4">Project Reset</div>
      <form action={ProjReset}>
        <div className="input-group">
          <input
            type="password"
            required
            className="bg-transparent underlinedInput w-full"
            name="password"
            placeholder=" "
          />
          <span className="bar"></span>
          <label className="underlinedInputLabel">DB Command Password</label>
        </div>
        <div className="flex justify-end py-4">
          <button className="rounded border border-black hover:text-white dark:text-white shadow-md dark:border-white bg-transparent hover:border-blue-400 hover:bg-blue-400 active:scale-90 transition-all duration-300 ease-in-out px-4 py-2">
            Drop Table(s)
          </button>
        </div>
      </form>
    </div>
  );
}
