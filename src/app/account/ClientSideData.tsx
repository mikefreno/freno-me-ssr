"use client";
import Dropzone from "@/components/Dropzone";
import CheckCircle from "@/icons/CheckCircle";
import XCircle from "@/icons/XCircle";
import { useCallback, useRef, useState } from "react";
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
import Eye from "@/icons/Eye";
import EyeSlash from "@/icons/EyeSlash";

export default function ClientSideData(props: {
  userData: {
    id: string;
    email?: string;
    emailVerified: boolean;
    image?: string;
    displayName?: string;
    provider?: string;
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
    email?: string;
    emailVerified: boolean;
    image?: string;
    displayName?: string;
    provider?: string;
    hasPassword: boolean;
  }>(props.userData);

  const [showOldPasswordInput, setShowOldPasswordInput] =
    useState<boolean>(false);
  const [showPasswordInput, setShowPasswordInput] = useState<boolean>(false);
  const [showPasswordConfInput, setShowPasswordConfInput] =
    useState<boolean>(false);

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
        imageKey = (await AddImageToS3(
          profileImage,
          user.id,
          "user",
        )) as string;
      } catch (e) {
        console.log("ERROR: " + e);
        alert("error submitting image! Check Logs!");
      }
      const res = await fetch(
        `${env.NEXT_PUBLIC_DOMAIN}/api/database/user/image/${user.id}`,
        { method: "POST", body: JSON.stringify({ imageURL: imageKey }) },
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
        `${env.NEXT_PUBLIC_DOMAIN}/api/database/user/image/${user.id}`,
        { method: "POST", body: JSON.stringify({ imageURL: null }) },
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
        oldPasswordRef.current.value,
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
        newPasswordConfRef.current.value,
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
    <div className="mx-8 min-h-screen md:mx-24 lg:mx-36">
      <div className="pt-24">
        {!user ? (
          <div className="w-100% mt-[35vh] flex justify-center align-middle">
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
                    className="z-20 -ml-6 h-fit rounded-full"
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
                        : "bg-blue-400 hover:bg-blue-500 active:scale-90 dark:bg-blue-600 dark:hover:bg-blue-700"
                    } -ml-[6px] mt-2 flex w-full justify-center rounded px-4 py-2 text-white transition-all duration-300 ease-out`}
                  >
                    Set
                  </button>
                </form>
                <div
                  className={`${
                    showImageSuccess ? "" : "select-none opacity-0"
                  } text-center text-green-500 transition-opacity duration-200 ease-in-out`}
                >
                  Image Set Success!
                </div>
              </div>
            </div>
            <div className="mx-auto flex flex-col md:grid md:grid-cols-2">
              <div className="flex justify-center text-xl md:justify-normal">
                <div className="my-auto flex flex-col justify-start lg:flex-row">
                  <div className="whitespace-nowrap pr-1">Current email: </div>
                  {user?.email ? (
                    user.email
                  ) : (
                    <span className="font-light italic underline underline-offset-4">
                      None Set
                    </span>
                  )}
                </div>
                {user?.emailVerified || !user?.email ? (
                  <div className="tooltip z-10 my-auto ml-2">
                    <CheckCircle
                      strokeWidth={1}
                      height={24}
                      width={24}
                      fillColor={"#22c55e"}
                      strokeColor={null}
                    />
                    <div className="-mt-5 ml-1 h-4 w-4 rounded-full bg-green-500" />
                    <div className="tooltip-text -ml-12 mt-1 w-10">
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
                      <div className="tooltip-text -ml-6 w-12">
                        <div className="px-1">
                          Click to start email verification
                        </div>
                      </div>
                    </button>
                  </form>
                )}
              </div>
              <form onSubmit={setEmailTrigger} className="mx-auto -mt-4">
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
                    className="underlinedInput bg-transparent"
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
                        : "bg-blue-400 hover:bg-blue-500 active:scale-90 dark:bg-blue-600 dark:hover:bg-blue-700"
                    } mt-2 flex justify-center rounded px-4 py-2 text-white transition-all duration-300 ease-out`}
                  >
                    Submit
                  </button>
                </div>
              </form>

              <div className="flex justify-center text-xl md:justify-normal">
                <div className="my-auto flex flex-col justify-start lg:flex-row">
                  <div className="whitespace-nowrap pr-1">
                    Current Display Name:
                  </div>
                  {user?.displayName ? (
                    user.displayName
                  ) : (
                    <div className="flex">
                      <div className="tooltip">
                        <InfoIcon height={24} width={24} strokeWidth={1} />
                        <div className="tooltip-text -ml-20 w-40">
                          <div className="px-1">
                            This will show instead of your email in comments
                          </div>
                        </div>
                      </div>
                      <span className="font-light italic underline underline-offset-4">
                        None Set
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <form
                onSubmit={(e) => setDisplayNameTrigger(e)}
                className="mx-auto -mt-4"
              >
                <div className="input-group mx-4">
                  <input
                    ref={displayNameRef}
                    type="text"
                    required
                    disabled={displayNameButtonLoading}
                    name="title"
                    placeholder=" "
                    className="underlinedInput bg-transparent"
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
                        : "bg-blue-400 hover:bg-blue-500 active:scale-90 dark:bg-blue-600 dark:hover:bg-blue-700"
                    } mt-2 flex justify-center rounded px-4 py-2 text-white transition-all duration-300 ease-out`}
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
              className="mt-4 flex w-full justify-center"
            >
              <div className="flex flex-col justify-center">
                {user?.hasPassword ? (
                  <div className="input-group mx-4">
                    <input
                      ref={oldPasswordRef}
                      name="oldPassword"
                      type={showOldPasswordInput ? "text" : "password"}
                      required
                      disabled={passwordChangeLoading}
                      placeholder=" "
                      className="underlinedInput w-full bg-transparent"
                    />
                    <span className="bar"></span>
                    <label className="underlinedInputLabel">Old Password</label>
                    <button
                      onClick={() => {
                        setShowOldPasswordInput(!showOldPasswordInput);
                        oldPasswordRef.current?.focus();
                      }}
                      className="absolute -mt-8 ml-[17.5rem]"
                      type="button"
                    >
                      {showOldPasswordInput ? (
                        <Eye
                          height={24}
                          width={24}
                          strokeWidth={1}
                          className="stroke-zinc-900 dark:stroke-white"
                        />
                      ) : (
                        <EyeSlash
                          height={24}
                          width={24}
                          strokeWidth={1}
                          className="stroke-zinc-900 dark:stroke-white"
                        />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="tooltip -mb-8">
                      <InfoIcon height={24} width={24} strokeWidth={1} />
                      <div className="tooltip-text -ml-[4.5rem] w-36">
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
                    type={showPasswordInput ? "text" : "password"}
                    required
                    onChange={handleNewPasswordChange}
                    onBlur={handlePasswordBlur}
                    disabled={passwordChangeLoading}
                    placeholder=" "
                    className="underlinedInput w-full bg-transparent"
                  />
                  <span className="bar"></span>
                  <label className="underlinedInputLabel">New Password</label>
                  <button
                    onClick={() => {
                      setShowPasswordInput(!showPasswordInput);
                      newPasswordRef.current?.focus();
                    }}
                    className="absolute -mt-9 ml-[17.5rem]"
                    type="button"
                  >
                    {showPasswordInput ? (
                      <Eye
                        height={24}
                        width={24}
                        strokeWidth={1}
                        className="stroke-zinc-900 dark:stroke-white"
                      />
                    ) : (
                      <EyeSlash
                        height={24}
                        width={24}
                        strokeWidth={1}
                        className="stroke-zinc-900 dark:stroke-white"
                      />
                    )}
                  </button>
                </div>
                <div
                  className={`${
                    showPasswordLengthWarning ? "" : "select-none opacity-0"
                  } text-center text-red-500 transition-opacity duration-200 ease-in-out`}
                >
                  Password too short! Min Length: 8
                </div>
                <div className="-mt-6">
                  <div className="input-group mx-4">
                    <input
                      ref={newPasswordConfRef}
                      name="newPasswordConf"
                      onChange={handlePasswordConfChange}
                      type={showPasswordConfInput ? "text" : "password"}
                      required
                      disabled={passwordChangeLoading}
                      placeholder=" "
                      className="underlinedInput w-full bg-transparent"
                    />
                    <span className="bar"></span>
                    <label className="underlinedInputLabel">
                      Password Confirmation
                    </label>
                    <button
                      onClick={() => {
                        setShowPasswordConfInput(!showPasswordConfInput);
                        newPasswordConfRef.current?.focus();
                      }}
                      className="absolute -mt-9 ml-[17.5rem]"
                      type="button"
                    >
                      {showPasswordConfInput ? (
                        <Eye
                          height={24}
                          width={24}
                          strokeWidth={1}
                          className="stroke-zinc-900 dark:stroke-white"
                        />
                      ) : (
                        <EyeSlash
                          height={24}
                          width={24}
                          strokeWidth={1}
                          className="stroke-zinc-900 dark:stroke-white"
                        />
                      )}
                    </button>
                  </div>
                </div>
                <div
                  className={`${
                    !passwordsMatch &&
                    passwordLengthSufficient &&
                    newPasswordConfRef.current!.value.length >= 6
                      ? ""
                      : "select-none opacity-0"
                  } text-center text-red-500 transition-opacity duration-200 ease-in-out`}
                >
                  Passwords do not match!
                </div>

                <button
                  type={"submit"}
                  disabled={passwordChangeLoading || !passwordsMatch}
                  className={`${
                    passwordChangeLoading || !passwordsMatch
                      ? "bg-zinc-400"
                      : "bg-blue-400 hover:bg-blue-500 active:scale-90 dark:bg-blue-600 dark:hover:bg-blue-700"
                  } my-6 flex justify-center rounded px-4 py-2 text-white transition-all duration-300 ease-out`}
                >
                  Set
                </button>
                <div
                  className={`${
                    passwordError ? "" : "select-none opacity-0"
                  } text-center text-red-500 transition-opacity duration-200 ease-in-out`}
                >
                  {user?.hasPassword
                    ? "Password did not match record"
                    : "Fatal error: Password already exists! Refresh page!"}
                </div>
              </div>
            </form>
            <hr className="mt-4" />
            <div className="py-14">
              <div className="mx-auto mt-4 w-full overflow-auto rounded-md bg-red-300 px-6 pb-4 pt-8 shadow-md dark:bg-red-950 md:w-3/4 md:py-8">
                <div className="pb-4 text-center text-xl">Delete Account</div>
                <div className="flex w-full justify-center">
                  <div className="tooltip">
                    <InfoIcon height={36} width={36} strokeWidth={1} />
                    <div className="tooltip-text -ml-20 w-40">
                      <div className="px-1">
                        Warning: This will delete all account information and is
                        irreversible
                      </div>
                    </div>
                  </div>
                </div>
                <form onSubmit={(e) => deleteAccountTrigger(e)}>
                  <div className="flex w-full justify-center">
                    <div className="input-group delete mx-4">
                      <input
                        ref={deleteAccountPasswordRef}
                        type="password"
                        required
                        disabled={deleteAccountButtonLoading}
                        name="title"
                        placeholder=" "
                        className="underlinedInput bg-transparent"
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
                        : "bg-red-500 hover:bg-red-600 active:scale-90 dark:bg-red-600 dark:hover:bg-red-700"
                    } mx-auto mt-2 flex justify-center rounded px-4 py-2 text-white transition-all duration-300 ease-out`}
                  >
                    Delete
                  </button>
                  <div
                    className={`${
                      passwordDeletionError ? "" : "select-none opacity-0"
                    } text-center text-red-500 transition-opacity duration-200 ease-in-out`}
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
