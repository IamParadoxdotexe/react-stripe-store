import { SignIn, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import appConfig from '@/utils/constants/appConfig';
import { getStyleExports } from '@/utils/functions/getStyleExports';
import { Alert } from '@mui/material';
import styles from './sign-in.module.scss';

const styleExports = getStyleExports();

export default function SignInPage() {
  const router = useRouter();
  const { userId } = useAuth();

  const isAdmin = !!userId && appConfig.adminUserIds.includes(userId);

  // redirect to admin page if already signed in
  if (isAdmin) {
    router.push('/admin');
    return null;
  }

  return (
    <div className={styles.signIn}>
      {!userId && (
        <SignIn
          appearance={{
            variables: {
              colorPrimary: styleExports.primary
            },
            elements: {
              card: {
                boxShadow: 'none'
              }
            }
          }}
        />
      )}

      {userId && (
        <Alert severity="error">
          Your account has not been given admin permissions. Please request access for{' '}
          <strong>{userId}</strong> from your administrator.
        </Alert>
      )}
    </div>
  );
}
