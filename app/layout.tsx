import ProviderWrapper from "@/components/ProviderWrapper";
import "./globals.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <ProviderWrapper>
        <body>
        {children}
        </body>
      </ProviderWrapper>
    </html>
  );
}
