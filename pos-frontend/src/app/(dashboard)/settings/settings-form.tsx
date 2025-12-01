"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AccountSettings() {
  return (
    <Tabs defaultValue="profile" className="w-full">
      
      {/* Tabs */}
      <TabsList className="grid grid-cols-2 w-full max-w-lg">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>

      {/* PROFILE TAB */}
      <TabsContent value="profile" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              
              <div className="grid gap-2">
                <Label>Full Name</Label>
                <Input placeholder="John Doe" />
              </div>

              <div className="grid gap-2">
                <Label>Email</Label>
                <Input placeholder="john@example.com" type="email" />
              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Phone Number</Label>
                <Input placeholder="+880 123 456 789" />
              </div>

              <div className="grid gap-2">
                <Label>Language</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="bn">Bangla</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="w-fit mt-4">Save Changes</Button>
          </CardContent>
        </Card>
      </TabsContent>

      {/* PASSWORD TAB */}
      <TabsContent value="password" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">

            <div className="grid gap-2">
              <Label>Current Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>

            <div className="grid gap-2">
              <Label>New Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>

            <div className="grid gap-2">
              <Label>Confirm Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>

            <Button className="w-fit mt-2">Update Password</Button>

          </CardContent>
        </Card>
      </TabsContent>

    </Tabs>
  );
}
