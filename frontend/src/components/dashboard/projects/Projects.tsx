import React, { useState } from "react";
import ProjectsList from "./ProjectList";
import CreateProjectForm from "./CreateProjectForm";
import Modal from "./modal/Modal";

const ProjectsPage: React.FC = () => {
  // State to track when to refresh the projects list
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Increment the refreshTrigger to cause a refresh of the ProjectsList
  const handleProjectCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // Open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>

        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add New Project
        </button>
      </div>

      {/* Projects list - the key prop forces re-render when refreshTrigger changes */}
      <ProjectsList key={refreshTrigger} />

      {/* Project creation modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Create New Project"
      >
        <CreateProjectForm
          onProjectCreated={handleProjectCreated}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default ProjectsPage;
