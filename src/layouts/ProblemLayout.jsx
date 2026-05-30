import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "./ProblemLayout.css";

function ProblemLayout() {
    return (
        <div className="problem-layout-wrapper">
            <Header />
            <main className="problem-layout-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default ProblemLayout;
