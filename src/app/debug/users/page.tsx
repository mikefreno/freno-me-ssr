import { env } from "@/env.mjs";
import UserDefaultImage from "@/icons/UserDefaultImage";
import { User } from "@/types/model-types";
import Image from "next/image";

export default async function UsersDebugPage() {
  const resJSON = await fetch(
    `${env.NEXT_PUBLIC_DOMAIN}/api/user-data/get-all-users`,
    { method: "GET", cache: "no-store" }
  );
  const resData = await resJSON.json();
  const userData = resData.users as User[];
  return (
    <>
      <div className="pt-24 mx-12">
        <div className="grid grid-cols-5">
          <div>id</div>
          <div>Email</div>
          <div>image</div>
          <div>registered at</div>
          <div>provider</div>
        </div>
        <hr />
        <hr />
        {userData.map((user) => (
          <>
            <div key={user.id} className="grid grid-cols-5">
              <div className="max-w-[75%]">{user.id}</div>
              <div>{user.email}</div>
              {user.image ? (
                <Image
                  src={user.image}
                  height={40}
                  width={40}
                  alt={"user-image"}
                />
              ) : (
                <UserDefaultImage strokeWidth={1} height={40} width={40} />
              )}
              <div>{user.registered_at ? user.registered_at : "hihi"}</div>
              <div>{user.provider}</div>
            </div>
            <hr />
          </>
        ))}
      </div>
    </>
  );
}
