import React, { useState } from "react";
import IconButton from "../button/IconButton";

interface HelpPopupProps {
  open: boolean;
  onClose: () => void;
}

const helpPages = [
  { key: "intro", label: "Introduction" },
  { key: "usage", label: "Usage" },
  { key: "faq", label: "FAQ" },
  { key: "contact", label: "Contact" },
];

const HelpPopup: React.FC<HelpPopupProps> = ({ open, onClose }) => {
  const [selectedPage, setSelectedPage] = useState("intro");
  if (!open) return null;

  const renderContent = () => {
    switch (selectedPage) {
      case "intro":
        return (
          <div>
            <h3>Welcome</h3>
            <p>This is the introduction to the help section.</p>
          </div>
        );
      case "usage":
        return (
          <div>
            <h3>How to Use</h3>
            <p>Instructions on how to use the main features.</p>
          </div>
        );
      case "faq":
        return (
          <div>
            <h3>FAQ</h3>
            <ul>
              <li>Q: ...</li>
              <li>A: ...</li>
            </ul>
          </div>
        );
      case "contact":
        return (
          <div>
            <h3>Contact</h3>
            <p>Contact us at support@example.com</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[95vh] min-h-[600px] overflow-hidden p-8 relative">
        {/* Title and Close Button Row */}
        <div className="flex items-center justify-between mb-4 pr-8" style={{ minHeight: 32 }}>
          <h2 className="text-2xl font-bold flex items-center h-8 m-0 p-0" style={{ lineHeight: '32px', height: 32 }}>Help</h2>
          <div className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-transparent border-none cursor-pointer">
            <IconButton
              imageSrc="/images/icon/close.svg"
              width={16}
              height={16}
              onClick={onClose}
            />
          </div>
        </div>
        {/* Horizontal button list */}
        <div className="flex space-x-2 mb-4 border-b pb-2">
          {helpPages.map((page) => (
            <button
              key={page.key}
              className={`px-4 py-1 rounded ${selectedPage === page.key ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-blue-100"}`}
              onClick={() => setSelectedPage(page.key)}
            >
              {page.label}
            </button>
          ))}
        </div>
        <div className="prose max-w-none overflow-y-auto custom-scrollbar pr-8" style={{ maxHeight: '70vh', minHeight: '350px' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default HelpPopup;
