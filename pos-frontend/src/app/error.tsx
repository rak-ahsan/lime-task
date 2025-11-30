"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("App Error Boundary:", error);
  }, [error]);

  return (
    <html>
      <body className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-semibold text-red-600">Something went wrong</h2>
        <p className="text-gray-500 mt-2">{error.message}</p>

        <button
          onClick={() => reset()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
