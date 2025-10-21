'use client';

import { usePathname } from 'next/navigation';
import LocaleSwitcher from './LocaleSwitcher';

export default function ConditionalLocaleSwitcher() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  // Don't show locale switcher in admin area
  if (isAdminRoute) {
    return null;
  }

  return <LocaleSwitcher />;
}
