import React from 'react';

// Main Dialog Component
export const Dialog = ({ isOpen, onClose, children, className = '' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg p-4 shadow-lg ${className}`} role="dialog">
        {children}
      </div>
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        onClick={onClose}
      >
        &times;
      </button>
    </div>
  );
};

// Dialog Content
export const DialogContent = ({ children, className = '' }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

// Dialog Header
export const DialogHeader = ({ children, className = '' }) => {
  return <header className={`border-b pb-2 mb-4 ${className}`}>{children}</header>;
};

// Dialog Title
export const DialogTitle = ({ children, className = '' }) => {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
};

// Dialog Trigger
export const DialogTrigger = ({ children, onClick, className = '' }) => {
  return (
    <button
      className={`text-blue-500 hover:text-blue-700 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
