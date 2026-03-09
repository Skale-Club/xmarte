import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'My Home Automation',
    description: 'Personalized home automation system',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
