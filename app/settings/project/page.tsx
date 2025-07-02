"use client";
import React, { useState, useEffect } from "react";
import { ProjectService } from "@/services/ProjectService";
import EditProjectPopup from "@/components/popup/EditProjectPopup";
import { ProjectItem, ProjectResponse } from "@/model/ProjectItem";

const ProjectPage = () => {
  const [currentProject, setCurrentProject] = useState<ProjectItem | null>(null);
  const [projectList, setProjectList] = useState<ProjectItem[]>([
    {
      id: 1,
      name: "Project A",
      createDate: new Date("2023-01-01"),
      description: "",
      memberId: 0,
    },
    {
      id: 2,
      name: "Project B",
      createDate: new Date("2023-02-01"),
      description: "",
      memberId: 0,
    },
  ]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      new ProjectService()
        .getProjectList(1, 30)
        .then((res: ProjectResponse) => {
          setProjectList(res.list);
        })
        .catch(error => {
          console.error("Error fetching project list:", error);
          alert("Failed to load projects. Please try again later.");
        });
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditStart = (project: ProjectItem) => {
    setEditingProject(project);
    setShowEditPopup(true);
  };

  const handleUpdateProject = async (projectId: number, projectName: string, projectDescription: string) => {
    new ProjectService()
      .updateProject(projectId, projectName, projectDescription)
      .then(() => {
        setProjectList((prevList: ProjectItem[]) =>
          prevList.map((project: ProjectItem) =>
            project.id === projectId
              ? {
                  ...project,
                  name: projectName,
                  description: projectDescription,
                }
              : project
          )
        );
      })
      .catch(error => {
        console.error("Error updating project:", error);
        alert("Failed to update project. Please try again later.");
      });
  };

  const handleDelete = async (id: number) => {
    const res: Boolean = await new ProjectService().deleteProject(id);
    if (!res) {
      alert("Failed to delete project. Please try again later.");
      return;
    }
    const updatedProjectList = projectList.filter(project => project.id !== id);
    setProjectList(updatedProjectList);
    setCurrentProject(updatedProjectList.length > 0 ? updatedProjectList[0] : null);
  };

  // Format date consistently to avoid hydration mismatch
  const formatDate = (date: Date | string) => {
    // Convert to Date object if it's a string
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Check if it's a valid date
    if (!dateObj || isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }

    // Use a fixed format that doesn't depend on locale
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (!mounted) {
    return null; // Prevent rendering until component has mounted
  }

  return (
    <div>
      <div className="text-xl font-medium text-zinc-950 border-b border-zinc-200 pb-2 mb-4">Manage Project</div>
      <div className="p-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectList &&
            projectList.map(project => (
              <div
                key={project.id}
                className={`bg-white rounded-lg shadow p-4 hover:shadow-lg transition-all border ${
                  currentProject?.id === project.id ? "border-blue-300 ring-2 ring-blue-100" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {currentProject?.id === project.id ? (
                        <div
                          className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                          title="Current Project"
                        >
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div
                          className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center"
                          title="Project"
                        >
                          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-zinc-800">{project.name}</h3>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end mb-2">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEditStart(project)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(project.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <p className="text-sm text-zinc-500" suppressHydrationWarning>
                  Created on: {formatDate(project.createDate)}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Edit Project Popup */}
      <EditProjectPopup
        open={showEditPopup}
        project={editingProject}
        onClose={() => {
          setShowEditPopup(false);
          setEditingProject(null);
        }}
        onUpdateProject={handleUpdateProject}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex items-center mb-4">
              <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Delete Project</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
