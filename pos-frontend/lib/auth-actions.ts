'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  try {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
  } catch (e) {
    console.error('logout failed:', e);
  }

  cookieStore.getAll().forEach((c) => {
    cookieStore.delete(c.name);
  });

  redirect('/login');
}
