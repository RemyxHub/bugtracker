import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Search, Moon, Sun, ChevronDown } from "lucide-react";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import TicketManagement from "@/components/admin/TicketManagement";
import UserManagement from "@/components/admin/UserManagement";

const Dashboard = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [dateRange, setDateRange] = useState<string>("01.08.2022 - 31.08.2022");
  const [activeTab, setActiveTab] = useState("dashboard");
  const userRole = localStorage.getItem("userRole") || "admin";

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userRole = localStorage.getItem("userRole");

    if (
      !isAuthenticated ||
      (userRole !== "admin" && userRole !== "callcentre")
    ) {
      navigate(
        userRole === "callcentre" ? "/callcentre/login" : "/admin/login",
      );
    }
  }, [navigate]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    navigate("/admin/login");
  };

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`w-64 min-h-screen p-4 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}
        >
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">✦</span>
            </div>
            <span className="font-semibold text-lg">Business</span>
          </div>

          <nav className="space-y-2">
            <div
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 ${
                activeTab === "dashboard"
                  ? theme === "dark"
                    ? "bg-gray-700"
                    : "bg-gray-100"
                  : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <span className="w-5 h-5">📊</span>
              <span>Dashboard</span>
            </div>
            <div
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 ${
                activeTab === "tickets"
                  ? theme === "dark"
                    ? "bg-gray-700"
                    : "bg-gray-100"
                  : ""
              }`}
              onClick={() => setActiveTab("tickets")}
            >
              <span className="w-5 h-5">🎫</span>
              <span>Tickets</span>
            </div>
            {userRole === "admin" && (
              <div
                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  activeTab === "users"
                    ? theme === "dark"
                      ? "bg-gray-700"
                      : "bg-gray-100"
                    : ""
                }`}
                onClick={() => setActiveTab("users")}
              >
                <span className="w-5 h-5">👥</span>
                <span>Users</span>
              </div>
            )}
            <div
              className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
              onClick={handleLogout}
            >
              <span className="w-5 h-5">🚪</span>
              <span>Sign Out</span>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">
                {activeTab === "dashboard"
                  ? "Dashboard"
                  : activeTab === "tickets"
                    ? "Ticket Management"
                    : "User Management"}
              </h1>
              {activeTab === "dashboard" && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">{dateRange}</span>
                  <button>
                    <span className="sr-only">Calendar</span>
                    <span>📅</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <Input
                  className={`pl-10 w-64 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
                  placeholder="Search..."
                />
              </div>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                  <AvatarFallback>KK</AvatarFallback>
                </Avatar>
                <span className="text-sm">Kimi Kamiyama</span>
              </div>
            </div>
          </div>

          <div>
            {activeTab === "dashboard" && <AnalyticsDashboard theme={theme} />}
            {activeTab === "tickets" && <TicketManagement theme={theme} />}
            {activeTab === "users" && userRole === "admin" && (
              <UserManagement theme={theme} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
