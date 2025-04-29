import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="w-full py-8 border-t">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold mb-2">witherco.xyz</h3>
            <p className="text-sm text-muted-foreground">
              Create your custom link page in seconds
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-medium mb-2">Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/auth" className="text-muted-foreground hover:text-primary">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/auth" className="text-muted-foreground hover:text-primary">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Info</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} witherco.xyz. All rights reserved. 
            <span className="block mt-1">Created by WitherCoDev</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
