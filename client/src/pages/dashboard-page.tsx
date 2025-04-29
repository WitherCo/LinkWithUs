import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LinkIcon, Edit, Trash2, Plus, Copy, ExternalLink, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { UserLink } from "@shared/schema";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [editingLink, setEditingLink] = useState<UserLink | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Get user links
  const { data: userLinks = [], isLoading } = useQuery({
    queryKey: ["/api/user/links"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/user/links");
      return res.json();
    },
  });

  // Create new link
  const createLinkMutation = useMutation({
    mutationFn: async (linkData: { title: string; url: string }) => {
      const res = await apiRequest("POST", "/api/user/links", linkData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/links"] });
      setNewLink({ title: "", url: "" });
      setIsAddDialogOpen(false);
      toast({
        title: "Link added",
        description: "Your link has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add link",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update link
  const updateLinkMutation = useMutation({
    mutationFn: async (linkData: { id: number; data: Partial<UserLink> }) => {
      const res = await apiRequest("PUT", `/api/user/links/${linkData.id}`, linkData.data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/links"] });
      setEditingLink(null);
      setIsEditDialogOpen(false);
      toast({
        title: "Link updated",
        description: "Your link has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update link",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete link
  const deleteLinkMutation = useMutation({
    mutationFn: async (linkId: number) => {
      await apiRequest("DELETE", `/api/user/links/${linkId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/links"] });
      toast({
        title: "Link deleted",
        description: "Your link has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete link",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle create link form submit
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add http:// if not present
    let url = newLink.url;
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }
    
    createLinkMutation.mutate({
      title: newLink.title,
      url
    });
  };

  // Handle edit link form submit
  const handleEditLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;
    
    // Add http:// if not present
    let url = editingLink.url;
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }
    
    updateLinkMutation.mutate({
      id: editingLink.id,
      data: {
        title: editingLink.title,
        url,
        active: editingLink.active
      }
    });
  };

  // Copy profile link to clipboard
  const handleCopyProfileLink = () => {
    const link = `https://witherco.xyz/${user?.username}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "Your profile link has been copied to clipboard.",
    });
  };

  // Profile state
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "",
    bio: user?.bio || "",
  });

  // Update profile when user data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  // Update profile
  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof profileData) => {
      const res = await apiRequest("PUT", "/api/user/profile", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update profile",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileData);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your profile and links</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-md flex items-center">
            <span>witherco.xyz/{user?.username}</span>
            <Button variant="ghost" size="icon" onClick={handleCopyProfileLink} className="ml-1 h-6 w-6">
              <Copy className="h-3 w-3" />
            </Button>
          </div>
          <Button asChild size="sm">
            <a href={`/${user?.username}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              View
            </a>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="links" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="links">
            <LinkIcon className="h-4 w-4 mr-2" />
            Links
          </TabsTrigger>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="links">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Your Links</CardTitle>
                  <CardDescription>Add, edit or remove your links</CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <form onSubmit={handleAddLink}>
                      <DialogHeader>
                        <DialogTitle>Add New Link</DialogTitle>
                        <DialogDescription>
                          Add a new link to your profile
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            placeholder="My Website"
                            value={newLink.title}
                            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="url">URL</Label>
                          <Input
                            id="url"
                            placeholder="https://example.com"
                            value={newLink.url}
                            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={createLinkMutation.isPending}>
                          {createLinkMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            "Add Link"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : userLinks.length === 0 ? (
                <div className="text-center py-8">
                  <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <p className="text-muted-foreground">You don't have any links yet</p>
                  <Button 
                    className="mt-4" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add your first link
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {userLinks.map((link: UserLink) => (
                    <div
                      key={link.id}
                      className={`flex items-center justify-between p-3 rounded-md border ${
                        link.active ? "" : "opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-md flex items-center justify-center ${
                            link.active 
                              ? "bg-primary/10 text-primary" 
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <LinkIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{link.title}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px] md:max-w-md">
                            {link.url}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setEditingLink(link);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => deleteLinkMutation.mutate(link.id)}
                          disabled={deleteLinkMutation.isPending}
                        >
                          {deleteLinkMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    placeholder="Your Name"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    This is the name that will be displayed on your public profile
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="A short description about yourself"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    This will appear under your name on your public profile page
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full mt-6"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Link Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          {editingLink && (
            <form onSubmit={handleEditLink}>
              <DialogHeader>
                <DialogTitle>Edit Link</DialogTitle>
                <DialogDescription>
                  Update your link details
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    placeholder="My Website"
                    value={editingLink.title}
                    onChange={(e) =>
                      setEditingLink({ ...editingLink, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-url">URL</Label>
                  <Input
                    id="edit-url"
                    placeholder="https://example.com"
                    value={editingLink.url}
                    onChange={(e) =>
                      setEditingLink({ ...editingLink, url: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="edit-active" className="flex-grow">Active</Label>
                  <Switch
                    id="edit-active"
                    checked={editingLink.active}
                    onCheckedChange={(checked) =>
                      setEditingLink({ ...editingLink, active: checked })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={updateLinkMutation.isPending}>
                  {updateLinkMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}