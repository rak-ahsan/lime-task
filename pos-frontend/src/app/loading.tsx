export default function LoadingProducts() {
  return (
    <div className="h-[100vh] flex flex-col items-center justify-center relative overflow-hidden">

      <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl animate-pulse dark:bg-blue-900/30"></div>
      <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl animate-pulse dark:bg-purple-900/30"></div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        <p className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300 animate-pulse">
          Loading 
        </p>

        <div className="flex gap-1 mt-4">
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.1s]"></div>
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
