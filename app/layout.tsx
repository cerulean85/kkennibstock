import { ReactNode } from 'react';
import ProviderWrapper from '@/components/ProviderWrapper';
import CommonHeader from "@/layouts/header";
import CommonNav from "@/layouts/nav";
import CommonFooter from "@/layouts/footer";
import "@/styles/common.scss"
import 'bootstrap/dist/css/bootstrap.min.css';
import CommonMain from '@/layouts/main';

export default async function AppLayout({ children }: { children: ReactNode; params: { locale: string } }) {

  return (
    <ProviderWrapper>
    <html>
      <head>
        <title>Stock DEV</title>
      </head>
      <body>
        <div className="d-flex h-screen main-box">      
          <CommonNav></CommonNav>
          <section className="flex-1 bg-gray-100 overflow-auto w-100" >

              <CommonHeader></CommonHeader>
              <CommonMain children={children}></CommonMain>              
          </section>
        </div>
        <CommonFooter></CommonFooter>
      </body>
    </html>
    </ProviderWrapper>
  );
}
