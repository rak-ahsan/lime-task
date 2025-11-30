'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      richColors
      position="top-right"
      toastOptions={{
        // Default style for toasts
        unstyled: false,
        classNames: {
          toast: 'flex items-center gap-2 rounded-md p-3 text-sm font-medium',
          success: 'bg-green-500 text-white',
          error: 'bg-red-500 text-white',
          warning: 'bg-yellow-500 text-black',
          info: 'bg-blue-500 text-white',
        },
      }}
    />
  );
}
