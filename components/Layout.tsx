import React, { useState } from "react";
import {
  Home,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { View } from "../App";
import { Button } from "./ui/button";

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onNavigate: (view: View) => void;
}

export function Layout({
  children,
  currentView,
  onNavigate,
}: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const navigationItems = [
    { id: "landing", icon: Home, label: "Home" },
    { id: "add-log", icon: Plus, label: "Add Log" },
    { id: "scan", icon: Search, label: "Search" },
  ];

  return (
    <div className="flex h-screen bg-bg">
      {/* Sidebar */}
      <div
        className={`${sidebarCollapsed ? "w-16" : "w-60"} bg-surface border-r border-border-color flex flex-col transition-all duration-300`}
      >
        <div className="p-6 border-b border-border-color flex items-center justify-between">
          {!sidebarCollapsed && (
            <h2 className="font-semibold text-text">
              Abend Log
            </h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setSidebarCollapsed(!sidebarCollapsed)
            }
            className="p-1 hover:bg-primary/10"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === currentView;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id as View)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive
                        ? "bg-surface/60 text-primary border-l-4 border-primary ml-0 pl-2"
                        : "text-text-sub hover:text-text hover:bg-surface/40"
                    }`}
                    title={
                      sidebarCollapsed ? item.label : undefined
                    }
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <span>{item.label}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}