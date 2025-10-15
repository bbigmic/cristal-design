import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Dodatkowa logika middleware jeśli potrzebna
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Sprawdź czy użytkownik jest zalogowany
        if (!token) {
          return false;
        }

        // Sprawdź czy próbuje uzyskać dostęp do panelu admin
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token.role === "ADMIN";
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"]
};
