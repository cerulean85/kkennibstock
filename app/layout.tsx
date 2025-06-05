import ProviderWrapper from "@/components/ProviderWrapper";
import "./globals.css";
import ClientRootLayout from "@/components/ClientRootLayout";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <ProviderWrapper>
        <body>
          <ClientRootLayout>
            {children}
          </ClientRootLayout>
        </body>
      </ProviderWrapper>
    </html>
  );
}
