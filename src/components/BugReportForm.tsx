import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";

// Supabase Environment Variables Required:
// VITE_SUPABASE_URL=https://your-project-id.supabase.co
// VITE_SUPABASE_ANON_KEY=your-anon-key-here

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  applicationName: z
    .string()
    .min(2, { message: "Application name is required" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  stepsToReproduce: z
    .string()
    .min(10, { message: "Steps to reproduce must be at least 10 characters" }),
  severity: z.string(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  name: z.string().min(2, { message: "Name is required" }),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const BugReportForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      applicationName: "",
      description: "",
      stepsToReproduce: "",
      severity: "medium",
      email: "",
      name: "",
      phone: "",
    },
  });

  const generateTicketNumber = () => {
    const date = new Date();
    const dateStr = format(date, "ddMMyyyy");
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
    return `TCK${dateStr}-${randomNum}`;
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // Generate ticket number
      const newTicketNumber = generateTicketNumber();

      // Insert ticket into database
      const { error } = await supabase.from("tickets").insert({
        ticket_number: newTicketNumber,
        title: data.title,
        application_name: data.applicationName,
        description: data.description,
        steps_to_reproduce: data.stepsToReproduce,
        severity: data.severity,
        customer_name: data.name,
        customer_email: data.email,
        customer_phone: data.phone || null,
        status: "open",
      });

      if (error) {
        console.error("Error submitting ticket:", error);
        // You might want to show an error message to the user here
        return;
      }

      setTicketNumber(newTicketNumber);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Unexpected error:", err);
      // You might want to show an error message to the user here
    }
  };

  const handleReset = () => {
    form.reset();
    setIsSubmitted(false);
    setTicketNumber("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-background">
      {isSubmitted ? (
        <Card>
          <CardHeader>
            <CardTitle>Bug Report Submitted Successfully</CardTitle>
            <CardDescription>Thank you for your submission</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                Your bug report has been submitted successfully. Please save
                your ticket number for future reference.
              </AlertDescription>
            </Alert>

            <div className="mt-6 p-4 border rounded-md bg-muted">
              <p className="text-sm font-medium">Ticket Number:</p>
              <p className="text-xl font-bold">{ticketNumber}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                You can use this ticket number to check the status of your
                report.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleReset}>Submit Another Report</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Submit Bug Report</CardTitle>
            <CardDescription>
              Please fill out the form below to report a bug or issue with our
              application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brief description of the issue"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a concise title for the issue you're
                        experiencing.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="applicationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application/Website Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Name of the application or website"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the name of the application or website where you
                        encountered the issue.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of the issue"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a detailed description of the issue you
                        encountered.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stepsToReproduce"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Steps to Reproduce</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Step-by-step instructions to reproduce the issue"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        List the steps needed to reproduce this issue.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="severity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Severity</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">
                            Low - Minor issue, doesn't affect functionality
                          </SelectItem>
                          <SelectItem value="medium">
                            Medium - Affects functionality but has workaround
                          </SelectItem>
                          <SelectItem value="high">
                            High - Significant impact on functionality
                          </SelectItem>
                          <SelectItem value="critical">
                            Critical - System/application unusable
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the severity level of this issue.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="email@example.com"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Submit Bug Report</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BugReportForm;
