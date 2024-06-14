// Layout.tsx

import React from 'react';
import './Layout.css'; // Importa estilos personalizados

const Layout: React.FC = ({ children }) => {
  return (
    <div className="layout">
      {children}
    </div>
  );
};

export default Layout;
