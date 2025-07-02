"use client";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/stores/store";
import { setCurrentMenu } from "@/stores/appConfigSlice";

const CommonNav = () => {
  const dispatch: AppDispatch = useDispatch();
  const menuNames: any = {
    stock_holdings: "Stock Holdings",
  };

  const menuKeys = Object.keys(menuNames);

  const router = useRouter();

  const movePage = (menuName: string) => {
    dispatch(setCurrentMenu(menuName));
    router.push(`/${menuName}`);
  };

  return (
    <div>
      {
        <nav className="nav-main h-full bg-gray-900 text-white">
          <div className="vh-center p-3 bg-black-night">
            <img width={160} src="/images/icon/logo_title.svg" />
          </div>

          <div>
            {menuKeys.map((menuKey: string, index: number) => (
              <div className="px-3 mt-4" key={index}>
                <div className="d-flex menu-label justify-content-center">
                  <a onClick={() => movePage(menuKey)}>{menuNames[menuKey]}</a>
                </div>
              </div>
            ))}
          </div>
        </nav>
      }
    </div>
  );
};

export default CommonNav;
