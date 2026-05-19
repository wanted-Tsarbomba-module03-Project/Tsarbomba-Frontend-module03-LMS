import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import "./AdminLayout.css";

function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="admin-layout-wrapper">
      <Header onToggle={() => setIsOpen(!isOpen)} />
      <div className="admin-layout-body">
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        {isOpen && (
          <div
            className="admin-layout-overlay"
            onClick={() => setIsOpen(false)}
          />
        )}
        <main className="admin-layout-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AdminLayout;
