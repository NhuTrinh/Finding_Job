import React from "react";
import HeaderCandidate from "./HeaderCandidate";
import { Outlet } from "react-router-dom";

export default function CandidateLayout() {
  return (
    <>
      <HeaderCandidate />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </>
  );
}