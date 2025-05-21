import { useEffect, useState } from "react";
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
import { supabase } from "@/lib/supabase";

export default function Profile() {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [personalEmail, setPersonalEmail] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [urls, setUrls] = useState([""]);

  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchProfile = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Error fetching user", userError);
      return;
    }

    setUserId(user.id);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error loading profile", error);
      return;
    }

    if (data) {
      setRole(data.role || "");
      setName(data.name || "");
      setTitle(data.title || "");
      setPersonalEmail(data.personal_email || "");
      setCompanyEmail(data.company_email || "");
      setNotes(data.notes || "");
      setUrls(data.urls || [""]);
    }
  };
  useEffect(() => {

    fetchProfile();
  }, []);

  const handleAddUrl = () => {
    setUrls((prev) => [...prev, ""]);
  };

  const handleUrlChange = (index: number, value: string) => {
    const updated = [...urls];
    updated[index] = value;
    setUrls(updated);
  };

const handleSave = async () => {
  if (!userId) return;
  setLoading(true);

  const { error } = await supabase.from("profiles").upsert({
    user_id: userId,
    role,
    name,
    title,
    personal_email: personalEmail,
    company_email: companyEmail,
    notes,
    urls,
    updated_at: new Date().toISOString(),
  }, {
    onConflict: 'user_id'
  });

  setLoading(false);

  if (error) {
    console.error("Failed to update profile", error);
  } else {
    alert("Profile saved!");
    await fetchProfile(); // <- refresh local state
  }
};

  return (
    <div className="flex flex-col h-screen">
      <header className="w-full border-b bg-background px-6 py-3 shadow-sm">
        <TopNav />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <SidebarNav />

        <main className="flex-1 overflow-auto bg-muted/40 p-4 md:p-6">
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">My Profile</h1>
              <p className="text-muted-foreground text-sm">
                Only the hiring team members will be able to see your profile
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="role">Role Name</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend Developer</SelectItem>
                    <SelectItem value="designer">Product Designer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Your Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div>
                <Label>Personal Email</Label>
                <Input
                  type="email"
                  value={personalEmail}
                  onChange={(e) => setPersonalEmail(e.target.value)}
                />
              </div>

              <div>
                <Label>Company Email</Label>
                <Input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                />
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Write something about yourself..."
                  rows={4}
                />
              </div>

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

              <div className="flex flex-col sm:flex-row justify-between gap-2 pt-4">
                <Button variant="destructive" className="w-full sm:w-auto">
                  Delete Profile
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {loading ? "Saving..." : "Update Profile"}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
