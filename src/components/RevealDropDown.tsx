import { ReactNode, useState } from "react";

export default function RevealDropDown({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [isRevealed, setIsRevealed] = useState(false);

  const toggleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  return (
    <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Button Header */}
      <div
        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 cursor-pointer"
        onClick={toggleReveal}
      >
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 dark:text-gray-300">
            {/* Life and lineage icon */}
          </span>
          <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center space-x-3">
          {/* Reveal Arrow */}
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${
              isRevealed ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Reveal Content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isRevealed ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 bg-white dark:bg-gray-900">{children}</div>
      </div>
    </div>
  );
}
