export default function SettingsLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <section>
          {children}
        </section>
    );
  }
  