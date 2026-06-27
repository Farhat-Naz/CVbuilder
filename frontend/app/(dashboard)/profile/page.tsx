"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { getInitials } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "sonner";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  avatar_url: z.string().url("Invalid URL").or(z.literal("")).optional(),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, "Current password required"),
  new_password: z.string().min(8, "Min 8 characters"),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, { message: "Passwords don't match", path: ["confirm_password"] });

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user } = useAuth();

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: user?.full_name || "", avatar_url: user?.avatar_url || "" },
  });

  const passwordForm = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });

  const saveProfile = async (data: ProfileData) => {
    try {
      await api.put("/users/me", data);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const changePassword = async (data: PasswordData) => {
    try {
      await api.post("/users/me/change-password", { current_password: data.current_password, new_password: data.new_password });
      toast.success("Password changed!");
      passwordForm.reset();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to change password");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold font-heading">Profile</h1>
        <p className="text-muted-foreground text-sm">Manage your account information</p>
      </motion.div>

      {/* Avatar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatar_url || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                    {getInitials(user?.full_name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h3 className="font-semibold">{user?.full_name || "User"}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full capitalize">{user?.subscription_plan || "Free"} Plan</span>
                  {user?.is_verified && <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5 rounded-full">Verified</span>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader><CardTitle className="text-lg font-heading">Personal Information</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit(saveProfile)} className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input className="mt-1.5" {...profileForm.register("full_name")} />
                {profileForm.formState.errors.full_name && <p className="text-destructive text-xs mt-1">{profileForm.formState.errors.full_name.message}</p>}
              </div>
              <div>
                <Label>Email</Label>
                <Input className="mt-1.5 bg-muted" value={user?.email || ""} disabled />
              </div>
              <div>
                <Label>Avatar URL</Label>
                <Input className="mt-1.5" placeholder="https://..." {...profileForm.register("avatar_url")} />
              </div>
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white" disabled={profileForm.formState.isSubmitting}>
                {profileForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader><CardTitle className="text-lg font-heading">Change Password</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={passwordForm.handleSubmit(changePassword)} className="space-y-4">
              <div>
                <Label>Current Password</Label>
                <Input type="password" className="mt-1.5" {...passwordForm.register("current_password")} />
              </div>
              <div>
                <Label>New Password</Label>
                <Input type="password" className="mt-1.5" {...passwordForm.register("new_password")} />
                {passwordForm.formState.errors.new_password && <p className="text-destructive text-xs mt-1">{passwordForm.formState.errors.new_password.message}</p>}
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input type="password" className="mt-1.5" {...passwordForm.register("confirm_password")} />
                {passwordForm.formState.errors.confirm_password && <p className="text-destructive text-xs mt-1">{passwordForm.formState.errors.confirm_password.message}</p>}
              </div>
              <Button type="submit" variant="outline" disabled={passwordForm.formState.isSubmitting}>
                {passwordForm.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
