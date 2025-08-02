import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  SearchIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  RefreshCwIcon,
  AlertCircle,
} from "lucide-react";
import { format, addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  fetchAnalyticsData,
  fetchChartData,
  fetchTickets,
  subscribeToTicketChanges,
} from "@/lib/supabase";

// Supabase Environment Variables Required:
// VITE_SUPABASE_URL=https://your-project-id.supabase.co
// VITE_SUPABASE_ANON_KEY=your-anon-key-here
// SUPABASE_PROJECT_ID=your-project-id
// SUPABASE_URL=https://your-project-id.supabase.co
// SUPABASE_ANON_KEY=your-anon-key-here
// SUPABASE_SERVICE_KEY=your-service-role-key-here
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AnalyticsDashboardProps {
  theme?: "light" | "dark";
}

const AnalyticsDashboard = ({ theme = "light" }: AnalyticsDashboardProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 11, 1), // December 1, 2024
    to: new Date(2024, 11, 31), // December 31, 2024
  });
  const [selectedYear, setSelectedYear] = useState("2024");
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [chartData, setChartData] = useState<any>({ sales: [], activity: [] });
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [selectedYear, dateRange]);

  // Set up real-time subscription for ticket changes
  useEffect(() => {
    const subscription = subscribeToTicketChanges(() => {
      loadDashboardData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch analytics data with date range
      const analytics = await fetchAnalyticsData(dateRange);
      console.log("Analytics data fetched:", analytics);
      if (analytics && analytics.length > 0) {
        const processedAnalytics = {
          orders: {
            value:
              analytics.find((a) => a.metric_name === "orders")?.metric_value ||
              0,
            change:
              analytics.find((a) => a.metric_name === "orders")
                ?.metric_change || 0,
            increased:
              analytics.find((a) => a.metric_name === "orders")
                ?.metric_increased || false,
          },
          approved: {
            value:
              analytics.find((a) => a.metric_name === "approved")
                ?.metric_value || 0,
            change:
              analytics.find((a) => a.metric_name === "approved")
                ?.metric_change || 0,
            increased:
              analytics.find((a) => a.metric_name === "approved")
                ?.metric_increased || false,
          },
          users: {
            value:
              analytics.find((a) => a.metric_name === "users")?.metric_value ||
              0,
            label:
              analytics.find((a) => a.metric_name === "users")?.metric_label ||
              "since last month",
          },
          subscriptions: {
            value:
              analytics.find((a) => a.metric_name === "subscriptions")
                ?.metric_value || 0,
            label:
              analytics.find((a) => a.metric_name === "subscriptions")
                ?.metric_label || "since last month",
          },
          monthTotal: {
            value:
              analytics.find((a) => a.metric_name === "month_total")
                ?.metric_value || 0,
            change:
              analytics.find((a) => a.metric_name === "month_total")
                ?.metric_change || 0,
            increased:
              analytics.find((a) => a.metric_name === "month_total")
                ?.metric_increased || false,
          },
          revenue: {
            value:
              analytics.find((a) => a.metric_name === "revenue")
                ?.metric_value || 0,
            change:
              analytics.find((a) => a.metric_name === "revenue")
                ?.metric_change || 0,
            increased:
              analytics.find((a) => a.metric_name === "revenue")
                ?.metric_increased || false,
          },
          paidInvoices: {
            value:
              analytics.find((a) => a.metric_name === "paid_invoices")
                ?.metric_value || 0,
            label:
              analytics.find((a) => a.metric_name === "paid_invoices")
                ?.metric_label || "Current Fiscal Year",
          },
          fundsReceived: {
            value:
              analytics.find((a) => a.metric_name === "funds_received")
                ?.metric_value || 0,
            label:
              analytics.find((a) => a.metric_name === "funds_received")
                ?.metric_label || "Current Fiscal Year",
          },
        };
        setAnalyticsData(processedAnalytics);
      } else {
        setError("No analytics data available");
      }

      // Fetch chart data with date range
      const [salesData, activityData] = await Promise.all([
        fetchChartData("sales", parseInt(selectedYear), dateRange),
        fetchChartData("activity", parseInt(selectedYear), dateRange),
      ]);

      setChartData({
        sales: salesData || [],
        activity: activityData || [],
      });

      // Fetch callcentre tickets for customer orders display
      const tickets = await fetchTickets();
      if (tickets && tickets.length > 0) {
        // Only show tickets that are assigned to callcentre staff or recently resolved
        const callcentreRelevantTickets = tickets
          .filter((ticket: any) => {
            const isAssignedToCallcentre =
              ticket.assigned_to &&
              (ticket.assigned_to as any)?.role === "callcentre";
            const isRecentlyResolved =
              ticket.status === "resolved" &&
              new Date(ticket.updated_at || ticket.created_at) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
            return isAssignedToCallcentre || isRecentlyResolved;
          })
          .slice(0, 4)
          .map((ticket: any) => ({
            id: ticket.id,
            customer: ticket.customer_name,
            address: ticket.application_name,
            date: new Date(ticket.created_at).toLocaleDateString("en-GB"),
            status:
              ticket.status === "resolved"
                ? "Resolved"
                : ticket.status === "in_progress"
                  ? "In Progress"
                  : ticket.status === "assigned"
                    ? "Assigned"
                    : ticket.status === "cancelled"
                      ? "Cancelled"
                      : "Open",
            amount:
              ticket.status === "resolved"
                ? Math.floor(Math.random() * 200) + 100
                : 0, // Resolution value
          }));
        setCustomerOrders(callcentreRelevantTickets);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  if (loading) {
    return (
      <div
        className={`bg-${theme === "dark" ? "gray-900" : "white"} text-${theme === "dark" ? "white" : "gray-900"} p-6 rounded-lg`}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCwIcon className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-${theme === "dark" ? "gray-900" : "white"} text-${theme === "dark" ? "white" : "gray-900"} p-6 rounded-lg`}
      >
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            {error}
            <button
              onClick={loadDashboardData}
              className="ml-2 underline hover:no-underline"
            >
              Try again
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div
        className={`bg-${theme === "dark" ? "gray-900" : "white"} text-${theme === "dark" ? "white" : "gray-900"} p-6 rounded-lg`}
      >
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No data available. Please check back later or contact your
            administrator.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div
      className={`bg-${theme === "dark" ? "gray-900" : "white"} text-${theme === "dark" ? "white" : "gray-900"} p-6 rounded-lg`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd.MM.yyyy")} -{" "}
                      {format(dateRange.to, "dd.MM.yyyy")}
                    </>
                  ) : (
                    format(dateRange.from, "dd.MM.yyyy")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            className="flex items-center gap-2"
          >
            <RefreshCwIcon className="h-4 w-4" />
            Refresh
          </Button>
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${theme === "dark" ? "bg-white" : "bg-blue-500"}`}
            ></div>
            <SearchIcon className="h-5 w-5" />
          </div>
          <Avatar>
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
              alt="User"
            />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Orders Card */}
        <Card
          className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-3xl font-bold">
                  {analyticsData.orders.value}
                </div>
                <div className="flex items-center text-xs mt-1">
                  <span
                    className={`flex items-center ${analyticsData.orders.increased ? "text-green-500" : "text-red-500"}`}
                  >
                    {analyticsData.orders.increased ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                    )}
                    {analyticsData.orders.change}%
                  </span>
                  <span className="text-gray-500 ml-1">since last month</span>
                </div>
              </div>
              <div className="border rounded p-1">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approved Card */}
        <Card
          className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-3xl font-bold">
                  {analyticsData.approved.value}
                </div>
                <div className="flex items-center text-xs mt-1">
                  <span
                    className={`flex items-center ${analyticsData.approved.increased ? "text-green-500" : "text-red-500"}`}
                  >
                    {analyticsData.approved.increased ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                    )}
                    {analyticsData.approved.change}%
                  </span>
                  <span className="text-gray-500 ml-1">since last month</span>
                </div>
              </div>
              <div className="border rounded p-1">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Card */}
        <Card
          className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Call Centre Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-3xl font-bold">
                  {analyticsData.users.value}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {analyticsData.users.label}
                </div>
              </div>
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-8 border-yellow-400 border-r-transparent transform rotate-45"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscriptions Card */}
        <Card
          className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Assigned Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-3xl font-bold">
                  {analyticsData.subscriptions.value}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {analyticsData.subscriptions.label}
                </div>
              </div>
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-8 border-blue-400 border-r-transparent transform rotate-45"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Month Total Card */}
        <Card
          className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              This Month's Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-3xl font-bold">
                  {analyticsData.monthTotal.value}
                </div>
                <div className="flex items-center text-xs mt-1">
                  <span
                    className={`flex items-center ${analyticsData.monthTotal.increased ? "text-green-500" : "text-red-500"}`}
                  >
                    {analyticsData.monthTotal.increased ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                    )}
                    {analyticsData.monthTotal.change}%
                  </span>
                  <span className="text-gray-500 ml-1">since last month</span>
                </div>
              </div>
              <div className="text-2xl font-bold">$</div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Card */}
        <Card
          className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Resolution Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-3xl font-bold">
                  {analyticsData.revenue.value}
                </div>
                <div className="flex items-center text-xs mt-1">
                  <span
                    className={`flex items-center ${analyticsData.revenue.increased ? "text-green-500" : "text-red-500"}`}
                  >
                    {analyticsData.revenue.increased ? (
                      <ArrowUpIcon className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-3 w-3 mr-1" />
                    )}
                    {analyticsData.revenue.change}%
                  </span>
                  <span className="text-gray-500 ml-1">since last month</span>
                </div>
              </div>
              <div className="border rounded p-1">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="6"
                    width="18"
                    height="3"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="3"
                    y="12"
                    width="18"
                    height="3"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <rect
                    x="3"
                    y="18"
                    width="18"
                    height="3"
                    rx="1"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Sales Dynamics Chart */}
        <Card
          className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Ticket Resolution Trends
            </CardTitle>
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">{selectedYear}</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 9L10 5H2L6 9Z" fill="currentColor" />
                </svg>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[200px] w-full">
              {chartData.sales.length > 0 ? (
                <div className="flex h-full items-end justify-between">
                  {chartData.sales.map((data: any) => (
                    <div
                      key={data.month}
                      className="flex flex-col items-center"
                    >
                      <div
                        className={`w-6 ${theme === "dark" ? "bg-green-500" : "bg-green-500"}`}
                        style={{
                          height: `${Math.max((data.value / Math.max(...chartData.sales.map((d: any) => d.value))) * 150 + 20, 20)}px`,
                        }}
                      ></div>
                      <div className="text-xs mt-2">{data.month}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    No resolution data available
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Activity Chart */}
        <Card
          className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Call Centre Ticket Activity
            </CardTitle>
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">{selectedYear}</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 9L10 5H2L6 9Z" fill="currentColor" />
                </svg>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[200px] w-full relative">
              {chartData.activity.length > 0 ? (
                <svg
                  className="w-full h-full"
                  viewBox="0 0 600 200"
                  preserveAspectRatio="none"
                >
                  <path
                    d={chartData.activity
                      .map((data: any, index: number) => {
                        const x =
                          (index / (chartData.activity.length - 1)) * 600;
                        const y =
                          200 -
                          ((data.value /
                            Math.max(
                              ...chartData.activity.map((d: any) => d.value),
                            )) *
                            150 +
                            25);
                        return `${index === 0 ? "M" : "L"}${x},${y}`;
                      })
                      .join(" ")}
                    stroke={theme === "dark" ? "#d946ef" : "#d946ef"}
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    No call centre activity data available
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Paid Invoices Card */}
        <Card
          className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="p-2 border rounded-md">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M7 12H17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 8H17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M7 16H13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600">
                <span className="text-xs font-bold">+15%</span>
              </div>
            </div>
            <h3 className="text-sm font-medium mb-2">Total Resolution Value</h3>
            <div className="text-2xl font-bold mb-1">
              $
              {analyticsData.paidInvoices.value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <div className="text-xs text-gray-500">
              {analyticsData.paidInvoices.label}
            </div>
          </CardContent>
        </Card>

        {/* Funds Received Card */}
        <Card
          className={`${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white"}`}
        >
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="p-2 border rounded-md">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M7 15H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
                <span className="text-xs font-bold">+8%</span>
              </div>
            </div>
            <h3 className="text-sm font-medium mb-2">Total Ticket Value</h3>
            <div className="text-2xl font-bold mb-1">
              $
              {analyticsData.fundsReceived.value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </div>
            <div className="text-xs text-gray-500">
              {analyticsData.fundsReceived.label}
            </div>
          </CardContent>
        </Card>

        {/* Customer Order Card */}
        <Card
          className={`${theme === "dark" ? "bg-gray-800 border-gray-700 col-span-1 lg:col-span-1" : "bg-white col-span-1 lg:col-span-1"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Call Centre Activity
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <RefreshCwIcon className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Customer</TableHead>
                  <TableHead>Application</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerOrders.length > 0 ? (
                  customerOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.customer}
                      </TableCell>
                      <TableCell>{order.address}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`
                            ${order.status === "Resolved" ? "bg-green-100 text-green-800 border-green-200" : ""}
                            ${order.status === "In Progress" ? "bg-blue-100 text-blue-800 border-blue-200" : ""}
                            ${order.status === "Assigned" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : ""}
                            ${order.status === "Cancelled" ? "bg-red-100 text-red-800 border-red-200" : ""}
                            ${order.status === "Open" ? "bg-gray-100 text-gray-800 border-gray-200" : ""}
                          `}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {order.amount > 0 ? `${order.amount}` : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground">
                        No call centre activity available
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
