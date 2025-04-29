import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Link as LinkIcon, User, Zap } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4 md:py-24 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-pink-600 bg-clip-text text-transparent">
            witherco.xyz
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Create a custom link page to share all your important links with one simple URL
          </p>
          
          {/* Environment-specific content */}
          {window.location.hostname.includes('github.io') || 
           window.location.hostname === 'witherco.xyz' ? (
            <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4 mb-8 max-w-3xl mx-auto">
              <p className="text-yellow-800 dark:text-yellow-200 mb-2">
                <strong>GitHub Pages Demo:</strong> This is a static demo version deployed on GitHub Pages.
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Try these example profiles: 
                <a href="/wither" className="underline ml-1 font-medium">wither</a>,
                <a href="/design" className="underline ml-1 font-medium">design</a>,
                <a href="/tech" className="underline ml-1 font-medium">tech</a>
              </p>
            </div>
          ) : null}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button asChild size="lg" className="font-semibold">
                <Link to="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="font-semibold">
                  <Link to="/auth">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/auth">Login</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            One Link for All Your Content
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Manage All Your Links</h3>
              <p className="text-muted-foreground">
                Add, edit, and organize all your important links in one place
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Custom Profile</h3>
              <p className="text-muted-foreground">
                Personalize your page with your own username and branding
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Simple & Fast</h3>
              <p className="text-muted-foreground">
                Create your link page in seconds with our easy-to-use interface
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4 font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Create an Account</h3>
              <p className="text-muted-foreground">
                Sign up for a free account and choose your unique username
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4 font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Add Your Links</h3>
              <p className="text-muted-foreground">
                Add all the links you want to share with your audience
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4 font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Share Your Page</h3>
              <p className="text-muted-foreground">
                Share your witherco.xyz/username link with your audience
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link to="/auth">
                Create Your Link Page
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
