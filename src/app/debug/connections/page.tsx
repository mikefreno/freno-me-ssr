import { env } from "@/env.mjs";
import { Connection } from "@/types/model-types";

export default async function UsersDebugPage() {
  const resJSON = await fetch(
    `${env.NEXT_PUBLIC_DOMAIN}/api/database/connections/get-all`,
    { method: "GET", cache: "no-store" },
  );
  const connections = (await resJSON.json()).connections as Connection[];
  return (
    <>
      <div className="pt-24 mx-12">
        <div className="grid grid-cols-6">
          <div>id</div>
          <div>Connection_id</div>
          <div>Blog ID</div>
          <div>Project ID</div>
          <div>user ID</div>
        </div>
        <hr />
        <div className="grid grid-cols-5">
          {connections.map((connection) => (
            <>
              <div>{connection.id}</div>
              <div>{connection.connection_id}</div>
              <div>{connection.blog_id ? connection.blog_id : "null"}</div>
              <div>
                {connection.project_id ? connection.project_id : "null"}
              </div>
              <div>{connection.user_id}</div>
            </>
          ))}
        </div>
      </div>
    </>
  );
}
