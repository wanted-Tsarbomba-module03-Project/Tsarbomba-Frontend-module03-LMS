import React from "react";
import Header from "../components/layout/Header";
import { Outlet } from "react-router-dom";

function EmptyLayout() {
  return (
    <>
      <Header />
      <div className="content">
        <Outlet />
      </div>
    </>
  );
}

export default EmptyLayout;
