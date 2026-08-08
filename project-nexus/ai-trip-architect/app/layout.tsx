import './globals.css';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'AI Trip Architect',
  description: 'Plan your dream vacation with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
        <Toaster position="top-right" theme="dark" richColors />
      </body>
    </html>
  );
}
