import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { requestPasswordReset } from "@/lib/supabase";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordPageProps {
  userType?: "admin" | "callcentre";
}

const ForgotPasswordPage = ({
  userType = "admin",
}: ForgotPasswordPageProps) => {
  const { type } = useParams<{ type: string }>();
  const actualUserType = (type as "admin" | "callcentre") || userType;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const result = await requestPasswordReset(data.email);

      if (result.success) {
        setSuccess(true);
      } else {
        setError(
          result.error || "Failed to send reset email. Please try again.",
        );
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getThemeColors = () => {
    return actualUserType === "admin"
      ? {
          gradient: "from-blue-50 to-indigo-100",
          iconBg: "bg-blue-600",
          linkColor: "text-blue-600 hover:text-blue-500",
          backLink: "/admin/login",
        }
      : {
          gradient: "from-green-50 to-emerald-100",
          iconBg: "bg-green-600",
          linkColor: "text-green-600 hover:text-green-500",
          backLink: "/callcentre/login",
        };
  };

  const colors = getThemeColors();

  if (success) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${colors.gradient} flex items-center justify-center p-4`}
      >
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle>Check Your Email</CardTitle>
              <CardDescription>
                We've sent password reset instructions to your email address.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-6">
                If you don't see the email in your inbox, please check your spam
                folder.
              </p>
              <Link to={colors.backLink}>
                <Button className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${colors.gradient} flex items-center justify-center p-4`}
    >
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            to={colors.backLink}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
          <div className="flex items-center justify-center mb-4">
            <div className={`${colors.iconBg} p-3 rounded-full`}>
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-gray-600 mt-2">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>
              Enter the email address associated with your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={
                            actualUserType === "admin"
                              ? "admin@company.com"
                              : "your.email@company.com"
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  to={colors.backLink}
                  className={`${colors.linkColor} font-medium`}
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-600 mb-2">Demo Note:</p>
              <p className="text-xs text-gray-700">
                In this demo, password reset tokens are logged to the console.
                In production, these would be sent via email.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
