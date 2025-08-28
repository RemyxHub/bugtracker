import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";

// Supabase Environment Variables Required:
// VITE_SUPABASE_URL=https://your-project-id.supabase.co
// VITE_SUPABASE_ANON_KEY=your-anon-key-here
// SUPABASE_PROJECT_ID=your-project-id
// SUPABASE_URL=https://your-project-id.supabase.co
// SUPABASE_ANON_KEY=your-anon-key-here
// SUPABASE_SERVICE_KEY=your-service-role-key-here
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import {
  MoreHorizontal,
  RefreshCw,
  Search,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Ticket {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  steps_to_reproduce: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  application_name: string;
  created_at: string;
  updated_at: string | null;
  resolved_at: string | null;
  status: string;
  severity: string;
  assigned_to: string | null;
}

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
}

const TicketManagement = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [noteText, setNoteText] = useState("");
  const [ticketNotes, setTicketNotes] = useState<any[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [dialogStates, setDialogStates] = useState({
    status: false,
    assign: false,
    note: false,
  });

  // Fetch tickets from database
  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from("tickets")
        .select(
          `
          *,
          assigned_to:users(name, email)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tickets:", error);
        return;
      }

      setTickets(data || []);
    } catch (err) {
      console.error("Unexpected error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch staff members from database
  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, role")
        .eq("status", "active")
        .in("role", ["admin", "callcentre"])
        .order("name");

      if (error) {
        console.error("Error fetching staff:", error);
        return;
      }

      setStaff(data || []);
    } catch (err) {
      console.error("Unexpected error fetching staff:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchStaff();
    fetchStaff();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
      case "closed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "in_progress":
      case "assigned":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "open":
      case "new":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const handleAssignTicket = async () => {
    if (!selectedTicket || !selectedStaff) return;

    try {
      const { data, error } = await supabase
        .from("tickets")
        .update({
          assigned_to: selectedStaff,
          status: "assigned",
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedTicket.id)
        .select();

      if (error) {
        console.error("Error assigning ticket:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to assign ticket. Please try again.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }

      console.log("Ticket assigned successfully:", data);
      Swal.fire({
        title: "Success!",
        text: "Ticket assigned successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      // Refresh tickets
      await fetchTickets();
      setSelectedStaff("");
      setDialogStates(prev => ({ ...prev, assign: false }));
    } catch (err) {
      console.error("Unexpected error assigning ticket:", err);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred. Please try again.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedTicket || !selectedStatus) return;

    try {
      const updateData: any = {
        status: selectedStatus,
        updated_at: new Date().toISOString(),
      };

      if (selectedStatus === "resolved" || selectedStatus === "closed") {
        updateData.resolved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("tickets")
        .update(updateData)
        .eq("id", selectedTicket.id)
        .select();

      if (error) {
        console.error("Error updating ticket status:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update ticket status. Please try again.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }

      console.log("Ticket status updated successfully:", data);
      Swal.fire({
        title: "Success!",
        text: `Ticket status updated to ${selectedStatus.replace("_", " ")} successfully!`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      // Refresh tickets
      await fetchTickets();
      setSelectedStatus("");
      setDialogStates(prev => ({ ...prev, status: false }));
    } catch (err) {
      console.error("Unexpected error updating ticket status:", err);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred. Please try again.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // Fetch ticket notes
  const fetchTicketNotes = async (ticketId: string) => {
    setLoadingNotes(true);
    try {
      const { data, error } = await supabase
        .from("ticket_notes")
        .select(
          `
          *,
          users(name, email)
        `,
        )
        .eq("ticket_id", ticketId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching ticket notes:", error);
        return;
      }

      setTicketNotes(data || []);
    } catch (err) {
      console.error("Unexpected error fetching ticket notes:", err);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    fetchTicketNotes(ticket.id);
  };

  const handleAddNote = async () => {
    if (!selectedTicket || !noteText.trim()) return;

    try {
      // Get a valid admin user ID
      const { data: adminUser, error: adminError } = await supabase
        .from("users")
        .select("id")
        .eq("role", "admin")
        .eq("status", "active")
        .limit(1)
        .single();

      if (adminError || !adminUser) {
        console.error("Error finding admin user:", adminError);
        Swal.fire({
          title: "Error!",
          text: "Failed to find admin user. Please try again.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }

      const { data: noteData, error: noteError } = await supabase
        .from("ticket_notes")
        .insert({
          ticket_id: selectedTicket.id,
          user_id: adminUser.id,
          note: noteText.trim(),
          created_at: new Date().toISOString(),
        })
        .select();

      if (noteError) {
        console.error("Error adding note:", noteError);
        Swal.fire({
          title: "Error!",
          text: "Failed to add note. Please try again.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }

      console.log("Note added successfully:", noteData);

      // Update ticket's updated_at timestamp
      const { data: ticketData, error: ticketError } = await supabase
        .from("tickets")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", selectedTicket.id)
        .select();

      if (ticketError) {
        console.error("Error updating ticket timestamp:", ticketError);
      } else {
        console.log("Ticket timestamp updated:", ticketData);
      }

      Swal.fire({
        title: "Success!",
        text: "Note added successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      // Refresh tickets
      await fetchTickets();
      setNoteText("");
      setDialogStates(prev => ({ ...prev, note: false }));
    } catch (err) {
      console.error("Unexpected error adding note:", err);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred. Please try again.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.ticket_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.application_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Card className="w-full bg-background">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ticket Management</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={fetchTickets}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
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
                <TableHead>Customer</TableHead>
                <TableHead>Application</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {ticket.customer_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{ticket.customer_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {ticket.ticket_number}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {ticket.title}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{ticket.application_name}</TableCell>
                  <TableCell>
                    {new Date(ticket.created_at).toLocaleDateString()}
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
                    <Badge
                      variant="outline"
                      className={
                        ticket.severity === "critical"
                          ? "bg-red-100 text-red-800"
                          : ticket.severity === "high"
                            ? "bg-orange-100 text-orange-800"
                            : ticket.severity === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                      }
                    >
                      {ticket.severity.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTicket(ticket)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              <span>Ticket Details</span>
                              <Badge
                                className={getStatusColor(
                                  selectedTicket?.status || "",
                                )}
                                variant="outline"
                              >
                                {selectedTicket?.status
                                  .replace("_", " ")
                                  .toUpperCase()}
                              </Badge>
                            </DialogTitle>
                            <DialogDescription>
                              {selectedTicket?.ticket_number} -{" "}
                              {selectedTicket?.title}
                            </DialogDescription>
                            <DialogDescription>
                              Assigned to : {(ticket.assigned_to as any)?.name || "Unknown"}
                            </DialogDescription>
                          </DialogHeader>

                          {selectedTicket && (
                            <div className="space-y-6">
                              {/* Customer Information */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="font-semibold">
                                    Customer Information
                                  </Label>
                                  <div className="space-y-1 text-sm">
                                    <div className="flex items-center space-x-2">
                                      <User className="h-4 w-4" />
                                      <span>
                                        {selectedTicket.customer_name}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Mail className="h-4 w-4" />
                                      <span>
                                        {selectedTicket.customer_email}
                                      </span>
                                    </div>
                                    {selectedTicket.customer_phone && (
                                      <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4" />
                                        <span>
                                          {selectedTicket.customer_phone}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="font-semibold">
                                    Ticket Information
                                  </Label>
                                  <div className="space-y-1 text-sm">
                                    <div>
                                      Application:{" "}
                                      {selectedTicket.application_name}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span>Severity:</span>
                                      <Badge
                                        variant="outline"
                                        className={
                                          selectedTicket.severity === "critical"
                                            ? "bg-red-100 text-red-800"
                                            : selectedTicket.severity === "high"
                                              ? "bg-orange-100 text-orange-800"
                                              : selectedTicket.severity ===
                                                  "medium"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-green-100 text-green-800"
                                        }
                                      >
                                        {selectedTicket.severity.toUpperCase()}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="h-4 w-4" />
                                      <span>
                                        Created:{" "}
                                        {new Date(
                                          selectedTicket.created_at,
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                    {selectedTicket.updated_at && (
                                      <div className="flex items-center space-x-2">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                          Updated:{" "}
                                          {new Date(
                                            selectedTicket.updated_at,
                                          ).toLocaleString()}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <Separator />

                              {/* Description and Steps */}
                              <div className="space-y-4">
                                <div>
                                  <Label className="font-semibold">
                                    Description
                                  </Label>
                                  <p className="mt-2 text-sm bg-muted p-3 rounded-md">
                                    {selectedTicket.description}
                                  </p>
                                </div>

                                <div>
                                  <Label className="font-semibold">
                                    Steps to Reproduce
                                  </Label>
                                  <p className="mt-2 text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
                                    {selectedTicket.steps_to_reproduce}
                                  </p>
                                </div>
                              </div>

                              <Separator />

                              {/* Notes Section */}
                              <div className="space-y-4">
                                <Label className="font-semibold">
                                  Notes & Comments
                                </Label>
                                <ScrollArea className="h-48 w-full border rounded-md p-4">
                                  {loadingNotes ? (
                                    <div className="flex items-center justify-center py-4">
                                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                      <span className="text-sm">
                                        Loading notes...
                                      </span>
                                    </div>
                                  ) : ticketNotes.length > 0 ? (
                                    <div className="space-y-3">
                                      {ticketNotes.map((note) => (
                                        <div
                                          key={note.id}
                                          className="border-l-2 border-muted pl-3 py-2"
                                        >
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium">
                                              {note.users?.name ||
                                                "Unknown User"}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                              {new Date(
                                                note.created_at,
                                              ).toLocaleString()}
                                            </span>
                                          </div>
                                          <p className="text-sm text-muted-foreground">
                                            {note.note}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                      No notes available for this ticket.
                                    </p>
                                  )}
                                </ScrollArea>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setDialogStates(prev => ({ ...prev, assign: true }));
                            }}
                          >
                            Assign
                          </Button>
                        </DialogTrigger>
                        <DialogContent 
                          open={dialogStates.assign} 
                          onOpenChange={(open) => setDialogStates(prev => ({ ...prev, assign: open }))}
                        >
                          <DialogHeader>
                            <DialogTitle>Assign Ticket</DialogTitle>
                            <DialogDescription>
                              Assign ticket {selectedTicket?.id} to a staff
                              member.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Select
                                value={selectedStaff}
                                onValueChange={setSelectedStaff}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select staff member" />
                                </SelectTrigger>
                                <SelectContent>
                                  {staff.map((member) => (
                                    <SelectItem
                                      key={member.id}
                                      value={member.id}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                          <AvatarFallback className="text-xs">
                                            {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <div className="font-medium">{member.name}</div>
                                          <div className="text-xs text-muted-foreground">{member.role}</div>
                                        </div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="submit"
                              onClick={handleAssignTicket}
                              disabled={!selectedStaff}
                            >
                              Assign Ticket
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setDialogStates(prev => ({ ...prev, note: true }));
                            }}
                          >
                            Add Note
                          </Button>
                        </DialogTrigger>
                        <DialogContent 
                          open={dialogStates.note} 
                          onOpenChange={(open) => setDialogStates(prev => ({ ...prev, note: open }))}
                        >
                          <DialogHeader>
                            <DialogTitle>Add Note to Ticket</DialogTitle>
                            <DialogDescription>
                              Add a note to ticket {selectedTicket?.id}.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <Textarea
                              placeholder="Enter your note here..."
                              className="min-h-[100px]"
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                            />
                          </div>
                          <DialogFooter>
                            <Button
                              type="submit"
                              onClick={handleAddNote}
                              disabled={!noteText.trim()}
                            >
                              Add Note
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setDialogStates(prev => ({ ...prev, status: true }));
                            }}
                          >
                            Update Status
                          </Button>
                        </DialogTrigger>
                        <DialogContent 
                          open={dialogStates.status} 
                          onOpenChange={(open) => setDialogStates(prev => ({ ...prev, status: open }))}
                        >
                          <DialogHeader>
                            <DialogTitle>Update Ticket Status</DialogTitle>
                            <DialogDescription>
                              Update the status of ticket {selectedTicket?.id}.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <Select
                              value={selectedStatus}
                              onValueChange={setSelectedStatus}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in_progress">
                                  In Progress
                                </SelectItem>
                                <SelectItem value="assigned">
                                  Assigned
                                </SelectItem>
                                <SelectItem value="resolved">
                                  Resolved
                                </SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                                <SelectItem value="cancelled">
                                  Cancelled
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <DialogFooter>
                            <Button
                              type="submit"
                              onClick={handleUpdateStatus}
                              disabled={!selectedStatus}
                            >
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
        )}
      </CardContent>
    </Card>
  );
};

export default TicketManagement;
