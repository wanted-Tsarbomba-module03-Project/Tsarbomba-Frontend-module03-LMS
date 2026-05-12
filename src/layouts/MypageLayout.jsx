import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";

function MypageLayout() {
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

export default MypageLayout;
