import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Headphones,
  LogOut,
  MessageSquare,
  Clock,
  CheckCircle,
} from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  customer: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  assignedDate: string;
  description: string;
}

const CallCentreDashboard = () => {
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [response, setResponse] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const employeeId = localStorage.getItem("employeeId") || "CC001";

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userRole = localStorage.getItem("userRole");

    if (!isAuthenticated || userRole !== "callcentre") {
      navigate("/callcentre/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("employeeId");
    navigate("/");
  };

  const [activeSection, setActiveSection] = useState("dashboard");

  // Mock assigned tickets
  const assignedTickets: Ticket[] = [
    {
      id: "TCK31072024-1001",
      title: "Login page not loading",
      customer: "John Smith",
      priority: "High",
      status: "Open",
      assignedDate: "2024-07-31",
      description:
        "User reports that the login page is not loading properly on Chrome browser. Error message appears after clicking login button.",
    },
    {
      id: "TCK31072024-1002",
      title: "Payment processing error",
      customer: "Sarah Johnson",
      priority: "Critical",
      status: "In Progress",
      assignedDate: "2024-07-31",
      description:
        "Customer unable to complete payment. Transaction fails at the final step with error code 500.",
    },
    {
      id: "TCK30072024-0998",
      title: "Email notifications not working",
      customer: "Mike Davis",
      priority: "Medium",
      status: "Open",
      assignedDate: "2024-07-30",
      description:
        "User not receiving email notifications for account activities and updates.",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleAddResponse = () => {
    // In real app, send response to backend
    console.log("Adding response:", response);
    setResponse("");
    // Close dialog and refresh data
  };

  const handleUpdateStatus = () => {
    // In real app, update status in backend
    console.log("Updating status to:", newStatus);
    setNewStatus("");
    // Close dialog and refresh data
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-full">
              <Headphones className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Call Centre Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Employee ID: {employeeId}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=staff" />
              <AvatarFallback>ST</AvatarFallback>
            </Avatar>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen p-4 bg-white shadow-lg">
          <nav className="space-y-2">
            <div
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-200 ${
                activeSection === "dashboard" ? "bg-gray-100" : ""
              }`}
              onClick={() => setActiveSection("dashboard")}
            >
              <span className="w-5 h-5">📊</span>
              <span>Dashboard</span>
            </div>
            <div
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-200 ${
                activeSection === "tickets" ? "bg-gray-100" : ""
              }`}
              onClick={() => setActiveSection("tickets")}
            >
              <span className="w-5 h-5">🎫</span>
              <span>Tickets</span>
            </div>
            <div
              className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-200"
              onClick={handleLogout}
            >
              <span className="w-5 h-5">🚪</span>
              <span>Sign Out</span>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <main className="container mx-auto px-4 py-8">
            {activeSection === "dashboard" && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Assigned Tickets
                          </p>
                          <p className="text-2xl font-bold">
                            {assignedTickets.length}
                          </p>
                        </div>
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            In Progress
                          </p>
                          <p className="text-2xl font-bold">
                            {
                              assignedTickets.filter(
                                (t) => t.status === "In Progress",
                              ).length
                            }
                          </p>
                        </div>
                        <div className="bg-yellow-100 p-2 rounded-full">
                          <MessageSquare className="h-5 w-5 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Resolved Today
                          </p>
                          <p className="text-2xl font-bold">0</p>
                        </div>
                        <div className="bg-green-100 p-2 rounded-full">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            High Priority
                          </p>
                          <p className="text-2xl font-bold">
                            {
                              assignedTickets.filter(
                                (t) =>
                                  t.priority === "High" ||
                                  t.priority === "Critical",
                              ).length
                            }
                          </p>
                        </div>
                        <div className="bg-red-100 p-2 rounded-full">
                          <span className="text-red-600 font-bold text-sm">
                            !
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {/* Assigned Tickets */}
            {activeSection === "tickets" && (
              <Card>
                <CardHeader>
                  <CardTitle>My Assigned Tickets</CardTitle>
                  <CardDescription>
                    Tickets assigned to you for resolution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticket ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assigned Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignedTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-mono text-sm">
                            {ticket.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            {ticket.title}
                          </TableCell>
                          <TableCell>{ticket.customer}</TableCell>
                          <TableCell>
                            <Badge
                              className={getPriorityColor(ticket.priority)}
                              variant="outline"
                            >
                              {ticket.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusColor(ticket.status)}
                              variant="outline"
                            >
                              {ticket.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{ticket.assignedDate}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedTicket(ticket)}
                                  >
                                    View Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Ticket Details</DialogTitle>
                                    <DialogDescription>
                                      {selectedTicket?.id} -{" "}
                                      {selectedTicket?.title}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm font-medium">
                                          Customer:
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedTicket?.customer}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">
                                          Priority:
                                        </p>
                                        <Badge
                                          className={getPriorityColor(
                                            selectedTicket?.priority || "",
                                          )}
                                          variant="outline"
                                        >
                                          {selectedTicket?.priority}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium mb-2">
                                        Description:
                                      </p>
                                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                        {selectedTicket?.description}
                                      </p>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedTicket(ticket)}
                                  >
                                    Add Response
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Add Response</DialogTitle>
                                    <DialogDescription>
                                      Add a response to ticket{" "}
                                      {selectedTicket?.id}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <Textarea
                                      placeholder="Enter your response to the customer..."
                                      value={response}
                                      onChange={(e) =>
                                        setResponse(e.target.value)
                                      }
                                      className="min-h-[100px]"
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button onClick={handleAddResponse}>
                                      Send Response
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedTicket(ticket)}
                                  >
                                    Update Status
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Update Status</DialogTitle>
                                    <DialogDescription>
                                      Update the status of ticket{" "}
                                      {selectedTicket?.id}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <Select
                                      value={newStatus}
                                      onValueChange={setNewStatus}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select new status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="open">
                                          Open
                                        </SelectItem>
                                        <SelectItem value="in-progress">
                                          In Progress
                                        </SelectItem>
                                        <SelectItem value="resolved">
                                          Resolved
                                        </SelectItem>
                                        <SelectItem value="closed">
                                          Closed
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <DialogFooter>
                                    <Button onClick={handleUpdateStatus}>
                                      Update Status
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CallCentreDashboard;
