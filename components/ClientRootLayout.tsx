"use client";
import "@/styles/common.scss";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import TokenManager from "@/components/TokenManager";
import { RootState, UseDispatch, UseSelector } from "@/stores/store";
import Loading from "@/components/Loading";
import { setCurrentMenu, setCurrentPage } from "@/stores/appConfigSlice";
import { getLobbyPage, Menu, Page } from "@/lib/contant";
import IconButton from "@/components/button/IconButton";
import ProfileComponent from "./ProfileComponent";
import HelpPopup from "./popup/HelpPopup";
import ContactUsPopup from "./popup/ContactUsPopup";
import AddNewWorkPopup from "./popup/AddNewWorkPopup";
import CreateNewProjectPopup from "./popup/CreateNewProjectPopup";
import { ProjectItem, ProjectResponse } from "@/model/ProjectItem";
import { ProjectService } from "@/services/ProjectService";

type IconTextButtonProps = {
  releasedIconSrc: string;
  pressedIconSrc: string;
  keyname: string;
  label: string;
  width?: number;
  height?: number;
  onClick?: () => void;
};

const IconTextButton: React.FC<IconTextButtonProps> = ({
  releasedIconSrc,
  pressedIconSrc,
  keyname,
  label,
  width = 20,
  height = 20,
  onClick,
}) => {
  const currentPage = UseSelector((state: RootState) => state.appConfig.currentPage);
  return currentPage == keyname ? (
    <button
      type="button"
      className="w-full h-[32px] flex items-center justify-between px-2 rounded transition cursor-default"
    >
      <div className="flex items-center space-x-2">
        <img src={pressedIconSrc} width={width} height={height} alt={label} />
        <span className="font-medium text-[13px] text-zinc-950">{label}</span>
      </div>
    </button>
  ) : (
    <button
      type="button"
      className="w-full h-[32px] flex items-center justify-between px-2 rounded transition hover:bg-gray-200 text-gray-700"
      onClick={onClick}
    >
      <div className="flex items-center space-x-2">
        <img src={releasedIconSrc} width={width} height={height} alt={label} />
        <span className="font-normal text-[13px] text-gray-700 hover:text-zinc-950">{label}</span>
      </div>
    </button>
  );
};

type TextButtonProps = {
  label: string;
  keyname: string;
  onClick?: () => void;
};

const TextButton: React.FC<TextButtonProps> = ({ label, keyname, onClick }) => {
  const currentMenu = UseSelector((state: RootState) => state.appConfig.currentMenu);
  return currentMenu == keyname ? (
    <button
      type="button"
      className="w-full h-[32px] flex items-center justify-between px-2 rounded transition cursor-default"
    >
      <div className="flex items-center space-x-2">
        <span className="font-medium text-[13px] text-zinc-950">{label}</span>
      </div>
    </button>
  ) : (
    <button
      type="button"
      className="w-full h-[32px] flex items-center justify-between px-2 rounded transition text-gray-700"
      onClick={onClick}
    >
      <div className="flex items-center space-x-2">
        <span className="font-normal text-[13px] text-gray-700 hover:text-zinc-950">{label}</span>
      </div>
    </button>
  );
};

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = UseDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<ProjectItem | null>(null);
  const [projectList, setProjectList] = useState<ProjectItem[]>();
  const allPageLoading = UseSelector((state: RootState) => state.appConfig.allPageLoading);
  const currentMenu = UseSelector((state: RootState) => state.appConfig.currentMenu);
  const currentPage = UseSelector((state: RootState) => state.appConfig.currentPage);
  const [pageObject, setPageObject] = useState<{ [key: string]: any }>({});
  const pathname = usePathname();
  const [pageLoading, setPageLoading] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [contactUsOpen, setContactUsOpen] = useState(false);
  const [addNewWorkOpen, setAddNewWorkOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  const menuPageSkeleton: { [key: string]: any } = {
    // [Menu.Stock]: {
    //   label: "Stock",
    //   page: {
    //     [Page.StockProfit]: { label: "Profit" },
    //     [Page.StockMetrics]: { label: "Metrics" },
    //     [Page.StockNews]: { label: "News" },
    //   },
    // },
    [Menu.TextMining]: {
      label: "Text Mining",
      page: {
        [Page.TextMiningDashboard]: { label: "Dashboard" },
        [Page.TextMiningSearch]: { label: "Search" },
        [Page.TextMiningClean]: { label: "Clean" },
        [Page.TextMiningFrequency]: { label: "Frequency" },
        [Page.TextMiningTfidf]: { label: "TF-IDF" },
        [Page.TextMiningConcor]: { label: "Concordance" },
      },
    },
    [Menu.Settings]: {
      label: "Settings",
      page: {
        [Page.SettingsProfile]: { label: "Profile" },
        [Page.SettingsProject]: { label: "Project" },
      },
    },
  };

  useEffect(() => {
    new ProjectService()
      .getProjectList(1, 30)
      .then((projects: ProjectResponse) => {
        setProjectList(projects.list);
        if (projects.list && projects.list.length > 0) {
          const selectedProjectId = localStorage.getItem("selectedProjectId");
          if (!selectedProjectId) {
            setCurrentProject(projects.list[0]);
          } else {
            const foundProject = projects.list.find(project => project.id === Number(selectedProjectId));
            if (foundProject) {
              setCurrentProject(foundProject);
            } else {
              setCurrentProject(projects.list[0]);
            }
          }
        }
      })
      .catch(error => {
        console.error("Failed to fetch project list:", error);
      });
  }, []);

  useEffect(() => {
    if (!currentMenu && !currentPage) {
      return;
    }

    let _currentPage = currentPage;
    if (currentPage) {
      setPageObject(menuPageSkeleton[currentMenu].page);
    } else {
      _currentPage = Object.keys(menuPageSkeleton[currentMenu].page)[0];
    }
    movePage(currentMenu, _currentPage);
  }, [currentMenu, currentPage]);

  const movePage = (menu: string, page: string | null) => {
    dispatch(setCurrentMenu(menu));
    if (!page) return;
    dispatch(setCurrentPage(page));
    setPageLoading(true);
    router.push(`/${menu}/${page}`);

    setTimeout(() => {
      setPageLoading(false);
    }, 1000); // Simulate loading time, adjust as necessary
  };

  const selectPage = (menu: string, page: string | null) => {
    dispatch(setCurrentMenu(menu));
    dispatch(setCurrentPage(page));
  };

  useEffect(() => {
    if (!pathname) return;

    const pageName = pathname.split("/");
    if (pageName.length < 3) {
      return;
    }
    const menu = pageName[1];
    const page = pageName[2];
    dispatch(setCurrentMenu(menu));
    dispatch(setCurrentPage(page));
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProjectDropdownOpen) {
        const target = event.target as Element;
        if (!target.closest(".relative")) {
          setIsProjectDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProjectDropdownOpen]);

  useEffect(() => {
    if (!currentProject) {
      return;
    }

    // 최초 진입 시
    const newProjectId: number = currentProject.id;
    const oldProjectId = localStorage.getItem("selectedProjectId");
    if (!oldProjectId) {
      localStorage.setItem("selectedProjectId", String(newProjectId));
      return;
    }

    if (oldProjectId && newProjectId !== Number(oldProjectId)) {
      localStorage.setItem("selectedProjectId", String(newProjectId));
      window.location.href = "/" + getLobbyPage();
    }
  }, [currentProject]);

  const createProject = async (name: string, description: string = "") => {
    new ProjectService()
      .createProject(name, description)
      .then((project: ProjectItem) => {
        setProjectList(prevList => [...(prevList || []), project]);
        setCurrentProject(project);
        setCreateProjectOpen(false);
      })
      .catch(error => {
        console.error("Error creating project:", error);
        alert("Failed to create project. Please try again later.");
      });
  };

  return (
    <div className="flex flex-col min-h-screen mx-auto">
      <TokenManager />
      <HelpPopup open={helpOpen} onClose={() => setHelpOpen(false)} />
      <ContactUsPopup open={contactUsOpen} onClose={() => setContactUsOpen(false)} />
      <AddNewWorkPopup open={addNewWorkOpen} onClose={() => setAddNewWorkOpen(false)} />
      <CreateNewProjectPopup
        open={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        onCreateProject={createProject}
      />
      {allPageLoading ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Loading />
        </div>
      ) : (
        <div>
          <header className="h-[54px] bg-gray-100">
            <div className="w-full h-full flex justify-between items-center ps-3 pe-5">
              <div className="relative">
                <button
                  type="button"
                  className="px-2 py-2 rounded hover:bg-gray-200 transition"
                  onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-zinc-950 font-medium text-[14px]">
                      {currentProject?.name || "Select Project"}
                    </span>
                    <svg
                      width="8"
                      height="11"
                      viewBox="0 0 10 16"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`transition-transform ${isProjectDropdownOpen ? "rotate-180" : ""}`}
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.34151 0.747423C4.71854 0.417526 5.28149 0.417526 5.65852 0.747423L9.65852 4.24742C10.0742 4.61111 10.1163 5.24287 9.75259 5.6585C9.38891 6.07414 8.75715 6.11626 8.34151 5.75258L5.00001 2.82877L1.65852 5.75258C1.24288 6.11626 0.61112 6.07414 0.247438 5.6585C-0.116244 5.24287 -0.0741267 4.61111 0.34151 4.24742L4.34151 0.747423ZM0.246065 10.3578C0.608879 9.94139 1.24055 9.89795 1.65695 10.2608L5.00001 13.1737L8.34308 10.2608C8.75948 9.89795 9.39115 9.94139 9.75396 10.3578C10.1168 10.7742 10.0733 11.4058 9.65695 11.7687L5.65695 15.2539C5.28043 15.582 4.7196 15.582 4.34308 15.2539L0.343082 11.7687C-0.0733128 11.4058 -0.116749 10.7742 0.246065 10.3578Z"
                      />
                    </svg>
                  </div>
                </button>

                {/* Project Dropdown Menu */}
                {isProjectDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                      {/* Current Projects Section */}
                      <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
                        Projects
                      </div>

                      {/* Projects List or Empty Message */}
                      {projectList && projectList.length > 0 ? (
                        projectList.map((project: ProjectItem, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center justify-between ${
                              currentProject?.id === project.id ? "bg-blue-50 text-blue-700" : "text-gray-700"
                            }`}
                            onClick={() => {
                              setCurrentProject(project);
                              setIsProjectDropdownOpen(false);
                            }}
                          >
                            <span>{project.name}</span>
                            {currentProject?.id === project.id && (
                              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-6 text-center">
                          <div className="flex flex-col items-center space-y-2">
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                              />
                            </svg>
                            <div className="text-sm text-gray-500">
                              <div className="font-medium">No projects found</div>
                              <div className="text-xs mt-1">Create your first project to get started</div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Divider */}
                      <div className="border-t border-gray-100 my-2"></div>

                      {/* Actions Section */}
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                        onClick={() => {
                          setIsProjectDropdownOpen(false);
                          setCreateProjectOpen(true);
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Create New Project</span>
                      </button>

                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                        onClick={() => {
                          setIsProjectDropdownOpen(false);
                          movePage(Menu.Settings, Page.SettingsProject);
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>Project Settings</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden h-full md:flex items-center space-x-6">
                {Object.keys(menuPageSkeleton).map((menuKey: string) => {
                  const menu = menuPageSkeleton[menuKey];
                  return (
                    <div key={menuKey}>
                      <TextButton
                        label={menu.label}
                        keyname={menuKey}
                        onClick={() => {
                          setIsMenuOpen(false);
                          movePage(menuKey, Object.keys(menu.page)[0]);
                        }}
                      />
                    </div>
                  );
                })}

                <ProfileComponent />
              </div>

              <div className="flex md:hidden items-center space-x-2">
                <IconButton
                  imageSrc={isMenuOpen ? "/images/icon/close.svg" : "/images/icon/more.svg"}
                  width={isMenuOpen ? 16 : 20}
                  height={isMenuOpen ? 16 : 20}
                  onClick={toggleMenu}
                />
              </div>
            </div>
          </header>

          {/* 모바일 메뉴 (햄버거 메뉴가 클릭되면 표시) */}
          {isMenuOpen && (
            <div
              className="
                  fixed left-0 right-0
                  top-[50px] bottom-0
                  z-40
                  w-full h-[calc(100vh-56px)]
                  overflow-auto
                  px-2 pt-3 pb-4
                  bg-gray-100
                  flex flex-col
                "
            >
              <div className="w-full h-[calc(100%)] border-r border-gray-200 pb-1">
                <div className="w-full h-full overflow-auto px-4 pt-3 pb-4 mb-2 bg-white rounded border border-gray-200">
                  <div className="flex justify-between items-center mb-4 px-[60px]">
                    {Object.keys(menuPageSkeleton).map((menuKey: string) => {
                      const menu = menuPageSkeleton[menuKey];
                      return (
                        <div key={menuKey}>
                          <TextButton
                            label={menu.label}
                            keyname={menuKey}
                            onClick={() => {
                              selectPage(menuKey, null);
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    {pageObject &&
                      Object.keys(pageObject).map((pageKey: string) => {
                        const page = pageObject[pageKey];
                        return (
                          <button
                            type="button"
                            className="w-full h-[32px] flex items-center justify-between px-2 rounded transition hover:bg-gray-200 text-gray-700"
                            onClick={() => {
                              setIsMenuOpen(false);
                              movePage(currentMenu, pageKey);
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              <img
                                src={`/images/icon/${page.label.replace("-", "").toLowerCase()}_released.svg`}
                                width={20}
                                height={20}
                                alt=""
                              />
                              <span className="font-normal text-[13px] text-gray-700 hover:text-zinc-950">
                                {page.label}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}

          <main className="flex bg-gray-100 h-[calc(100vh-54px)]">
            <aside className="hidden sm:block w-[210px] h-full">
              <div className="w-full h-[calc(100%-200px)] border-r border-gray-200 pb-1">
                <div className="w-full h-full overflow-y-scroll custom-scrollbar px-1 space-y-1">
                  {pageObject &&
                    Object.keys(pageObject).map((pageKey: string, index: number) => {
                      const page = pageObject[pageKey];
                      return (
                        <div key={pageKey}>
                          <IconTextButton
                            keyname={pageKey}
                            releasedIconSrc={`/images/icon/${page.label.replace("-", "").toLowerCase()}_released.svg`}
                            pressedIconSrc={`/images/icon/${page.label.replace("-", "").toLowerCase()}_pressed.svg`}
                            label={page.label}
                            onClick={() => {
                              setIsMenuOpen(false);
                              movePage(currentMenu, pageKey);
                            }}
                          />
                          {/* Add New Task button after Dashboard */}
                          {currentMenu === Menu.TextMining && pageKey === Page.TextMiningDashboard && (
                            <button
                              type="button"
                              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white px-5 py-2 rounded-lg font-bold text-base shadow-md hover:from-blue-900 hover:to-sky-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 my-2"
                              onClick={() => setAddNewWorkOpen(true)}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              <span className="text-xs font-medium">New Task</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="w-full h-[200px] border-t border-r border-gray-200 px-1 py-1">
                <IconTextButton
                  keyname="help"
                  releasedIconSrc="/images/icon/help.svg"
                  pressedIconSrc="/images/icon/help.svg"
                  label="Help"
                  width={18}
                  height={18}
                  onClick={() => setHelpOpen(true)}
                />
                <IconTextButton
                  keyname="contact"
                  releasedIconSrc="/images/icon/contact.svg"
                  pressedIconSrc="/images/icon/contact.svg"
                  label="Contact Us"
                  width={14}
                  height={14}
                  onClick={() => setContactUsOpen(true)}
                />
              </div>
            </aside>

            <div className="w-full overflow-auto px-4 pt-3 pb-4 mx-2 mb-2 bg-white rounded border border-gray-200">
              {pageLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loading />
                </div>
              ) : (
                <div className="w-full h-full">{children}</div>
              )}
            </div>
            {/* <section> */}
            {/* <div className="w-[calc(100%-210px)] h-[calc(100vh-54px)] p-4 mx-2 mb-2 bg-white rounded border border-gray-200"> */}
            {/* {children} */}
            {/* </div> */}
            {/* </section> */}
          </main>

          {/* <footer className="h-[var(--footer-height)] bg-[var(--bg-footer-color)] text-white text-[0.65rem]">
            <div className="w-full h-full flex justify-center items-center">
              &copy; 2025. ZHkim All Rights Reserved.
            </div>
          </footer> */}
        </div>
      )}
    </div>
  );
}
