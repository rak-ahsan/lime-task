import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">

      {/* Floating circles */}
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-900/30"></div>
      <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl dark:bg-purple-900/30"></div>

      <div className="z-20 text-center p-8 max-w-lg">
        <h1 className="text-7xl font-extrabold text-gray-800 mb-4 dark:text-white tracking-tight">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you are looking for doesn’t exist, was moved,
          or is temporarily unavailable.
        </p>

        <Link
          href="/"
          className="
            inline-block px-6 py-3 text-white font-medium rounded-lg
            bg-gradient-to-r from-blue-600 to-purple-600 
            hover:from-blue-700 hover:to-purple-700
            transition-all shadow-lg hover:shadow-xl
          "
        >
          ⟵ Back to Home
        </Link>
      </div>
    </div>
  );
}
