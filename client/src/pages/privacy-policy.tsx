import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <Link href="/">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <h2>Introduction</h2>
        <p>
          At witherco.xyz, we respect your privacy and are committed to protecting your personal data. 
          This Privacy Policy explains how we collect, use, and safeguard your information when you visit 
          our website or use our link-in-bio service.
        </p>
        
        <h2>Information We Collect</h2>
        <p>We collect information that you provide directly to us, including:</p>
        <ul>
          <li>Account information (username, email address, password)</li>
          <li>Profile information (display name, bio, profile picture)</li>
          <li>Links you create and share through our platform</li>
          <li>Usage information and analytics</li>
        </ul>
        
        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Create and manage your account</li>
          <li>Process and display the links you've added</li>
          <li>Communicate with you about our services</li>
          <li>Monitor and analyze usage patterns and trends</li>
        </ul>
        
        <h2>Data Security</h2>
        <p>
          We implement reasonable security measures to protect your personal information from unauthorized 
          access, alteration, disclosure, or destruction. However, no method of transmission over the 
          Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        </p>
        
        <h2>Third-Party Links</h2>
        <p>
          Our service allows you to create links to third-party websites. These linked sites are not 
          under our control, and we are not responsible for the privacy practices or content of these sites. 
          We encourage you to review the privacy policies of any third-party sites you visit.
        </p>
        
        <h2>Data Retention</h2>
        <p>
          We will retain your personal information for as long as your account is active or as needed to 
          provide you with our services. We may also retain and use your information as necessary to comply 
          with legal obligations, resolve disputes, and enforce our agreements.
        </p>
        
        <h2>Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access the personal information we have about you</li>
          <li>Correct inaccurate or incomplete information</li>
          <li>Delete your personal information</li>
          <li>Object to or restrict the processing of your data</li>
          <li>Receive a copy of your data in a structured, machine-readable format</li>
        </ul>
        
        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
          the new Privacy Policy on this page and updating the "Last Updated" date.
        </p>
        
        <h2>Contact Us</h2>
        <p>
          If you have questions or concerns about this Privacy Policy or our data practices, please contact 
          us at <a href="mailto:wither@witherco.xyz" className="text-primary hover:underline">wither@witherco.xyz</a>.
        </p>
        
        <p className="text-muted-foreground mt-8">Last Updated: April 29, 2025</p>
      </div>
    </div>
  );
}