import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Analytics data fetching functions
export const fetchAnalyticsData = async () => {
  try {
    const { data, error } = await supabase
      .from("analytics_data")
      .select("*")
      .eq("date_recorded", new Date().toISOString().split("T")[0]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return null;
  }
};

export const fetchChartData = async (
  chartType: "sales" | "activity",
  year: number = new Date().getFullYear(),
) => {
  try {
    const { data, error } = await supabase
      .from("chart_data")
      .select("*")
      .eq("chart_type", chartType)
      .eq("year", year)
      .order("month");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching chart data:", error);
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
        assigned_to:users(name, email)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return null;
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
