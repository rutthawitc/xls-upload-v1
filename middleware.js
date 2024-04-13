// middleware.js
import { NextResponse } from 'next/server';
import { allowedUsernames } from './utils/config';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const user = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  //console.log('user :', user);

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!allowedUsernames.includes(user.user.username)) {
    return NextResponse.redirect(new URL('/403', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/protected'],
};
