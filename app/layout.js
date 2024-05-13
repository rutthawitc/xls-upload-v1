import { Inter, Athiti } from 'next/font/google';
import './globals.css';
import SessionProvider from '/components/SessionProvider';
import { getServerSession } from 'next-auth';

//const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'กำหนดการจ่ายเงิน กองบัญชีและการเงิน กปภ.ข.๖',
  description: 'ระบบแจ้งกำหนดการจ่ายเงิน กองบัญชีและการเงิน กปภ.ข.๖',
};

export const athiti_init = Athiti({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-athiti',
  weight: '400',
});
export default async function RootLayout({ children }) {
  const session = await getServerSession();
  return (
    <html lang='en'>
      {/* <body className={inter.className}> */}
      <body className={`${athiti_init.variable}`}>
        <SessionProvider session={session}>
          <main className='athiti'>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
