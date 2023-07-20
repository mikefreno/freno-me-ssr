"use client";
import Dropzone from "@/components/Dropzone";
import CheckCircle from "@/icons/CheckCircle";
import XCircle from "@/icons/XCircle";
import { API_RES_GetUserDataFromCookie } from "@/types/response-types";
import Cookies from "js-cookie";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { sendEmailVerification, setDisplayName, setEmail } from "./actions";
import LoadingSpinner from "@/components/LoadingSpinner";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = (await res.json()) as API_RES_GetUserDataFromCookie;

  return { data, status: res.status };
};

export default function Account() {
  const { data: data, error: reactionError } = useSWR(
    `/api/user-data/cookie/${Cookies.get("userIDToken")}`,
    fetcher
  );
  const [profileImage, setProfileImage] = useState<File | Blob>();
  const [profileImageHolder, setProfileImageHolder] = useState<
    string | ArrayBuffer | null
  >(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const displayNameRef = useRef<HTMLInputElement>(null);
  const [emailButtonLoading, setEmailButtonLoading] = useState<boolean>(false);
  const [displayNameButtonLoading, setDisplayNameButtonLoading] =
    useState<boolean>(false);
  const [userData, setUserData] = useState<API_RES_GetUserDataFromCookie>();

  useEffect(() => {
    setUserData(data?.data);
  }, [data]);

  const handleImageDrop = useCallback((acceptedFiles: Blob[]) => {
    acceptedFiles.forEach((file: Blob) => {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        const str = reader.result;
        setProfileImageHolder(str);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeImage = () => {
    setProfileImage(undefined);
    setProfileImageHolder(null);
  };

  const setEmailTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailRef.current) {
      setEmailButtonLoading(true);
      const res = await setEmail(emailRef.current?.value);

      setUserData(res);
      setEmailButtonLoading(false);
    }
  };

  const setDisplayNameTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (displayNameRef.current) {
      setDisplayNameButtonLoading(true);
      const res = await setDisplayName(displayNameRef.current?.value);

      setUserData(res);
      setDisplayNameButtonLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-36">
      <div className="pt-24">
        {!userData ? (
          <div className="mt[35vh] w-full flex justify-center align-middle">
            <LoadingSpinner height={64} width={64} />
          </div>
        ) : (
          <>
            <div className="flex flex-col py-8">
              <div className="pl-2">User Profile Image</div>
              <div className="flex">
                <Dropzone
                  onDrop={handleImageDrop}
                  acceptedFiles={"image/jpg, image/jpeg, image/png"}
                  fileHolder={profileImageHolder}
                  preSet={userData?.image ? userData.image : null}
                />
                <button
                  type="button"
                  className="rounded-full h-fit -ml-6 z-50"
                  onClick={removeImage}
                >
                  <XCircle
                    height={36}
                    width={36}
                    stroke={"black"}
                    strokeWidth={1}
                    fill={null}
                  />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2">
              {userData?.email ? (
                <div className="text-xl flex">
                  <div className="my-auto">
                    Current email: {userData.email}{" "}
                  </div>
                  {userData?.emailVerified ? (
                    <div className="my-auto pl-2 tooltip">
                      <CheckCircle
                        strokeWidth={1}
                        height={24}
                        width={24}
                        fillColor={"green"}
                        strokeColor={null}
                      />
                      <div className="tooltip-text">
                        <div className="px-1">Email Verified</div>
                      </div>
                    </div>
                  ) : (
                    <form
                      action={sendEmailVerification}
                      className="my-auto pl-2"
                    >
                      <button className="tooltip">
                        <XCircle
                          height={24}
                          width={24}
                          stroke={"black"}
                          strokeWidth={1}
                          fill={"#f87171"}
                        />
                        <div className="tooltip-text">
                          <div className="px-1">
                            Click to start email verification
                          </div>
                        </div>
                      </button>
                    </form>
                  )}
                </div>
              ) : null}
              <form onSubmit={setEmailTrigger} className="-mt-4 mx-auto">
                <div className="input-group mx-4">
                  <input
                    ref={emailRef}
                    type="text"
                    required
                    disabled={emailButtonLoading || !userData?.emailVerified}
                    name="title"
                    placeholder=" "
                    className="bg-transparent underlinedInput"
                  />
                  <span className="bar"></span>
                  <label className="underlinedInputLabel">Set New Email</label>
                </div>
                <div className="flex justify-end">
                  <button
                    type={"submit"}
                    disabled={emailButtonLoading || !userData?.emailVerified}
                    className={`${
                      emailButtonLoading || !userData?.emailVerified
                        ? "bg-zinc-400"
                        : "bg-blue-400 dark:bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-700 active:scale-90"
                    } flex justify-center rounded transition-all duration-300 ease-out mt-2 px-4 py-2 text-white`}
                  >
                    Submit
                  </button>
                </div>
              </form>

              {userData?.displayName ? (
                <div className="text-xl flex">
                  <div className="my-auto">
                    Current Display Name: {userData.displayName}{" "}
                  </div>
                </div>
              ) : null}
              <form
                onSubmit={(e) => setDisplayNameTrigger(e)}
                className="-mt-4 mx-auto"
              >
                <div className="input-group mx-4">
                  <input
                    ref={displayNameRef}
                    type="text"
                    required
                    disabled={displayNameButtonLoading}
                    name="title"
                    placeholder=" "
                    className="bg-transparent underlinedInput"
                  />
                  <span className="bar"></span>
                  <label className="underlinedInputLabel">
                    Set {userData?.displayName ? "New " : ""}Display Name
                  </label>
                </div>
                <div className="flex justify-end">
                  <button
                    type={"submit"}
                    disabled={displayNameButtonLoading}
                    className={`${
                      displayNameButtonLoading
                        ? "bg-zinc-400"
                        : "bg-blue-400 dark:bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-700 active:scale-90"
                    } flex justify-center rounded transition-all duration-300 ease-out mt-2 px-4 py-2 text-white`}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
