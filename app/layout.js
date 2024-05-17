import { Athiti } from 'next/font/google';
import './globals.css';
import SessionProvider from '/components/SessionProvider';
import { getServerSession } from 'next-auth';

export const metadata = {
  title: 'กำหนดการจ่ายเงิน กองบัญชีและการเงิน กปภ.ข.๖',
  description: 'ระบบแจ้งกำหนดการจ่ายเงิน กองบัญชีและการเงิน กปภ.ข.๖',
};

export const athiti_init = Athiti({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-athiti',
  weight: '400',
  style: 'normal',
});

export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang='en'>
      <body className={`${athiti_init.variable}`}>
        <SessionProvider session={session}>
          <main className='athiti'>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
