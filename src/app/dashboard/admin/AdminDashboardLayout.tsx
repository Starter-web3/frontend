"use client";
import React, { useState, ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import DashboardHeader from "../Header";
import Footer from "../../components/layout/Footer";
import { useWallet } from "../../../contexts/WalletContext";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isConnected } = useWallet();

  return (
    <div className="flex h-screen overflow-hidden bg-black/90 text-[hsl(var(--foreground))] font-inter">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <div
        className={`fixed inset-y-0 left-0 w-64 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition duration-200 ease-in-out z-50 md:z-10`}
      >
        <AdminSidebar />
      </div>
      <div className="flex-1 flex flex-col h-screen md:ml-64">
        <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isConnected={isConnected} />
        <div className="flex-1 overflow-y-auto">
          <main className="p-4 md:p-8">
            {!isConnected ? (
              <div className="text-center p-8">
                <p>Please connect your wallet to access the admin dashboard</p>
                <button
                  onClick={() =>
                    document.querySelector("appkit-button")?.click()
                  }
                >
                  Connect Wallet
                </button>
              </div>
            ) : (
              children
            )}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
