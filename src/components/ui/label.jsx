import React from 'react';

export const Label = ({ htmlFor, children, className = '', ...props }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block font-medium text-gray-700 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
};
