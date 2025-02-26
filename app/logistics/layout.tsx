"use client"
export default function LogisticsLayout({
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
  