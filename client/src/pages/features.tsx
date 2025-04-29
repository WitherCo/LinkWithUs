
import { Card, CardContent } from "@/components/ui/card";

export default function Features() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Features</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Custom Links</h2>
            <p className="text-muted-foreground">Create and manage your personalized link collection.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
            <p className="text-muted-foreground">Track clicks and visitor engagement with detailed analytics.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Custom Domain</h2>
            <p className="text-muted-foreground">Use your own domain name for your link page.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
