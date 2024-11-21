import React from 'react';

export const Select = ({ options, className = '', ...props }) => {
  return (
    <select
      className={`border rounded px-3 py-2 focus:outline-none focus:ring ${className}`}
      {...props}
    >
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
