import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role;
    const urlPath = req.nextUrl.pathname;

    // Verificar acceso para administradores
    if (urlPath.startsWith('/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Verificar acceso para periodistas
    if (urlPath.startsWith('/periodista') && userRole !== 'journalist') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Verificar si el periodista intenta acceder a rutas no permitidas
    if (userRole === 'journalist' && !urlPath.startsWith('/periodista/noticias')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Token inválido o error en la verificación:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/periodista/:path*'], // Aplica el middleware a todas las rutas que comienzan con /admin y /periodista
};
