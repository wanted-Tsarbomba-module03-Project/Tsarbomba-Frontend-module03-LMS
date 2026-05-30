import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import OneButtonModal from "../components/common/OneButtonModal";
import "./AdminLayout.css";

function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const canAccessAdmin = userRole === "ADMIN" || userRole === "OPERATOR";

  const handleAccessDeniedClose = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="admin-layout-wrapper">
      <Header onToggle={() => setIsOpen(!isOpen)} />
      <div className="admin-layout-body">
        {canAccessAdmin && (
          <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        )}
        {canAccessAdmin && isOpen && (
          <div
            className="admin-layout-overlay"
            onClick={() => setIsOpen(false)}
          />
        )}
        <main className="admin-layout-content">
          {canAccessAdmin && <Outlet />}
        </main>
      </div>
      <Footer />
      <OneButtonModal
        isOpen={!canAccessAdmin}
        onClose={handleAccessDeniedClose}
        modalTitle="입력 확인"
        modalContent="접근 권한이 없습니다."
      />
    </div>
  );
}

export default AdminLayout;
