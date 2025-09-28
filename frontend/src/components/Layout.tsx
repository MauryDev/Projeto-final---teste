import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './footer';

const pageContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

const mainContentStyle: React.CSSProperties = {
  flexGrow: 1,
};

const footerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
};

const Layout = () => {
  return (
    <div style={pageContainerStyle}>
      <Navbar />
      <main style={mainContentStyle}>
        <Outlet />
      </main>
      <Footer style={footerStyle} />
    </div>
  );
};

export default Layout;