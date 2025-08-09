import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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
  RefreshCw,
} from "lucide-react";
import { supabase, updateTicket, addTicketNote } from "@/lib/supabase";

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
  const [assignedTickets, setAssignedTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState({
    details: false,
    response: false,
    status: false,
  });
  const employeeId = localStorage.getItem("employeeId") || "CC001";

  // Fetch assigned tickets from database
  const fetchAssignedTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tickets")
        .select(
          `
          *,
          assigned_to:users(name, email)
        `,
        )
        .not("assigned_to", "is", null)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tickets:", error);
        return;
      }

      // Filter tickets assigned to call centre staff
      const callCentreTickets =
        data?.filter((ticket) => {
          const assignedUser = ticket.assigned_to as any;
          return (
            assignedUser &&
            (assignedUser.email?.includes("callcentre") ||
              assignedUser.name?.includes("Smith") ||
              assignedUser.name?.includes("Johnson"))
          );
        }) || [];

      setAssignedTickets(callCentreTickets);
    } catch (err) {
      console.error("Unexpected error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication and fetch data
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userRole = localStorage.getItem("userRole");

    if (!isAuthenticated || userRole !== "callcentre") {
      navigate("/callcentre/login");
    } else {
      fetchAssignedTickets();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("employeeId");
    navigate("/");
  };

  const [activeSection, setActiveSection] = useState("dashboard");

  const getPriorityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "open":
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "in_progress":
      case "assigned":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleAddResponse = async () => {
    if (!selectedTicket || !response.trim()) return;

    try {
      setIsUpdating(true);
      const result = await addTicketNote(selectedTicket.id, response.trim());

      if (result.success) {
        Swal.fire({
          title: "Success!",
          text: "Response added successfully!",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        setResponse("");
        setDialogOpen((prev) => ({ ...prev, response: false }));
        await fetchAssignedTickets(); // Refresh tickets
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to add response. Please try again.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error adding response:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred. Please try again.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedTicket || !newStatus) return;

    try {
      setIsUpdating(true);
      const updateData: any = {
        status: newStatus,
      };

      if (newStatus === "resolved" || newStatus === "closed") {
        updateData.resolved_at = new Date().toISOString();
      }

      const result = await updateTicket(selectedTicket.id, updateData);

      if (result.success) {
        Swal.fire({
          title: "Success!",
          text: `Ticket status updated to ${newStatus.replace("_", " ")} successfully!`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        setNewStatus("");
        setDialogOpen((prev) => ({ ...prev, status: false }));
        await fetchAssignedTickets(); // Refresh tickets
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to update ticket status. Please try again.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred. Please try again.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setIsUpdating(false);
    }
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
                            {loading ? (
                              <RefreshCw className="h-6 w-6 animate-spin" />
                            ) : (
                              assignedTickets.length
                            )}
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
                            {loading ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              assignedTickets.filter(
                                (t) =>
                                  t.status === "in_progress" ||
                                  t.status === "In Progress",
                              ).length
                            )}
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
                            {loading ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              assignedTickets.filter(
                                (t) =>
                                  t.severity === "high" ||
                                  t.severity === "critical",
                              ).length
                            )}
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
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>My Assigned Tickets</CardTitle>
                    <CardDescription>
                      Tickets assigned to you for resolution
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={fetchAssignedTickets}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading tickets...</span>
                    </div>
                  ) : (
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
                              {ticket.ticket_number}
                            </TableCell>
                            <TableCell className="font-medium">
                              {ticket.title}
                            </TableCell>
                            <TableCell>{ticket.customer_name}</TableCell>
                            <TableCell>
                              <Badge
                                className={getPriorityColor(ticket.severity)}
                                variant="outline"
                              >
                                {ticket.severity.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getStatusColor(ticket.status)}
                                variant="outline"
                              >
                                {ticket.status.replace("_", " ").toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(ticket.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Dialog
                                  open={dialogOpen.details}
                                  onOpenChange={(open) =>
                                    setDialogOpen((prev) => ({
                                      ...prev,
                                      details: open,
                                    }))
                                  }
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedTicket(ticket);
                                        setDialogOpen((prev) => ({
                                          ...prev,
                                          details: true,
                                        }));
                                      }}
                                    >
                                      View Details
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle>Ticket Details</DialogTitle>
                                      <DialogDescription>
                                        {selectedTicket?.ticket_number} -{" "}
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
                                            {selectedTicket?.customer_name}
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            {selectedTicket?.customer_email}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">
                                            Severity:
                                          </p>
                                          <Badge
                                            className={getPriorityColor(
                                              selectedTicket?.severity || "",
                                            )}
                                            variant="outline"
                                          >
                                            {selectedTicket?.severity.toUpperCase()}
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
                                      <div>
                                        <p className="text-sm font-medium mb-2">
                                          Steps to Reproduce:
                                        </p>
                                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md whitespace-pre-wrap">
                                          {selectedTicket?.steps_to_reproduce}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Attachments Section */}
                                    {(selectedTicket?.image_urls?.length > 0 || selectedTicket?.video_urls?.length > 0) && (
                                      <>
                                        <div className="border-t pt-4">
                                          <p className="text-sm font-medium mb-3">Attachments</p>
                                          
                                          {/* Images */}
                                          {selectedTicket?.image_urls && selectedTicket.image_urls.length > 0 && (
                                            <div className="mb-4">
                                              <div className="flex items-center space-x-2 mb-2">
                                                <span className="text-sm font-medium">Images ({selectedTicket.image_urls.length})</span>
                                              </div>
                                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {selectedTicket.image_urls.map((imageUrl, index) => (
                                                  <div key={index} className="relative group">
                                                    <img
                                                      src={imageUrl}
                                                      alt={`Attachment ${index + 1}`}
                                                      className="w-full h-24 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
                                                      onClick={() => window.open(imageUrl, '_blank')}
                                                    />
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}

                                          {/* Videos */}
                                          {selectedTicket?.video_urls && selectedTicket.video_urls.length > 0 && (
                                            <div>
                                              <div className="flex items-center space-x-2 mb-2">
                                                <span className="text-sm font-medium">Videos ({selectedTicket.video_urls.length})</span>
                                              </div>
                                              <div className="space-y-2">
                                                {selectedTicket.video_urls.map((videoUrl, index) => (
                                                  <div key={index} className="flex items-center justify-between bg-muted p-3 rounded-md">
                                                    <div className="flex items-center space-x-2">
                                                      <span className="text-sm">Video {index + 1}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                      <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.open(videoUrl, '_blank')}
                                                      >
                                                        View
                                                      </Button>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </>
                                    )}
                                  </DialogContent>
                                </Dialog>

                                <Dialog
                                  open={dialogOpen.response}
                                  onOpenChange={(open) =>
                                    setDialogOpen((prev) => ({
                                      ...prev,
                                      response: open,
                                    }))
                                  }
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedTicket(ticket);
                                        setDialogOpen((prev) => ({
                                          ...prev,
                                          response: true,
                                        }));
                                      }}
                                    >
                                      Add Response
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Add Response</DialogTitle>
                                      <DialogDescription>
                                        Add a response to ticket{" "}
                                        {selectedTicket?.ticket_number}
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
                                      <Button
                                        onClick={handleAddResponse}
                                        disabled={
                                          isUpdating || !response.trim()
                                        }
                                      >
                                        {isUpdating ? (
                                          <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Sending...
                                          </>
                                        ) : (
                                          "Send Response"
                                        )}
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>

                                <Dialog
                                  open={dialogOpen.status}
                                  onOpenChange={(open) =>
                                    setDialogOpen((prev) => ({
                                      ...prev,
                                      status: open,
                                    }))
                                  }
                                >
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedTicket(ticket);
                                        setDialogOpen((prev) => ({
                                          ...prev,
                                          status: true,
                                        }));
                                      }}
                                    >
                                      Update Status
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Update Status</DialogTitle>
                                      <DialogDescription>
                                        Update the status of ticket{" "}
                                        {selectedTicket?.ticket_number}
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
                                          <SelectItem value="in_progress">
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
                                      <Button
                                        onClick={handleUpdateStatus}
                                        disabled={isUpdating || !newStatus}
                                      >
                                        {isUpdating ? (
                                          <>
                                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                            Updating...
                                          </>
                                        ) : (
                                          "Update Status"
                                        )}
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
                  )}
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
