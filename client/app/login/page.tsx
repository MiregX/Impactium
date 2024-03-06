import { Metadata } from 'next';
import { LoginPage } from '@/components/login/Page';

export const metadata: Metadata = {
  title: 'Login',
};

export default function Login() {
  return (
    <LoginPage />
  );
};