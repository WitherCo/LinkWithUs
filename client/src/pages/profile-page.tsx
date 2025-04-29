import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { UserWithLinks } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, ExternalLink } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useState, useEffect } from "react";

// Helper to detect if we're in a static environment (GitHub Pages)
const isStaticEnv = () => {
  return window.location.hostname.includes('github.io') || 
         window.location.hostname === 'witherco.xyz' ||
         window.location.hostname === 'www.witherco.xyz';
};

export default function ProfilePage() {
  // State for custom styling
  const [copied, setCopied] = useState(false);
  
  // Get username from URL: /:username
  const [, params] = useRoute("/:username");
  const username = params?.username || "";

  // Fetch profile data, with fallback to static data if in GitHub Pages environment
  const { data: profile, isLoading, error } = useQuery<UserWithLinks>({
    queryKey: [`/api/${username}`],
    queryFn: async () => {
      try {
        // If we're in GitHub Pages environment, try to fetch from static data
        if (isStaticEnv()) {
          const staticDataRes = await fetch('/data/example-users.json');
          if (staticDataRes.ok) {
            const usersData = await staticDataRes.json();
            const userData = usersData.find((user: any) => user.username === username);
            if (userData) {
              return {
                ...userData,
                theme: userData.theme || 'default',
                avatarUrl: userData.avatarUrl || null,
              };
            }
          }
        }
        
        // Fallback to API if not static or static fetch failed
        const res = await apiRequest("GET", `/api/${username}`);
        return res.json();
      } catch (e) {
        console.error("Error fetching profile data:", e);
        throw e;
      }
    },
    enabled: !!username,
    retry: isStaticEnv() ? 0 : 3, // Don't retry in static env, as it will always fail if data doesn't exist
  });
  
  // Copy profile URL to clipboard
  const copyProfileUrl = () => {
    const url = `https://witherco.xyz/${username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The profile you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <a href="/">Return Home</a>
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col min-h-screen items-center p-4 md:p-8 max-w-md mx-auto"
      style={{
        backgroundColor: profile.theme === 'default' ? undefined : 
          profile.theme === 'gradient' ? 'linear-gradient(to bottom right, #4f46e5, #ec4899)' : undefined
      }}
    >
      <div className="flex w-full justify-between absolute top-4 left-4 right-4">
        <button 
          onClick={copyProfileUrl}
          className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs flex items-center hover:bg-background transition-colors"
        >
          <span>witherco.xyz/{username}</span>
          <ExternalLink className="h-3 w-3 ml-1" />
        </button>
        <ThemeToggle />
      </div>
      
      <div className="w-full flex flex-col items-center mt-16 mb-8">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.displayName || profile.username}
            className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-primary"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-2 border-primary">
            <span className="text-2xl font-bold text-primary">
              {(profile.displayName || profile.username).charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
          {profile.displayName || profile.username}
        </h1>
        {profile.bio && (
          <p className="text-muted-foreground text-center mb-4 max-w-xs">
            {profile.bio}
          </p>
        )}
        
        {/* Notification for copy */}
        {copied && (
          <div className="fixed top-20 left-0 right-0 mx-auto w-fit bg-green-600 text-white px-4 py-2 rounded-md text-sm animate-fade-in-out z-50">
            Link copied to clipboard!
          </div>
        )}
      </div>

      <div className="w-full space-y-3">
        {profile.links
          .filter(link => link.active !== false) // Consider links active by default
          .sort((a, b) => (a.order || 0) - (b.order || 0)) // Use 0 as default order
          .map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button
                variant="outline"
                className="w-full p-6 flex items-center justify-center text-base hover:scale-105 transition-transform"
              >
                {link.title}
              </Button>
            </a>
          ))}
      </div>

      <footer className="mt-auto pt-12 pb-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} witherco.xyz</p>
        <a href="/" className="hover:underline">
          Create your own link page
        </a>
      </footer>
    </div>
  );
}