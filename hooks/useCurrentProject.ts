import { UseSelector } from "@/stores/store";
import { RootState } from "@/stores/store";

export const useCurrentProject = () => {
  const currentProject = UseSelector((state: RootState) => state.appConfig.currentProject);

  return {
    currentProject,
    isProjectSelected: !!currentProject,
    projectId: currentProject?.id,
    projectName: currentProject?.name,
  };
};
