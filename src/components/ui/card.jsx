import React from 'react';

// Card Component
export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

// CardContent Component
export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};
