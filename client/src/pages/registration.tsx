import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ClipboardList, User, GraduationCap, Info, Send, X } from "lucide-react";
import { insertRegistrationSchema, type InsertRegistration } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import SuccessModal from "@/components/success-modal";
import mainPhoto from '../assets/logo.jpg';

export default function RegistrationPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertRegistration>({
    resolver: zodResolver(insertRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      grade: "",
      position: "",
      committees: [],
      suggestions: "",
      newsletter: false,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertRegistration) => {
      const response = await apiRequest("POST", "/api/registrations", data);
      return response.json();
    },
    onSuccess: () => {
      setShowSuccess(true);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertRegistration) => {
    registerMutation.mutate(data);
  };

  const handleCommitteeChange = (committee: string, checked: boolean) => {
    const currentCommittees = form.getValues("committees");
    if (checked) {
      form.setValue("committees", [...currentCommittees, committee]);
    } else {
      form.setValue("committees", currentCommittees.filter(c => c !== committee));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <img 
            src={mainPhoto} 
            alt="Model United Nations Conference" 
            className="w-full h-48 object-cover rounded-xl shadow-lg"
          />
        </div>
        <div className="bg-primary/10 rounded-lg p-6 mb-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">MUN 2025</h2>
          <p className="text-lg font-medium text-primary">Prodigy Public School</p>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Register now for our inaugural School Model United Nations conference. This is a great opportunity for beginners to learn about diplomacy, global issues, and public speaking in a supportive environment.
        </p>
      </div>

      {/* Registration Form Card */}
      <Card className="shadow-lg border-gray-200">
        <CardHeader className="bg-primary text-white rounded-t-lg">
          <CardTitle className="flex items-center">
            <ClipboardList className="h-6 w-6 mr-3" />
            Delegate Registration Form
          </CardTitle>
          <p className="text-primary-foreground/90 text-sm mt-1">
            Please fill out all required fields to complete your registration
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 text-primary mr-2" />
                    Personal Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address (Optional)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade/Year *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="z-50">
                            <SelectItem value="9">Grade 9</SelectItem>
                            <SelectItem value="10">Grade 10</SelectItem>
                            <SelectItem value="11">Grade 11</SelectItem>
                            <SelectItem value="12">Grade 12</SelectItem>
                            <SelectItem value="undergraduate">Undergraduate</SelectItem>
                            <SelectItem value="graduate">Graduate</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* MUN Experience Section */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <GraduationCap className="h-5 w-5 text-primary mr-2" />
                    MUN Experience
                  </h4>
                </div>

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Position *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-50">
                          <SelectItem value="delegate">Delegate</SelectItem>
                          <SelectItem value="chair">Committee Chair</SelectItem>
                          <SelectItem value="crisis">Crisis Staff</SelectItem>
                          <SelectItem value="press">Press Corps</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="committees"
                  render={() => (
                    <FormItem>
                      <FormLabel>Committee Preferences *</FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { id: "AIPPM", label: "All India Political Parties Meet (AIPPM)" },
                          { id: "LSabha", label: "Lok Sabha (House of the People)" },
                          { id: "RSabha", label: "Rajya Sabha (Council of States)" },
                          { id: "NITI", label: "NITI Aayog (National Institution for Transforming India)" },
                          { id: "UNSC", label: "United Nations Security Council (UNSC)" },
                          { id: "UNGA", label: "United Nations General Assembly (UNGA)" },
                          { id: "ECOSOC", label: "Economic and Social Council (ECOSOC)" },
                          { id: "WHO", label: "World Health Organization (WHO)" },
                          { id: "UNICEF", label: "United Nations Children's Fund (UNICEF)" },
                          { id: "UNESCO", label: "United Nations Educational, Scientific and Cultural Organization (UNESCO)" },
                          { id: "UNHRC", label: "United Nations Human Rights Council (UNHRC)" },
                          { id: "DISEC", label: "Disarmament and International Security Committee (DISEC)" },
                        ].map((committee) => (
                          <FormField
                            key={committee.id}
                            control={form.control}
                            name="committees"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(committee.id)}
                                    onCheckedChange={(checked) => 
                                      handleCommitteeChange(committee.id, checked as boolean)
                                    }
                                  />
                                </FormControl>
                                <FormLabel className="text-sm text-gray-700 cursor-pointer">
                                  {committee.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Suggestions */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Info className="h-5 w-5 text-primary mr-2" />
                    Suggestions & Comments
                  </h4>
                </div>

                <FormField
                  control={form.control}
                  name="suggestions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Any suggestions or comments for the conference?</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Share your thoughts, suggestions, or any special requests..." 
                          rows={4}
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Newsletter Subscription */}
              <div className="space-y-4 border-t border-gray-200 pt-6">
                <FormField
                  control={form.control}
                  name="newsletter"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="text-sm text-gray-700">
                        I would like to receive updates about future MUN conferences and events
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button type="button" variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={registerMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {registerMutation.isPending ? "Submitting..." : "Submit Registration"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
}