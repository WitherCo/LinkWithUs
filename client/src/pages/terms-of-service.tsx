import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using witherco.xyz, you agree to be bound by these Terms of Service. If you do not 
          agree to all the terms and conditions, you may not access or use our services.
        </p>
        
        <h2>2. Description of Service</h2>
        <p>
          witherco.xyz provides a link-in-bio service that allows users to create a customizable page containing 
          multiple links that can be shared through a single URL. The service includes account creation, link 
          management, and profile customization features.
        </p>
        
        <h2>3. Account Registration</h2>
        <p>
          To use certain features of our service, you must register for an account. You agree to provide accurate, 
          current, and complete information during the registration process and to update such information to keep 
          it accurate, current, and complete.
        </p>
        
        <h2>4. User Conduct</h2>
        <p>You agree not to use witherco.xyz to:</p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe the rights of others, including intellectual property rights</li>
          <li>Distribute harmful, offensive, or inappropriate content</li>
          <li>Engage in any activity that interferes with or disrupts the service</li>
          <li>Attempt to gain unauthorized access to any portion of the service</li>
          <li>Use the service for any illegal or unauthorized purpose</li>
        </ul>
        
        <h2>5. User Content</h2>
        <p>
          Users are solely responsible for the content they share through the service, including links to external 
          websites. We do not endorse or take responsibility for any third-party content linked through our platform. 
          We reserve the right to remove any content that violates these Terms of Service or that we find objectionable.
        </p>
        
        <h2>6. Intellectual Property</h2>
        <p>
          The service and its original content, features, and functionality are owned by witherco.xyz and are protected 
          by international copyright, trademark, patent, trade secret, and other intellectual property laws.
        </p>
        
        <h2>7. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, witherco.xyz and its affiliates shall not be liable for any indirect, 
          incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred 
          directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
        </p>
        <ul>
          <li>Your access to or use of or inability to access or use the service</li>
          <li>Any conduct or content of any third party on the service</li>
          <li>Any content obtained from the service</li>
          <li>Unauthorized access, use, or alteration of your transmissions or content</li>
        </ul>
        
        <h2>8. Modification of Service</h2>
        <p>
          We reserve the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) 
          with or without notice. We shall not be liable to you or to any third party for any modification, suspension, 
          or discontinuance of the service.
        </p>
        
        <h2>9. Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, 
          including without limitation if you breach the Terms. Upon termination, your right to use the service will 
          immediately cease.
        </p>
        
        <h2>10. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide 
          notice of any changes by posting the new Terms on this page. Your continued use of the service after any such 
          changes constitutes your acceptance of the new Terms.
        </p>
        
        <h2>11. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which 
          witherco.xyz operates, without regard to its conflict of law provisions.
        </p>
        
        <h2>12. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at <a href="mailto:wither@witherco.xyz" className="text-primary hover:underline">wither@witherco.xyz</a>.
        </p>
        
        <p className="text-muted-foreground mt-8">Last Updated: April 29, 2025</p>
      </div>
    </div>
  );
}