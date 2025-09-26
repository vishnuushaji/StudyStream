import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertRegistrationSchema, type InsertRegistration } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Rocket, User, Mail, Phone, Video, Upload, BarChart3 } from "lucide-react";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertRegistration>({
    resolver: zodResolver(insertRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: InsertRegistration) => {
      const response = await apiRequest("POST", "/api/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Registration Successful!",
        description: "Welcome to our platform. Redirecting to confirmation page...",
      });
      setTimeout(() => {
        setLocation("/confirmation");
      }, 1500);
    },
    onError: (error) => {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertRegistration) => {
    registrationMutation.mutate(data);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center hero-pattern pt-16">
        <div className="absolute inset-0 brand-gradient opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 font-poppins">
              Join Our Platform
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Register today to access exclusive content, upload your media, and connect with our community.
            </p>
          </div>

          {/* Registration Form */}
          <Card className="max-w-md mx-auto shadow-2xl">
            <CardContent className="pt-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="text-2xl text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-semibold text-card-foreground font-poppins">Get Started</h2>
                <p className="text-muted-foreground mt-2">Fill in your details to register</p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="text-muted-foreground w-4 h-4" />
                    </div>
                    <Input
                      id="name"
                      type="text"
                      {...form.register("name")}
                      className="pl-10"
                      placeholder="Enter your full name"
                      data-testid="input-name"
                    />
                  </div>
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-muted-foreground w-4 h-4" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      className="pl-10"
                      placeholder="Enter your email"
                      data-testid="input-email"
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="text-muted-foreground w-4 h-4" />
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      {...form.register("phone")}
                      className="pl-10"
                      placeholder="Enter your phone number"
                      data-testid="input-phone"
                    />
                  </div>
                  {form.formState.errors.phone && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.phone.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={registrationMutation.isPending}
                  data-testid="button-register"
                >
                  {registrationMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Rocket className="mr-2 w-4 h-4" />
                      Complete Registration
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  By registering, you agree to our{" "}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-poppins">Platform Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Discover what makes our platform special</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Video className="text-primary text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">Exclusive Content</h3>
                <p className="text-muted-foreground">Access premium video content and downloadable media after registration.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Upload className="text-secondary text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">Media Upload</h3>
                <p className="text-muted-foreground">Upload PNG images securely with QR code generation for easy mobile access.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="text-accent text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">Analytics & Reports</h3>
                <p className="text-muted-foreground">Track registrations and generate detailed CSV reports for analysis.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
