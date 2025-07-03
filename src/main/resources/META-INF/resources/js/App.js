import React from 'react';

export default function App() {
  const containerStyles = {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif'
  };

  const headerStyles = {
    color: '#333'
  };

  const paragraphStyles = {
    color: '#555'
  };

  return (
    <div style={containerStyles}>
      <h1 style={headerStyles}>Hello from My React Portlet!</h1>
      <p style={paragraphStyles}>This component is rendered by React within a Liferay portlet.</p>
    </div>
  );
}
