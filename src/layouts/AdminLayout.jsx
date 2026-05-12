import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

function AdminLayout() {
  return (
    <>
      <Header />
      <Sidebar />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default AdminLayout;
