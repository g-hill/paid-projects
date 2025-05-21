import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TopNav } from "@/components/TopNav";
import { SidebarNav } from "@/components/SidebarNav";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Profile() {
  const [urls, setUrls] = useState(["", ""]);

  const handleAddUrl = () => {
    setUrls((prev) => [...prev, ""]);
  };

  const handleUrlChange = (index: number, value: string) => {
    const updated = [...urls];
    updated[index] = value;
    setUrls(updated);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="w-full border-b bg-background px-6 py-3 shadow-sm">
        <TopNav />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav />

        <main className="flex-1 overflow-auto bg-muted/0 p-4 md:p-6">
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">My Profile</h1>
              <p className="text-muted-foreground text-sm">
                Only the hiring team members will be able to see your profile
              </p>
            </div>

            <div className="space-y-4">
              {/* Role Dropdown */}
              <div>
                <Label htmlFor="role">Role Name</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">UX Designer</SelectItem>
                    <SelectItem value="designer">Product Designer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Name + Title */}
              <div>
                <Label>Your Name</Label>
                <Input placeholder="John Doe" />
              </div>

              <div>
                <Label>Title</Label>
                <Input placeholder="Senior Developer" />
              </div>

              {/* Emails */}
              <div>
                <Label>Personal Email</Label>
                <Input type="email" placeholder="john@example.com" />
              </div>

              <div>
                <Label>Company Email</Label>
                <Input type="email" placeholder="john@company.com" />
              </div>

              {/* Notes */}
              <div>
                <Label>Notes</Label>
                <Textarea
                  placeholder="Write something about yourself..."
                  rows={4}
                />
              </div>

              {/* URLs Section */}
              <div>
                <Label>URLs</Label>
                <div className="space-y-2">
                  {urls.map((url, i) => (
                    <Input
                      key={i}
                      placeholder={`Link ${i + 1}`}
                      value={url}
                      onChange={(e) => handleUrlChange(i, e.target.value)}
                    />
                  ))}
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={handleAddUrl}
                  >
                    + Add URL
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-between gap-2 pt-4">
                <Button variant="destructive" className="w-full sm:w-auto">
                  Delete Profile
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  Update Profile
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
