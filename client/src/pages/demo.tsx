
import { Button } from "@/components/ui/button";

export default function Demo() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Try WitherCo</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Experience WitherCo's features with our interactive demo.
      </p>
      <Button asChild size="lg">
        <a href="/auth">Get Started</a>
      </Button>
    </div>
  );
}
