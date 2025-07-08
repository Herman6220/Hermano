'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';

export default function CustomerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <div className="flex min-h-[36rem]">
      {!session || session.user.activeRole !== "CUSTOMER" ? (
        <>
          <div className='flex flex-col gap-2 items-center justify-center w-full min-h-[36rem]'>
            <p>Login as Customer to get your profile.</p>
            <Link
              href="/sign-in"
            >
              <Button className='bg-blue-500 hover:bg-blue-700'>Login</Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 py-5 border-r">
        <nav className="flex flex-col gap-4 w-full">
          <Link
            href="/profile/dashboard"
          >
            <button className={clsx(
              'flex text-left p-2 rounded-sm hover:bg-violet-300 w-full',
              pathname === '/profile/dashboard' && 'font-bold text-white bg-gradient-to-br from-blue-700 to-blue-400 shadow-md'
            )}>Overview</button>
          </Link>

          <Link
            href="/profile/orders"
          >
            <button className={clsx(
              'flex text-left p-2 rounded-sm hover:bg-violet-300 w-full',
              pathname === '/profile/orders' && 'font-bold text-white bg-gradient-to-br from-blue-700 to-blue-400 shadow-md'
            )}>Orders</button>
          </Link>

          <Link
            href="/profile/account"
          >
            <button className={clsx(
              'flex text-left p-2 rounded-sm hover:bg-violet-300 w-full',
              pathname === '/profile/account' && 'font-bold text-white bg-gradient-to-br from-blue-700 to-blue-400 shadow-md'
            )}>My Account</button>
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
        </>
      )}
    </div>
  );
}
