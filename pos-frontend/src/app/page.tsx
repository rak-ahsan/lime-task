import { redirect } from 'next/navigation';

export default function HomePage() {
  // This is a placeholder. In a real app, you might fetch user data here
  // or show a dashboard. For now, we'll redirect to the POS page or Product List.
  // We will implement proper route protection later.
  redirect('/products');
}