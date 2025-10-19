export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/admin/((?!login).*)', // Protect /admin/* except /admin/login
    '/api/stories/:path*',
    '/api/upload/:path*'
  ],
};
