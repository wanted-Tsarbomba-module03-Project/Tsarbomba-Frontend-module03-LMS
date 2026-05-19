import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import "./EmptyLayout.css";

function EmptyLayout() {
  return (
    <div className="empty-layout-wrapper">
      <Header isSimple={true} />
      <div className="empty-layout-content">
        <Outlet />
      </div>
    </div>
  );
}

export default EmptyLayout;
