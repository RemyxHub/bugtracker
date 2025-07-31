import React from "react";
import { Link } from "react-router-dom";
import BugReportForm from "./BugReportForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, TicketCheck } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TicketCheck className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Bug Report Portal</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link to="/track-ticket">
              <Button variant="outline" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Track Your Ticket
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Submit a Bug Report</CardTitle>
                <CardDescription>
                  Please provide detailed information about the issue you've
                  encountered. You'll receive a ticket number for tracking your
                  report.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BugReportForm />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary rounded-full p-2 flex-shrink-0">
                    <span className="font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Submit Your Report</h3>
                    <p className="text-sm text-muted-foreground">
                      Fill out the form with all relevant details about the
                      issue.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary rounded-full p-2 flex-shrink-0">
                    <span className="font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Get a Ticket Number</h3>
                    <p className="text-sm text-muted-foreground">
                      You'll receive a unique ticket number to track your
                      report.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary rounded-full p-2 flex-shrink-0">
                    <span className="font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Track Your Report</h3>
                    <p className="text-sm text-muted-foreground">
                      Use your ticket number to check the status of your report
                      anytime.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If you need assistance with submitting a bug report or have
                  questions about the process, our support team is here to help.
                </p>
                <Button className="w-full" variant="outline">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t bg-muted/40 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Bug Report Portal. All rights
              reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
              <Link
                to="/faq"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
