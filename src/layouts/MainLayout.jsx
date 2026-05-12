import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import CategoryNav from "../components/layout/CategoryNav";
import Footer from "../components/layout/Footer";

function MainLayout() {
  return (
    <>
      <Header />
      <CategoryNav />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
