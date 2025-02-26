"use client"
import { RootState, AppDispatch } from '@/stores/store';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentMenu, setCurrentPage} from '@/stores/appConfigSlice'
import { useRouter  } from 'next/navigation';
export default function NavSubMenuList({
    menuKey,
    endpoints
  }: Readonly<{
    menuKey: string;
    endpoints: string[];
  }>) {
    const router = useRouter();
    const dispatch: AppDispatch = useDispatch();
    const locale: string = useSelector((state: RootState) => state.appConfig.locale);
    const lt: any = useSelector((state: RootState) => state.appConfig.localeText);

    const pageNames = lt.endpoint;
    // const pageEndpoints = ["db_factory", "db_fin_house"];
    const movePage = (pageEndpoint: string) => {                     
      dispatch(setCurrentMenu(menuKey));
      dispatch(setCurrentPage(pageEndpoint));
      router.push(`/${locale}/${menuKey}/${pageEndpoint}`); 
    }
    return (
          <div>
            {endpoints.map((endpoint, index) => (
                <div className="mt-2" key={index}>
                    <a onClick={() => movePage(endpoint)}>- {pageNames[endpoint]}</a>
                </div>
            ))}
          </div>
    );
  }
  