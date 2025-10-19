'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | undefined;
}

export default function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/stories', label: 'Stories' },
    { href: '/admin/stories/new', label: 'New Story' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-xl font-bold text-gray-900">
              Esolrine Admin
            </Link>
            <div className="hidden md:flex gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              View Site
            </Link>
            {user && (
              <div className="flex items-center gap-3">
                {user.image && (
                  <img
                    src={user.image}
                    alt={user.name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
