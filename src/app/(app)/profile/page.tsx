import { redirect } from 'next/navigation';

export default function CustomerHome() {
  redirect('/profile/dashboard');
}
