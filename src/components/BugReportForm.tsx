import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { supabase, uploadFile } from "@/lib/supabase";

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
import { CheckCircle, Upload, X, Image, Video } from "lucide-react";

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
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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
      setIsUploading(true);

      // Generate ticket number
      const newTicketNumber = generateTicketNumber();

      // Upload files if any
      const imageUrls: string[] = [];
      const videoUrls: string[] = [];

      // Upload images
      for (const image of selectedImages) {
        const result = await uploadFile(image, "ticket-attachments");
        if (result.success && result.url) {
          imageUrls.push(result.url);
        } else {
          console.error("Failed to upload image:", result.error);
        }
      }

      // Upload videos
      for (const video of selectedVideos) {
        const result = await uploadFile(video, "ticket-attachments");
        if (result.success && result.url) {
          videoUrls.push(result.url);
        } else {
          console.error("Failed to upload video:", result.error);
        }
      }

      // Insert ticket into database
      const ticketData = {
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
        image_urls: imageUrls.length > 0 ? imageUrls : null,
        video_urls: videoUrls.length > 0 ? videoUrls : null,
      };

      const { error } = await supabase.from("tickets").insert(ticketData);

      if (error) {
        console.error("Error submitting ticket:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to submit bug report. Please try again.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }

      setTicketNumber(newTicketNumber);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Unexpected error:", err);
      Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred. Please try again.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setIsSubmitted(false);
    setTicketNumber("");
    setSelectedImages([]);
    setSelectedVideos([]);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validImages = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isValidSize = file.size <= 4 * 1024 * 1024; // 4MB

      if (!isImage) {
        Swal.fire({
          title: "Invalid File!",
          text: `${file.name} is not a valid image file.`,
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
        return false;
      }

      if (!isValidSize) {
        Swal.fire({
          title: "File Too Large!",
          text: `${file.name} exceeds the 4MB limit for images.`,
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
        return false;
      }

      return true;
    });

    setSelectedImages((prev) => [...prev, ...validImages]);
  };

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validVideos = files.filter((file) => {
      const isVideo = file.type.startsWith("video/");
      const isValidSize = file.size <= 25 * 1024 * 1024; // 25MB

      if (!isVideo) {
        Swal.fire({
          title: "Invalid File!",
          text: `${file.name} is not a valid video file.`,
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
        return false;
      }

      if (!isValidSize) {
        Swal.fire({
          title: "File Too Large!",
          text: `${file.name} exceeds the 25MB limit for videos.`,
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
        return false;
      }

      return true;
    });

    setSelectedVideos((prev) => [...prev, ...validVideos]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setSelectedVideos((prev) => prev.filter((_, i) => i !== index));
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

                {/* File Upload Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">
                    Attachments (Optional)
                  </h3>

                  {/* Image Upload */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Images (Max 4MB each)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer block w-full h-full"
                      >
                        <div className="text-center">
                          <Image className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                          <div className="text-sm text-gray-600">
                            <span className="font-medium text-primary hover:text-primary/80">
                              Upload images
                            </span>
                            <span className="pl-1">or drag and drop</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF up to 4MB each
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Selected Images */}
                    {selectedImages.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">
                          Selected Images:
                        </p>
                        <div className="space-y-2">
                          {selectedImages.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-50 p-2 rounded"
                            >
                              <div className="flex items-center">
                                <Image className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Videos (Max 25MB each)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                      <input
                        id="video-upload"
                        type="file"
                        className="hidden"
                        multiple
                        accept="video/*"
                        onChange={handleVideoSelect}
                      />
                      <label
                        htmlFor="video-upload"
                        className="cursor-pointer block w-full h-full"
                      >
                        <div className="text-center">
                          <Video className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                          <div className="text-sm text-gray-600">
                            <span className="font-medium text-primary hover:text-primary/80">
                              Upload videos
                            </span>
                            <span className="pl-1">or drag and drop</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            MP4, MOV, AVI up to 25MB each
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Selected Videos */}
                    {selectedVideos.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">
                          Selected Videos:
                        </p>
                        <div className="space-y-2">
                          {selectedVideos.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-50 p-2 rounded"
                            >
                              <div className="flex items-center">
                                <Video className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeVideo(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

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
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <Upload className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Submit Bug Report"
                    )}
                  </Button>
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
