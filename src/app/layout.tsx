import './globals.css';
import Header from './components/layout/Header';
import { headers } from 'next/headers';
import ContextProvider from '../contexts/appKitContext';
import { WalletProvider } from '../contexts/WalletContext';
import { Toaster } from 'react-hot-toast';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie');

  return (
    <html lang='en'>
      <body className='min-h-screen bg-black'>
        <Header />
        <ContextProvider cookies={cookies}>
          <WalletProvider>{children}
          <Toaster />
          </WalletProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
