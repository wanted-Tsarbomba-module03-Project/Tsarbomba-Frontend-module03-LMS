import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import "./MypageLayout.css";

function MypageLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mypage-layout-wrapper">
      <Header onToggle={() => setIsOpen(!isOpen)} />
      <div className="mypage-layout-body">
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        {isOpen && (
          <div
            className="mypage-layout-overlay"
            onClick={() => setIsOpen(false)}
          />
        )}
        <main className="mypage-layout-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default MypageLayout;
