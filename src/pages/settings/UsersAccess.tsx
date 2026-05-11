import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BottomNav } from "@/components/patela/BottomNav";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  ArrowLeft, 
  Plus, 
  Users, 
  Shield, 
  UserCheck, 
  UserX, 
  MoreVertical,
  Trash2,
  Edit2,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface TeamMember {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  role: "admin" | "manager" | "cashier";
  is_active: boolean;
}

const roleLabels = {
  admin: "Admin",
  manager: "Manager", 
  cashier: "Cashier",
};

const roleDescriptions = {
  admin: "Full access to all features",
  manager: "Can view sales, manage refunds, manage staff",
  cashier: "Can make sales and view own sales only",
};

const roleIcons = {
  admin: Shield,
  manager: UserCheck,
  cashier: Users,
};

export default function UsersAccess() {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const { t } = useLanguage();
  
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "manager" | "cashier">("cashier");
  const [saving, setSaving] = useState(false);

  const MAX_TEAM_MEMBERS = 10;

  useEffect(() => {
    if (user) {
      fetchTeamMembers();
    }
  }, [user]);

  const fetchTeamMembers = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("owner_user_id", user.id)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      setMembers(data || []);
    } catch (e) {
      console.error("Failed to fetch team members:", e);
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setRole("cashier");
    setEditingMember(null);
  };

  const openAddDialog = () => {
    if (members.length >= MAX_TEAM_MEMBERS) {
      toast.error(`You can only add up to ${MAX_TEAM_MEMBERS} team members`);
      return;
    }
    resetForm();
    setShowAddDialog(true);
  };

  const openEditDialog = (member: TeamMember) => {
    setName(member.name);
    setPhone(member.phone || "");
    setEmail(member.email || "");
    setRole(member.role);
    setEditingMember(member);
    setShowAddDialog(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!phone.trim() && !email.trim()) {
      toast.error("Phone or email is required");
      return;
    }

    setSaving(true);

    try {
      if (editingMember) {
        // Update existing member
        const { error } = await supabase
          .from("team_members")
          .update({
            name: name.trim(),
            phone: phone.trim() || null,
            email: email.trim() || null,
            role,
          })
          .eq("id", editingMember.id);

        if (error) throw error;
        toast.success("Team member updated");
      } else {
        // Add new member
        const { error } = await supabase
          .from("team_members")
          .insert({
            owner_user_id: user!.id,
            name: name.trim(),
            phone: phone.trim() || null,
            email: email.trim() || null,
            role,
          });

        if (error) throw error;
        toast.success("Team member added");
      }

      setShowAddDialog(false);
      resetForm();
      fetchTeamMembers();
    } catch (e) {
      console.error("Failed to save team member:", e);
      toast.error("Failed to save team member");
    } finally {
      setSaving(false);
    }
  };

  const toggleMemberStatus = async (member: TeamMember) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .update({ is_active: !member.is_active })
        .eq("id", member.id);

      if (error) throw error;
      
      toast.success(member.is_active ? "Team member deactivated" : "Team member activated");
      fetchTeamMembers();
    } catch (e) {
      console.error("Failed to toggle member status:", e);
      toast.error("Failed to update team member");
    }
  };

  const deleteMember = async (member: TeamMember) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", member.id);

      if (error) throw error;
      
      toast.success("Team member removed");
      fetchTeamMembers();
    } catch (e) {
      console.error("Failed to delete member:", e);
      toast.error("Failed to remove team member");
    }
  };

  // Only admins can access this page
  if (userRole !== "admin") {
    return (
      <div className="min-h-screen patela-app-bg flex items-center justify-center pb-24">
        <div className="text-center px-6">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Access Restricted</h2>
          <p className="text-muted-foreground mb-6">Only admins can manage team members.</p>
          <Button onClick={() => navigate("/account")}>Go Back</Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen patela-app-bg pb-24">
      {/* Header */}
      <header className="bg-primary px-4 py-4 patela-shadow-md">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => navigate("/account")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-primary-foreground">Users & Access</h1>
            <p className="text-sm text-primary-foreground/70">
              {members.length}/{MAX_TEAM_MEMBERS} team members
            </p>
          </div>
          <Button
            size="sm"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={openAddDialog}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </header>

      <main className="px-4 py-4">
        {/* Role Legend */}
        <div className="bg-card rounded-xl p-4 border border-border mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Role Permissions</h3>
          <div className="space-y-2">
            {(Object.keys(roleLabels) as Array<keyof typeof roleLabels>).map((key) => {
              const Icon = roleIcons[key];
              return (
                <div key={key} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    key === "admin" ? "bg-primary/10" : 
                    key === "manager" ? "bg-accent/10" : "bg-muted"
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      key === "admin" ? "text-primary" : 
                      key === "manager" ? "text-accent" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{roleLabels[key]}</p>
                    <p className="text-xs text-muted-foreground">{roleDescriptions[key]}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Members List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-medium mb-1">No team members yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Add team members to help manage your business
            </p>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {members.map((member) => {
              const Icon = roleIcons[member.role];
              return (
                <div 
                  key={member.id}
                  className={`bg-card rounded-xl p-4 border transition-colors ${
                    member.is_active ? "border-border" : "border-destructive/20 bg-destructive/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      member.role === "admin" ? "bg-primary/10" : 
                      member.role === "manager" ? "bg-accent/10" : "bg-muted"
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        member.role === "admin" ? "text-primary" : 
                        member.role === "manager" ? "text-accent" : "text-muted-foreground"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground truncate">{member.name}</p>
                        {!member.is_active && (
                          <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {member.phone || member.email}
                      </p>
                      <p className="text-xs text-primary font-medium">{roleLabels[member.role]}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(member)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleMemberStatus(member)}>
                          {member.is_active ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteMember(member)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-sm max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Edit Team Member" : "Add Team Member"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g. 0712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Role *</Label>
              <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cashier">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Cashier
                    </div>
                  </SelectItem>
                  <SelectItem value="manager">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Manager
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{roleDescriptions[role]}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
