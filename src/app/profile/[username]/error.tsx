"use client"; // Error components must be Client Components

import { useEffect } from "react";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F9F9] text-[#1D5C4A] px-4">
      <h2 className="text-2xl font-semibold mb-4">Algo deu errado!</h2>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-[#C4E3DC] hover:bg-[#9BC6BA] text-[#1D5C4A] rounded-lg shadow-md transition duration-300"
      >
        Tente Novamente
      </button>
    </div>
  );
}
