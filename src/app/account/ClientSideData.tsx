"use client";
import Dropzone from "@/components/Dropzone";
import CheckCircle from "@/icons/CheckCircle";
import XCircle from "@/icons/XCircle";
import { API_RES_GetUserDataFromCookie } from "@/types/response-types";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  changePassword,
  deleteAccount,
  sendEmailVerification,
  setDisplayName,
  setEmail,
  setPassword,
} from "./actions";
import LoadingSpinner from "@/components/LoadingSpinner";
import InfoIcon from "@/icons/InfoIcon";
import { useRouter } from "next/navigation";
import AddImageToS3 from "../s3upload";
import { env } from "@/env.mjs";

export default function ClientSideData(props: {
  userData: {
    id: string;
    email: string | undefined;
    emailVerified: boolean;
    image: string | null;
    displayName: string | undefined;
    provider: string | undefined;
    hasPassword: boolean;
  };
}) {
  const [profileImage, setProfileImage] = useState<File | Blob>();
  const [profileImageHolder, setProfileImageHolder] = useState<
    string | ArrayBuffer | null
  >(null);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);
  const [showPasswordLengthWarning, setShowPasswordLengthWarning] =
    useState<boolean>(false);
  const [passwordLengthSufficient, setPasswordLengthSufficient] =
    useState<boolean>(false);
  const [passwordBlurred, setPasswordBlurred] = useState(false);
  const [emailButtonLoading, setEmailButtonLoading] = useState<boolean>(false);
  const [displayNameButtonLoading, setDisplayNameButtonLoading] =
    useState<boolean>(false);
  const [deleteAccountButtonLoading, setDeleteAccountButtonLoading] =
    useState<boolean>(false);
  const [passwordChangeLoading, setPasswordChangeLoading] =
    useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordDeletionError, setPasswordDeletionError] =
    useState<boolean>(false);
  const [profileImageSetLoading, setProfileImageSetLoading] =
    useState<boolean>(false);

  const [profileImageStateChange, setProfileImageStateChange] =
    useState<boolean>(false);
  const [preSetHolder, setPresetHolder] = useState<string | null>(null);
  const [showImageSuccess, setShowImageSuccess] = useState<boolean>(false);

  const [user, setUser] = useState<{
    id: string;
    email: string | undefined;
    emailVerified: boolean;
    image: string | null;
    displayName: string | undefined;
    provider: string | undefined;
    hasPassword: boolean;
  }>(props.userData);

  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordConfRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const displayNameRef = useRef<HTMLInputElement>(null);
  const deleteAccountPasswordRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleImageDrop = useCallback((acceptedFiles: Blob[]) => {
    acceptedFiles.forEach((file: Blob) => {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        const str = reader.result;
        setProfileImageHolder(str);
        setProfileImageStateChange(true);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const removeImage = () => {
    setProfileImage(undefined);
    setProfileImageHolder(null);
    if (preSetHolder) {
      setProfileImageStateChange(true);
      setPresetHolder(null);
    } else {
      setProfileImageStateChange(false);
    }
  };

  const setUserImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileImageSetLoading(true);
    if (profileImage && user && user.id) {
      let imageKey: string = "";
      try {
        imageKey = await AddImageToS3(profileImage, user.id, "user");
      } catch (e) {
        console.log("ERROR: " + e);
        alert("error submitting image! Check Logs!");
      }
      const res = await fetch(
        `${env.NEXT_PUBLIC_DOMAIN}/api/database/user/user-image/${user.id}`,
        { method: "POST", body: JSON.stringify({ imageURL: imageKey }) }
      );

      const resData = await res.json();
      if (resData.status == 500) {
        console.log("ERROR: " + resData.res);
        alert("error submitting image! Check Logs!");
      } else {
        router.refresh();
        setShowImageSuccess(true);
      }
    } else if (user && user.id) {
      const res = await fetch(
        `${env.NEXT_PUBLIC_DOMAIN}/api/database/user/user-image/${user.id}`,
        { method: "POST", body: JSON.stringify({ imageURL: null }) }
      );
      const resData = await res.json();
      if (resData.status == 500) {
        console.log("ERROR: " + resData.res);
        alert("error submitting image! Check Logs!");
      } else {
        router.refresh();
        setShowImageSuccess(true);
      }
    }
    setProfileImageSetLoading(false);
  };

  const setEmailTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailRef.current) {
      setEmailButtonLoading(true);
      const res = await setEmail(emailRef.current?.value);

      setUser(res);
      setEmailButtonLoading(false);
    }
  };

  const setDisplayNameTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (displayNameRef.current) {
      setDisplayNameButtonLoading(true);
      const res = await setDisplayName(displayNameRef.current?.value);

      setUser(res);
      setDisplayNameButtonLoading(false);
    }
  };
  const deleteAccountTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteAccountPasswordRef.current) {
      setDeleteAccountButtonLoading(true);
      const res = await deleteAccount(deleteAccountPasswordRef.current?.value);
      if (res == "Password Did Not Match") {
        setPasswordDeletionError(true);
        setDeleteAccountButtonLoading(false);
      } else if (res == "deleted") {
        router.push("/login");
      }
    }
  };
  const setNewPasswordTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      oldPasswordRef.current &&
      newPasswordRef.current &&
      newPasswordConfRef.current
    ) {
      setPasswordChangeLoading(true);
      const res = await changePassword(
        newPasswordRef.current.value,
        newPasswordConfRef.current.value,
        oldPasswordRef.current.value
      );
      if (res != "success") {
        setPasswordError(true);
      }
      setPasswordChangeLoading(false);
    }
  };

  const setPasswordTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordRef.current && newPasswordConfRef.current) {
      setPasswordChangeLoading(true);
      const res = await setPassword(
        newPasswordRef.current.value,
        newPasswordConfRef.current.value
      );
      if (res != "success") {
        setPasswordError(true);
      }
      setPasswordChangeLoading(false);
    }
  };

  const checkForMatch = (newPassword: string, newPasswordConf: string) => {
    if (newPassword === newPasswordConf) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  };

  const checkPasswordLength = (password: string) => {
    if (password.length >= 8) {
      setPasswordLengthSufficient(true);
      setShowPasswordLengthWarning(false);
    } else {
      setPasswordLengthSufficient(false);
      if (passwordBlurred) {
        setShowPasswordLengthWarning(true);
      }
    }
  };

  const passwordLengthBlurCheck = () => {
    if (
      !passwordLengthSufficient &&
      newPasswordRef.current &&
      newPasswordRef.current.value !== ""
    ) {
      setShowPasswordLengthWarning(true);
    }
    setPasswordBlurred(true);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    checkPasswordLength(e.target.value);
  };

  const handlePasswordConfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (newPasswordRef.current) {
      checkForMatch(newPasswordRef.current.value, e.target.value);
    }
  };

  const handlePasswordBlur = () => {
    passwordLengthBlurCheck();
  };

  return (
    <div className="min-h-screen mx-8 md:mx-24 lg:mx-36">
      <div className="pt-24">
        {!user ? (
          <div className="mt-[35vh] w-100% flex justify-center align-middle">
            <LoadingSpinner height={64} width={64} />
          </div>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="flex flex-col py-8">
                <div className="pl-2">User Profile Image</div>
                <div className="flex">
                  <Dropzone
                    onDrop={handleImageDrop}
                    acceptedFiles={"image/jpg, image/jpeg, image/png"}
                    fileHolder={profileImageHolder}
                    preSet={preSetHolder || user?.image ? user?.image : null}
                  />
                  <button
                    type="button"
                    className="rounded-full h-fit -ml-6 z-20"
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
                <form onSubmit={setUserImage}>
                  <button
                    type={"submit"}
                    disabled={
                      profileImageSetLoading || !profileImageStateChange
                    }
                    className={`${
                      profileImageSetLoading || !profileImageStateChange
                        ? "bg-zinc-400"
                        : "bg-blue-400 dark:bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-700 active:scale-90"
                    } flex justify-center w-full rounded transition-all duration-300 -ml-[6px] ease-out mt-2 px-4 py-2 text-white`}
                  >
                    Set
                  </button>
                </form>
                <div
                  className={`${
                    showImageSuccess ? "" : "opacity-0 select-none"
                  } transition-opacity text-center text-green-500 duration-200 ease-in-out`}
                >
                  Image Set Success!
                </div>
              </div>
            </div>
            <div className="flex flex-col mx-auto md:grid md:grid-cols-2">
              <div className="text-xl flex justify-center md:justify-normal">
                <div className="my-auto flex lg:flex-row flex-col justify-start">
                  <div className="whitespace-nowrap pr-1">Current email: </div>
                  {user?.email ? (
                    user.email
                  ) : (
                    <span className="italic font-light underline underline-offset-4">
                      None Set
                    </span>
                  )}
                </div>
                {user?.emailVerified || !user?.email ? (
                  <div className="my-auto ml-2 tooltip z-10">
                    <CheckCircle
                      strokeWidth={1}
                      height={24}
                      width={24}
                      fillColor={"#22c55e"}
                      strokeColor={null}
                    />
                    <div className="bg-green-500 rounded-full w-4 -mt-5 ml-1 h-4" />
                    <div className="tooltip-text mt-1 w-10 -ml-12">
                      <div className="px-1">Email Verified</div>
                    </div>
                  </div>
                ) : (
                  <form action={sendEmailVerification} className="my-auto pl-2">
                    <button className="tooltip">
                      <XCircle
                        height={24}
                        width={24}
                        stroke={"black"}
                        strokeWidth={1}
                        fill={"#f87171"}
                      />
                      <div className="tooltip-text w-12 -ml-6">
                        <div className="px-1">
                          Click to start email verification
                        </div>
                      </div>
                    </button>
                  </form>
                )}
              </div>
              <form onSubmit={setEmailTrigger} className="-mt-4 mx-auto">
                <div className="input-group mx-4">
                  <input
                    ref={emailRef}
                    type="text"
                    required
                    disabled={
                      !user?.email
                        ? false
                        : emailButtonLoading || !user?.emailVerified
                    }
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
                    disabled={
                      !user?.email
                        ? false
                        : emailButtonLoading || !user?.emailVerified
                    }
                    className={`${
                      (
                        !user?.email
                          ? false
                          : emailButtonLoading || !user?.emailVerified
                      )
                        ? "bg-zinc-400"
                        : "bg-blue-400 dark:bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-700 active:scale-90"
                    } flex justify-center rounded transition-all duration-300 ease-out mt-2 px-4 py-2 text-white`}
                  >
                    Submit
                  </button>
                </div>
              </form>

              <div className="text-xl flex justify-center md:justify-normal">
                <div className="my-auto flex lg:flex-row flex-col justify-start">
                  <div className="whitespace-nowrap pr-1">
                    Current Display Name:
                  </div>
                  {user?.displayName ? (
                    user.displayName
                  ) : (
                    <div className="flex">
                      <div className="tooltip">
                        <InfoIcon height={24} width={24} strokeWidth={1} />
                        <div className="tooltip-text w-40 -ml-20">
                          <div className="px-1">
                            This will show instead of your email in comments
                          </div>
                        </div>
                      </div>
                      <span className="italic font-light underline underline-offset-4">
                        None Set
                      </span>
                    </div>
                  )}
                </div>
              </div>
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
                    Set {user?.displayName ? "New " : ""}Display Name
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
            <form
              onSubmit={(e) => {
                user?.hasPassword
                  ? setNewPasswordTrigger(e)
                  : setPasswordTrigger(e);
              }}
              className="mt-4 flex justify-center w-full"
            >
              <div className="flex flex-col justify-center">
                {user?.hasPassword ? (
                  <div className="input-group mx-4">
                    <input
                      ref={oldPasswordRef}
                      name="oldPassword"
                      type="password"
                      required
                      disabled={passwordChangeLoading}
                      placeholder=" "
                      className="bg-transparent underlinedInput w-full"
                    />
                    <span className="bar"></span>
                    <label className="underlinedInputLabel">Old Password</label>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="tooltip -mb-8">
                      <InfoIcon height={24} width={24} strokeWidth={1} />
                      <div className="tooltip-text w-36 -ml-[4.5rem]">
                        <div className="px-1">
                          This will allow you to sign in with a password
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="input-group mx-4">
                  <input
                    ref={newPasswordRef}
                    name="newPassword"
                    type="password"
                    required
                    onChange={handleNewPasswordChange}
                    onBlur={handlePasswordBlur}
                    disabled={passwordChangeLoading}
                    placeholder=" "
                    className="bg-transparent underlinedInput w-full"
                  />
                  <span className="bar"></span>
                  <label className="underlinedInputLabel">New Password</label>
                </div>
                <div
                  className={`${
                    showPasswordLengthWarning ? "" : "opacity-0 select-none"
                  } transition-opacity text-center text-red-500 duration-200 ease-in-out`}
                >
                  Password too short! Min Length: 8
                </div>
                <div className="-mt-6">
                  <div className="input-group mx-4">
                    <input
                      ref={newPasswordConfRef}
                      name="newPasswordConf"
                      onChange={handlePasswordConfChange}
                      type="password"
                      required
                      disabled={passwordChangeLoading}
                      placeholder=" "
                      className="bg-transparent underlinedInput w-full"
                    />
                    <span className="bar"></span>
                    <label className="underlinedInputLabel">
                      Password Confirmation
                    </label>
                  </div>
                </div>
                <div
                  className={`${
                    !passwordsMatch &&
                    passwordLengthSufficient &&
                    newPasswordConfRef.current!.value.length >= 6
                      ? ""
                      : "opacity-0 select-none"
                  } transition-opacity text-center text-red-500 duration-200 ease-in-out`}
                >
                  Passwords do not match!
                </div>

                <button
                  type={"submit"}
                  disabled={passwordChangeLoading || !passwordsMatch}
                  className={`${
                    passwordChangeLoading || !passwordsMatch
                      ? "bg-zinc-400"
                      : "bg-blue-400 dark:bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-700 active:scale-90"
                  } flex justify-center rounded transition-all duration-300 ease-out my-6 px-4 py-2 text-white`}
                >
                  Set
                </button>
                <div
                  className={`${
                    passwordError ? "" : "opacity-0 select-none"
                  } transition-opacity text-center text-red-500 duration-200 ease-in-out`}
                >
                  {user?.hasPassword
                    ? "Password did not match record"
                    : "Fatal error: Password already exists! Refresh page!"}
                </div>
              </div>
            </form>
            <hr className="mt-4" />
            <div className="py-14">
              <div className="w-full md:w-3/4 overflow-auto rounded-md mt-4 pt-8 pb-4 md:py-8 px-6 shadow-md bg-red-300 dark:bg-red-950 mx-auto">
                <div className="text-xl text-center pb-4">Delete Account</div>
                <div className="w-full flex justify-center">
                  <div className="tooltip">
                    <InfoIcon height={36} width={36} strokeWidth={1} />
                    <div className="tooltip-text w-40 -ml-20">
                      <div className="px-1">
                        Warning: This will delete all account information and is
                        irreversible
                      </div>
                    </div>
                  </div>
                </div>
                <form onSubmit={(e) => deleteAccountTrigger(e)}>
                  <div className="w-full flex justify-center">
                    <div className="input-group mx-4 delete">
                      <input
                        ref={deleteAccountPasswordRef}
                        type="password"
                        required
                        disabled={deleteAccountButtonLoading}
                        name="title"
                        placeholder=" "
                        className="bg-transparent underlinedInput"
                      />
                      <span className="bar"></span>
                      <label className="underlinedInputLabel">
                        Enter Password
                      </label>
                    </div>
                  </div>
                  <button
                    type={"submit"}
                    disabled={deleteAccountButtonLoading}
                    className={`${
                      deleteAccountButtonLoading
                        ? "bg-zinc-400"
                        : "bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 active:scale-90"
                    } flex justify-center mx-auto rounded transition-all duration-300 ease-out mt-2 px-4 py-2 text-white`}
                  >
                    Delete
                  </button>
                  <div
                    className={`${
                      passwordDeletionError ? "" : "opacity-0 select-none"
                    } transition-opacity text-center text-red-500 duration-200 ease-in-out`}
                  >
                    Password did not match record
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
