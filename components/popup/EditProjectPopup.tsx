"use client";
import React, { useState, useEffect } from "react";
import { nameRegex } from "@/lib/contant";
import { ProjectItem } from "@/model/ProjectItem";

interface EditProjectPopupProps {
  open: boolean;
  project: ProjectItem | null;
  onClose: () => void;
  onUpdateProject?: (projectId: number, projectName: string, projectDescription: string) => void;
}

const EditProjectPopup: React.FC<EditProjectPopupProps> = ({ open, project, onClose, onUpdateProject }) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [nameError, setNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with project data when popup opens
  useEffect(() => {
    if (open && project) {
      setProjectName(project.name || "");
      setProjectDescription(project.description); // Add description field if needed
      setNameError("");
    }
  }, [open, project]);

  const validateProjectName = (name: string) => {
    if (!name.trim()) {
      return "Project name is required";
    }
    if (!nameRegex.test(name)) {
      return "Project name must be at least 5 characters and contain only letters, numbers, spaces, hyphens, and underscores";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!project) return;

    const error = validateProjectName(projectName);
    if (error) {
      setNameError(error);
      return;
    }

    setIsSubmitting(true);
    try {
      // Call the update project function if provided
      if (onUpdateProject) {
        await onUpdateProject(project.id, projectName.trim(), projectDescription.trim());
      }

      // Reset form and close popup
      handleClose();
    } catch (error) {
      console.error("Error updating project:", error);
      // Handle error (you can add error state here if needed)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setProjectName("");
    setProjectDescription("");
    setNameError("");
    onClose();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProjectName(value);
    if (nameError) {
      const error = validateProjectName(value);
      setNameError(error);
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (!dateObj || isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (!open || !project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 rounded-full p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Edit Project</h2>
                <p className="text-blue-100 text-sm">Update project information</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Project Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Project ID: <span className="font-mono">{project.id}</span>
              </span>
              <span>Created: {formatDate(project.createDate)}</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Project Name */}
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                id="projectName"
                type="text"
                value={projectName}
                onChange={handleNameChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  nameError ? "border-red-300 focus:ring-red-500" : "border-gray-300"
                }`}
                placeholder="Enter project name"
                disabled={isSubmitting}
              />
              {nameError && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {nameError}
                </p>
              )}
            </div>

            {/* Project Description */}
            <div>
              <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="projectDescription"
                value={projectDescription}
                onChange={e => setProjectDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                placeholder="Describe your project (optional)"
                disabled={isSubmitting}
              />
              <p className="mt-1 text-xs text-gray-500">{projectDescription.length}/200 characters</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !projectName.trim() || !!nameError}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      className="opacity-75"
                    />
                  </svg>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Update Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectPopup;
