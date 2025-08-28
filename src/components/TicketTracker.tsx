import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";

// Supabase Environment Variables Required:
// VITE_SUPABASE_URL=https://your-project-id.supabase.co
// VITE_SUPABASE_ANON_KEY=your-anon-key-here
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Ticket, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const searchSchema = z.object({
  ticketNumber: z.string().min(1, { message: "Please enter a ticket number" }),
});

type SearchFormValues = z.infer<typeof searchSchema>;

interface TicketData {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  status: string;
  severity: string;
  customer_name: string;
  customer_email: string;
  application_name: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

const TicketTracker = () => {
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      ticketNumber: "",
    },
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "in_progress":
      case "assigned":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "resolved":
      case "closed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
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
      case "in_progress":
      case "assigned":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Ticket className="h-4 w-4" />;
    }
  };

  const onSubmit = async (data: SearchFormValues) => {
    setLoading(true);
    setError(null);
    setTicket(null);
    setSearched(true);

    try {
      const { data: ticketData, error: ticketError } = await supabase
        .from("tickets")
        .select("*")
        .eq("ticket_number", data.ticketNumber.toUpperCase())
        .single();

      if (ticketError) {
        if (ticketError.code === "PGRST116") {
          setError(
            "Ticket not found. Please check your ticket number and try again.",
          );
        } else {
          setError(
            "An error occurred while searching for your ticket. Please try again.",
          );
        }
        return;
      }

      setTicket(ticketData);
    } catch (err) {
      console.error("Error searching for ticket:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Track Your Ticket</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                Back to Home
              </Button>
            </Link>
            <Link to="/admin/login">
              <Button variant="ghost" size="sm">
                Admin Login
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Search for Your Ticket</CardTitle>
              <CardDescription>
                Enter your ticket number to view the current status and details
                of your bug report.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="ticketNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ticket Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., TCK01012024-1234"
                            {...field}
                            className="uppercase"
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Searching..." : "Search Ticket"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {error && (
            <Alert className="mt-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-800">Error</AlertTitle>
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {searched && !ticket && !error && !loading && (
            <Alert className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No Results</AlertTitle>
              <AlertDescription>
                No ticket found with the provided number. Please check your
                ticket number and try again.
              </AlertDescription>
            </Alert>
          )}

          {ticket && (
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(ticket.status)}
                    Ticket Detailssss
                  </CardTitle>
                  <Badge
                    className={getStatusColor(ticket.status)}
                    variant="outline"
                  >
                    {ticket.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
                <CardDescription>
                  Ticket #{ticket.ticket_number}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">
                      Title
                    </h3>
                    <p className="font-medium">{ticket.title}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">
                      Application
                    </h3>
                    <p>{ticket.application_name}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">
                      Severity
                    </h3>
                    <Badge
                      className={getSeverityColor(ticket.severity)}
                      variant="outline"
                    >
                      {ticket.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">
                      Submitted
                    </h3>
                    <p className="text-sm">{formatDate(ticket.created_at)}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">
                    Description
                  </h3>
                  <p className="text-sm leading-relaxed">
                    {ticket.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">
                    Contact Information
                  </h3>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {ticket.customer_name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {ticket.customer_email}
                    </p>
                  </div>
                </div>

                {ticket.resolved_at && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-1">
                      Resolved
                    </h3>
                    <p className="text-sm">{formatDate(ticket.resolved_at)}</p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground">
                  Last updated:{" "}
                  {formatDate(ticket.updated_at || ticket.created_at)}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default TicketTracker;
