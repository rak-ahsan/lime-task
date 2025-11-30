// components/PosClient.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Product, api } from '@/lib/api';
import { CartProvider } from '@/context/cart-context';
import PosShell from './PosShell'; // UI-only presentational shell (optional)
import PosBody from './PosBody';   // The heavy interactive piece (provided below)

interface Props {
  initialProducts: Product[];
}

/**
 * PosClient is only rendered on the client. It:
 *  - waits for hydration
 *  - then mounts CartProvider which uses localStorage
 *  - provides initialProducts snapshot to PosBody
 */
export default function PosClient({ initialProducts }: Props) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Mark client-mounted so server and client initial HTML won't mismatch
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Render a skeleton / minimal markup that matches server's output (server rendered PosClient won't be used)
    return (
      <div className="min-h-screen p-4">
        <div className="text-center text-sm text-gray-500">Loading POS…</div>
      </div>
    );
  }

  return (
    <CartProvider>
      {/* You can wrap with a shell for layout */}
      <PosBody initialProducts={initialProducts} />
    </CartProvider>
  );
}
