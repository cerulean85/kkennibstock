import React, { useState } from "react";

const ToggleSwitch = ({ enabled, setEnabled }: { enabled: boolean; setEnabled: (value: boolean) => void }) => {
  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`w-14 h-8 flex items-center rounded-full p-1 duration-300 ease-in-out
        ${enabled ? "bg-green-500" : "bg-gray-300"}`}
    >
      <div
        className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out
          ${enabled ? "translate-x-6" : "translate-x-0"}`}
      />
    </button>
  );
};

export default ToggleSwitch;
