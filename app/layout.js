import { Inter } from 'next/font/google';
import './globals.css';
import SessionProvider from '/components/SessionProvider';
import { getServerSession } from 'next-auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'กำหนดการจ่ายเงิน กองบัญชีและการเงิน กปภ.ข.๖',
  description: 'ระบบแจ้งกำหนดการจ่ายเงิน กองบัญชีและการเงิน กปภ.ข.๖',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang='en'>
      <body className={inter.className}>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
