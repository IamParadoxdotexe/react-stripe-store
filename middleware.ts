import { authMiddleware, redirectToSignIn } from '@clerk/nextjs';
import appConfig from './utils/constants/appConfig';

export default authMiddleware({
  afterAuth(auth, req, evt) {
    const isAdmin = !!auth.userId && appConfig.adminUserIds.includes(auth.userId);

    if (!auth.isPublicRoute && !isAdmin) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  },
  publicRoutes: [
    '/',
    '/home',
    '/search',
    '/api/ping',
    '/api/stripe/products',
    '/api/stripe/checkout',
    '/api/stripe/webhooks'
  ]
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
};
