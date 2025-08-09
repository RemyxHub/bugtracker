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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RefreshCw,
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Image,
  Video,
  Download,
  Eye,
} from "lucide-react";
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
  image_urls: string[] | null;
  video_urls: string[] | null;
}

interface TicketNote {
  id: string;
  note: string;
  created_at: string;
  user_id: string;
  users?: {
    name: string;
    email: string;
  };
}

interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
}

const ViewTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketNotes, setTicketNotes] = useState<TicketNote[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [noteText, setNoteText] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

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

  // Fetch staff members
  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, role")
        .eq("status", "active")
        .in("role", ["admin", "staff"])
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

  useEffect(() => {
    fetchTickets();
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

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
      case "closed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "in_progress":
      case "assigned":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
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

      Swal.fire({
        title: "Success!",
        text: "Ticket assigned successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      await fetchTickets();
      setSelectedStaff("");
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

      Swal.fire({
        title: "Success!",
        text: `Ticket status updated to ${selectedStatus.replace("_", " ")} successfully!`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      await fetchTickets();
      setSelectedStatus("");
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

      // Update ticket's updated_at timestamp
      await supabase
        .from("tickets")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", selectedTicket.id);

      Swal.fire({
        title: "Success!",
        text: "Note added successfully!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      await fetchTickets();
      await fetchTicketNotes(selectedTicket.id);
      setNoteText("");
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

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    fetchTicketNotes(ticket.id);
  };

  return (
    <div className="w-full space-y-6 bg-background">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>View All Tickets</CardTitle>
            <CardDescription>
              Comprehensive view of all tickets with detailed information and
              management actions
            </CardDescription>
          </div>
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
      </Card>

      {/* Tickets Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading tickets...</span>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{ticket.title}</CardTitle>
                    <CardDescription className="font-mono text-sm">
                      {ticket.ticket_number}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(ticket.status)}
                    <Badge
                      className={getStatusColor(ticket.status)}
                      variant="outline"
                    >
                      {ticket.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{ticket.customer_name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{ticket.customer_email}</span>
                  </div>
                  {ticket.customer_phone && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{ticket.customer_phone}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Ticket Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Application:</span>
                    <span className="font-medium">
                      {ticket.application_name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Severity:</span>
                    <Badge
                      className={getSeverityColor(ticket.severity)}
                      variant="outline"
                    >
                      {ticket.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Created:</span>
                    <span>
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {ticket.assigned_to && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Assigned to:
                      </span>
                      <span className="font-medium">
                        {(ticket.assigned_to as any)?.name || "Unknown"}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Description Preview */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Description:</Label>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {ticket.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-2">
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
                                  <span>{selectedTicket.customer_name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Mail className="h-4 w-4" />
                                  <span>{selectedTicket.customer_email}</span>
                                </div>
                                {selectedTicket.customer_phone && (
                                  <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4" />
                                    <span>{selectedTicket.customer_phone}</span>
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
                                  Application: {selectedTicket.application_name}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span>Severity:</span>
                                  <Badge
                                    className={getSeverityColor(
                                      selectedTicket.severity,
                                    )}
                                    variant="outline"
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

                          {/* Attachments Section */}
                          {(selectedTicket.image_urls &&
                            selectedTicket.image_urls.length > 0) ||
                          (selectedTicket.video_urls &&
                            selectedTicket.video_urls.length > 0) ? (
                            <div className="space-y-4">
                              <Label className="font-semibold">
                                Attachments
                              </Label>

                              {/* Images */}
                              {selectedTicket.image_urls &&
                                selectedTicket.image_urls.length > 0 && (
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Image className="h-4 w-4" />
                                      <span className="text-sm font-medium">
                                        Images (
                                        {selectedTicket.image_urls.length})
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                      {selectedTicket.image_urls.map(
                                        (imageUrl, index) => (
                                          <div
                                            key={index}
                                            className="relative group"
                                          >
                                            <img
                                              src={imageUrl}
                                              alt={`Attachment ${index + 1}`}
                                              className="w-full h-24 object-cover rounded-md border cursor-pointer hover:opacity-80 transition-opacity"
                                              onClick={() =>
                                                setSelectedImage(imageUrl)
                                              }
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-md flex items-center justify-center">
                                              <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}

                              {/* Videos */}
                              {selectedTicket.video_urls &&
                                selectedTicket.video_urls.length > 0 && (
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Video className="h-4 w-4" />
                                      <span className="text-sm font-medium">
                                        Videos (
                                        {selectedTicket.video_urls.length})
                                      </span>
                                    </div>
                                    <div className="space-y-2">
                                      {selectedTicket.video_urls.map(
                                        (videoUrl, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between bg-muted p-3 rounded-md"
                                          >
                                            <div className="flex items-center space-x-2">
                                              <Video className="h-4 w-4 text-muted-foreground" />
                                              <span className="text-sm">
                                                Video {index + 1}
                                              </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                  setSelectedVideo(videoUrl)
                                                }
                                              >
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                              </Button>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                  window.open(
                                                    videoUrl,
                                                    "_blank",
                                                  )
                                                }
                                              >
                                                <Download className="h-4 w-4 mr-1" />
                                                Download
                                              </Button>
                                            </div>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}
                            </div>
                          ) : null}

                          {(selectedTicket.image_urls &&
                            selectedTicket.image_urls.length > 0) ||
                          (selectedTicket.video_urls &&
                            selectedTicket.video_urls.length > 0) ? (
                            <Separator />
                          ) : null}

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
                                <Dialog 
                                  open={dialogStates.note} 
                                  onOpenChange={(open) => setDialogStates(prev => ({ ...prev, note: open }))}
                                >
                                <div className="space-y-3">
                                  {ticketNotes.map((note) => (
                                    <div
                                      key={note.id}
                                      onClick={() => {
                                        setSelectedTicket(ticket);
                                        setDialogStates(prev => ({ ...prev, note: true }));
                                      }}
                                    >
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">
                                          {note.users?.name || "Unknown User"}
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

                  {/* Assign Ticket */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        Assign
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Assign Ticket</DialogTitle>
                        <DialogDescription>
                          Assign ticket {selectedTicket?.ticket_number} to a
                          staff member.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Select
                          value={selectedStaff}
                          onValueChange={setSelectedStaff}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select staff member" />
                          </SelectTrigger>
                          <SelectContent>
                            {staff.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                      {member.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">
                                      {member.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {member.role}
                                    </div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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

                  {/* Update Status */}
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
                        <DialogTitle>Update Ticket Status</DialogTitle>
                        <DialogDescription>
                          Update the status of ticket{" "}
                          {selectedTicket?.ticket_number}.
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
                            <SelectItem value="assigned">Assigned</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
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

                  {/* Add Note */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        Add Note
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Note to Ticket</DialogTitle>
                        <DialogDescription>
                          Add a note to ticket {selectedTicket?.ticket_number}.
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredTickets.length === 0 && !loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
            <p className="text-muted-foreground text-center">
              {searchQuery
                ? "No tickets match your search criteria."
                : "No tickets have been submitted yet."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>Image Attachment</DialogTitle>
            </DialogHeader>
            <div className="p-6 pt-0">
              <img
                src={selectedImage}
                alt="Full size attachment"
                className="w-full h-auto max-h-[70vh] object-contain rounded-md"
              />
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => window.open(selectedImage, "_blank")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <Dialog
          open={!!selectedVideo}
          onOpenChange={() => setSelectedVideo(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>Video Attachment</DialogTitle>
            </DialogHeader>
            <div className="p-6 pt-0">
              <video
                src={selectedVideo}
                controls
                className="w-full h-auto max-h-[70vh] rounded-md"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => window.open(selectedVideo, "_blank")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ViewTickets;
