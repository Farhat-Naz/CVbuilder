"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Resume } from "@/types";
import { useEffect } from "react";
import { User, Mail, Phone, MapPin, Link2, Globe, GitBranch } from "lucide-react";

const schema = z.object({
  title: z.string().min(1, "Resume title is required"),
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email").or(z.literal("")),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
  github: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  data: Partial<Resume>;
  onChange: (updates: Partial<Resume>) => void;
}

export function PersonalInfoStep({ data, onChange }: Props) {
  const { register, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: data.title || "My Resume",
      full_name: data.full_name || "",
      email: data.email || "",
      phone: data.phone || "",
      location: data.location || "",
      linkedin: data.linkedin || "",
      portfolio: data.portfolio || "",
      github: data.github || "",
    },
  });

  const values = watch();
  useEffect(() => { onChange(values); }, [JSON.stringify(values)]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-heading flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Resume Title *</Label>
          <Input id="title" className="mt-1.5" placeholder="e.g., Software Engineer Resume" {...register("title")} />
          {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <Label htmlFor="full_name">Full Name *</Label>
          <Input id="full_name" className="mt-1.5" placeholder="John Doe" {...register("full_name")} />
          {errors.full_name && <p className="text-destructive text-xs mt-1">{errors.full_name.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input id="email" type="email" className="pl-9" placeholder="you@example.com" {...register("email")} />
            </div>
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <div className="relative mt-1.5">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input id="phone" className="pl-9" placeholder="+1 234 567 8901" {...register("phone")} />
            </div>
          </div>
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <div className="relative mt-1.5">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input id="location" className="pl-9" placeholder="New York, NY" {...register("location")} />
          </div>
        </div>
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <div className="relative mt-1.5">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input id="linkedin" className="pl-9" placeholder="linkedin.com/in/yourname" {...register("linkedin")} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="portfolio">Portfolio</Label>
            <div className="relative mt-1.5">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input id="portfolio" className="pl-9" placeholder="yoursite.com" {...register("portfolio")} />
            </div>
          </div>
          <div>
            <Label htmlFor="github">GitHub</Label>
            <div className="relative mt-1.5">
              <GitBranch className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input id="github" className="pl-9" placeholder="github.com/username" {...register("github")} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
