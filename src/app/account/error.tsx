"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { signOut } from "../globalActions";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="pt-36">
      <div className="text-xl">Something went wrong!</div>
      <form action={signOut}>
        <button
          className="bg-blue-400 dark:bg-blue-600 hover:bg-blue-500 dark:hover:bg-blue-700 active:scale-90 flex w-36 justify-center rounded transition-all duration-300 ease-out py-3 text-white shadow-lg shadow-blue-300 dark:shadow-blue-700"
          type="submit"
        >
          Try again
        </button>
      </form>
    </div>
  );
}
