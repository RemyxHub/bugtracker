import { createClient } from "@supabase/supabase-js";

// Supabase Configuration
// Replace these with your actual Supabase project details
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project-id.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key-here";

// Environment Variables Required:
// VITE_SUPABASE_URL=https://your-project-id.supabase.co
// VITE_SUPABASE_ANON_KEY=your-anon-key-here
// SUPABASE_PROJECT_ID=your-project-id
// SUPABASE_URL=https://your-project-id.supabase.co
// SUPABASE_ANON_KEY=your-anon-key-here
// SUPABASE_SERVICE_KEY=your-service-role-key-here

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables. Please check your .env file.",
  );
  console.error(
    "Required variables: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY",
  );
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// File upload function
export const uploadFile = async (
  file: File,
  bucket: string = "ticket-attachments",
) => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      console.error("Error uploading file:", error);
      throw error;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return { success: true, url: publicUrl, path: filePath };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false, error };
  }
};

// Real-time subscription for dashboard updates
export const subscribeToTicketChanges = (callback: () => void) => {
  const subscription = supabase
    .channel("tickets-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "tickets",
      },
      () => {
        console.log("Ticket change detected, refreshing dashboard...");
        callback();
      },
    )
    .subscribe();

  return subscription;
};

// Analytics data fetching functions - filtered for callcentre data
export const fetchAnalyticsData = async (dateRange?: {
  from: Date;
  to: Date;
}) => {
  try {
    // Get callcentre-specific analytics data
    let query = supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    // Apply date range filter if provided
    if (dateRange?.from && dateRange?.to) {
      query = query
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString());
    }

    const { data: ticketData, error: ticketError } = await query;

    if (ticketError) {
      console.error("Error fetching ticket data:", ticketError);
      throw ticketError;
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("role", "callcentre")
      .eq("status", "active");

    if (userError) {
      console.error("Error fetching user data:", userError);
      throw userError;
    }

    // Calculate callcentre-specific metrics
    const totalTickets = ticketData?.length || 0;
    const resolvedTickets =
      ticketData?.filter(
        (t) => t.status === "resolved" || t.status === "closed",
      ).length || 0;
    const assignedTickets =
      ticketData?.filter((t) => t.assigned_to !== null).length || 0;
    const activeStaff = userData?.length || 0;

    // Get current month data for comparison
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentMonthTickets =
      ticketData?.filter((t) => {
        const ticketDate = new Date(t.created_at);
        return (
          ticketDate.getMonth() === currentMonth &&
          ticketDate.getFullYear() === currentYear
        );
      }).length || 0;

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthTickets =
      ticketData?.filter((t) => {
        const ticketDate = new Date(t.created_at);
        return (
          ticketDate.getMonth() === lastMonth &&
          ticketDate.getFullYear() === lastMonthYear
        );
      }).length || 0;

    const ticketChange =
      lastMonthTickets > 0
        ? ((currentMonthTickets - lastMonthTickets) / lastMonthTickets) * 100
        : 0;
    const resolvedChange = Math.random() * 20 - 10; // Mock data for demo
    const revenueChange = Math.random() * 15 - 5; // Mock data for demo

    // Format data to match expected structure
    const analyticsData = [
      {
        metric_name: "orders",
        metric_value: totalTickets,
        metric_change: Math.round(ticketChange),
        metric_increased: ticketChange >= 0,
      },
      {
        metric_name: "approved",
        metric_value: resolvedTickets,
        metric_change: Math.round(resolvedChange),
        metric_increased: resolvedChange >= 0,
      },
      {
        metric_name: "users",
        metric_value: activeStaff,
        metric_label: "active call centre staff",
      },
      {
        metric_name: "subscriptions",
        metric_value: assignedTickets,
        metric_label: "assigned tickets",
      },
      {
        metric_name: "month_total",
        metric_value: currentMonthTickets,
        metric_change: Math.round(ticketChange),
        metric_increased: ticketChange >= 0,
      },
      {
        metric_name: "revenue",
        metric_value: resolvedTickets * 50, // Mock revenue calculation
        metric_change: Math.round(revenueChange),
        metric_increased: revenueChange >= 0,
      },
      {
        metric_name: "paid_invoices",
        metric_value: resolvedTickets * 75.5,
        metric_label: "Total Resolution Value",
      },
      {
        metric_name: "funds_received",
        metric_value: totalTickets * 25.75,
        metric_label: "Total Ticket Value",
      },
    ];

    console.log("Callcentre analytics data generated:", analyticsData);
    return analyticsData;
  } catch (error) {
    console.error("Error fetching callcentre analytics data:", error);
    return null;
  }
};

export const fetchChartData = async (
  chartType: "sales" | "activity",
  year: number = new Date().getFullYear(),
  dateRange?: { from: Date; to: Date },
) => {
  try {
    // Fetch callcentre-related ticket data for charts
    let query = supabase.from("tickets").select("*").order("created_at");

    // Apply date range filter if provided, otherwise use year filter
    if (dateRange?.from && dateRange?.to) {
      query = query
        .gte("created_at", dateRange.from.toISOString())
        .lte("created_at", dateRange.to.toISOString());
    } else {
      query = query
        .gte("created_at", `${year}-01-01`)
        .lt("created_at", `${year + 1}-01-01`);
    }

    const { data: ticketData, error } = await query;

    if (error) throw error;

    // Generate chart data based on ticket activity
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

    const chartData = months.map((month, index) => {
      const monthTickets =
        ticketData?.filter((ticket) => {
          const ticketDate = new Date(ticket.created_at);
          return ticketDate.getMonth() === index;
        }) || [];

      if (chartType === "sales") {
        // For sales chart, show resolved tickets as "sales"
        const resolvedCount = monthTickets.filter(
          (t) => t.status === "resolved" || t.status === "closed",
        ).length;
        return {
          month,
          value: resolvedCount,
        };
      } else {
        // For activity chart, show total ticket activity
        return {
          month,
          value: monthTickets.length,
        };
      }
    });

    console.log(`Callcentre ${chartType} chart data generated:`, chartData);
    return chartData;
  } catch (error) {
    console.error("Error fetching callcentre chart data:", error);
    return null;
  }
};

export const fetchTickets = async () => {
  try {
    const { data, error } = await supabase
      .from("tickets")
      .select(
        `
        *,
        assigned_to:users(name, email, role)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tickets:", error);
      throw error;
    }

    // Filter to only include tickets assigned to callcentre staff or unassigned tickets
    const callcentreTickets =
      data?.filter((ticket) => {
        if (!ticket.assigned_to) return true; // Include unassigned tickets
        return (ticket.assigned_to as any)?.role === "callcentre";
      }) || [];

    console.log(
      "Callcentre tickets fetched successfully:",
      callcentreTickets.length,
      "tickets",
    );
    return callcentreTickets;
  } catch (error) {
    console.error("Error fetching callcentre tickets:", error);
    return null;
  }
};

// Update ticket function
export const updateTicket = async (ticketId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from("tickets")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", ticketId)
      .select();

    if (error) {
      console.error("Error updating ticket:", error);
      throw error;
    }

    console.log("Ticket updated successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error updating ticket:", error);
    return { success: false, error };
  }
};

// Add ticket note function
export const addTicketNote = async (
  ticketId: string,
  note: string,
  userId?: string,
) => {
  try {
    // Get a valid admin user ID if none provided
    let validUserId = userId;
    if (!validUserId) {
      const { data: adminUser, error: adminError } = await supabase
        .from("users")
        .select("id")
        .eq("role", "admin")
        .eq("status", "active")
        .limit(1)
        .single();

      if (adminError || !adminUser) {
        console.error("Error finding admin user:", adminError);
        throw new Error("No valid admin user found");
      }
      validUserId = adminUser.id;
    }

    const { data, error } = await supabase
      .from("ticket_notes")
      .insert({
        ticket_id: ticketId,
        user_id: validUserId,
        note: note.trim(),
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Error adding ticket note:", error);
      throw error;
    }

    console.log("Ticket note added successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error adding ticket note:", error);
    return { success: false, error };
  }
};

export const fetchUsers = async () => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        "id, email, name, employee_id, role, status, created_at, last_login",
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return null;
  }
};

// Authentication functions
export const authenticateUser = async (email: string, password: string) => {
  try {
    // In a real app, you'd use Supabase Auth, but for this demo we'll check against our users table
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("status", "active")
      .single();

    if (error || !data) {
      return { success: false, error: "Invalid credentials" };
    }

    // In a real app, you'd hash and compare passwords properly
    // For demo purposes, we'll accept the hardcoded passwords
    const validPasswords = {
      "remy@ryotek.my": "admin123",
      "admin@company.com": "admin123",
      "john.smith@company.com": "staff123",
      "sarah.johnson@company.com": "staff123",
    };

    if (validPasswords[email as keyof typeof validPasswords] === password) {
      // Update last login
      await supabase
        .from("users")
        .update({ last_login: new Date().toISOString() })
        .eq("id", data.id);

      return { success: true, user: data };
    }

    return { success: false, error: "Invalid credentials" };
  } catch (error) {
    console.error("Authentication error:", error);
    return { success: false, error: "Authentication failed" };
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return { success: false, error: "Email not found" };
    }

    // Generate reset token
    const resetToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    const { error } = await supabase
      .from("users")
      .update({
        reset_token: resetToken,
        reset_token_expires: expiresAt.toISOString(),
      })
      .eq("id", user.id);

    if (error) throw error;

    // In a real app, you'd send an email with the reset link
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return { success: true, message: "Password reset email sent" };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, error: "Failed to send reset email" };
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("reset_token", token)
      .gt("reset_token_expires", new Date().toISOString())
      .single();

    if (userError || !user) {
      return { success: false, error: "Invalid or expired reset token" };
    }

    // In a real app, you'd hash the password
    const { error } = await supabase
      .from("users")
      .update({
        password_hash:
          "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // Placeholder hash
        reset_token: null,
        reset_token_expires: null,
      })
      .eq("id", user.id);

    if (error) throw error;

    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, error: "Failed to reset password" };
  }
};

// Add user function
export const addUser = async (userData: {
  name: string;
  email: string;
  employeeId: string;
  role: "admin" | "callcentre";
  password: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert({
        name: userData.name,
        email: userData.email,
        employee_id: userData.employeeId,
        role: userData.role,
        password_hash:
          "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // Placeholder hash
        status: "active",
        created_at: new Date().toISOString(),
        last_login: null,
      })
      .select();

    if (error) {
      console.error("Error adding user:", error);
      throw error;
    }

    console.log("User added successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error adding user:", error);
    return { success: false, error };
  }
};

// Update user function
export const updateUser = async (
  userId: string,
  userData: {
    name: string;
    email: string;
    employeeId: string;
    role: "admin" | "callcentre";
    password?: string;
  },
) => {
  try {
    const updateData: any = {
      name: userData.name,
      email: userData.email,
      employee_id: userData.employeeId,
      role: userData.role,
    };

    // Only update password if provided
    if (userData.password && userData.password.trim() !== "") {
      updateData.password_hash =
        "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"; // Placeholder hash
    }

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select();

    if (error) {
      console.error("Error updating user:", error);
      throw error;
    }

    console.log("User updated successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error };
  }
};

// Delete user function
export const deleteUser = async (userId: string) => {
  try {
    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) {
      console.error("Error deleting user:", error);
      throw error;
    }

    console.log("User deleted successfully");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error };
  }
};

// Toggle user status function
export const toggleUserStatus = async (
  userId: string,
  currentStatus: string,
) => {
  try {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const { data, error } = await supabase
      .from("users")
      .update({
        status: newStatus,
      })
      .eq("id", userId)
      .select();

    if (error) {
      console.error("Error toggling user status:", error);
      throw error;
    }

    console.log("User status toggled successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error toggling user status:", error);
    return { success: false, error };
  }
};
