import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/CategoryNav";
import "./MainLayout.css";

function MainLayout() {
  return (
    <div className="main-layout-wrapper">
      <Header />
      <Navbar />
      <main className="main-layout-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
