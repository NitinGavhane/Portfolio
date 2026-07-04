import LegalPage from '../components/LegalPage';
import { siteConfig } from '../lib/siteConfig';

const PrivacyPolicy = () => (
  <LegalPage
    title="Privacy Policy"
    description="How nitingavhane.com collects, uses, and protects your information, including the use of cookies and Google AdSense."
    path="/privacy-policy"
    updated="July 4, 2026"
  >
    <p>
      This Privacy Policy explains how {siteConfig.brand} (“we”, “us”, or “the site”) collects,
      uses, and safeguards information when you visit {siteConfig.url}. By using this website, you
      consent to the practices described below.
    </p>

    <h2>Information We Collect</h2>
    <p>We collect two categories of information:</p>
    <ul>
      <li>
        <strong>Information you provide.</strong> When you use the contact form or book a call, you
        may submit your name, email address, phone number, and message. This is used solely to
        respond to your enquiry.
      </li>
      <li>
        <strong>Information collected automatically.</strong> Like most websites, we and our service
        providers collect standard log data such as your browser type, device, approximate location,
        pages viewed, and referring URLs through cookies and similar technologies.
      </li>
    </ul>

    <h2>Cookies</h2>
    <p>
      Cookies are small text files stored on your device. We use them to remember your preferences
      (such as light/dark theme and your cookie choice) and, with your consent, to serve and measure
      advertising. You can disable cookies in your browser settings, though some features may not
      work as intended.
    </p>

    <h2>Google AdSense &amp; Third-Party Advertising</h2>
    <p>
      This site displays ads served by Google AdSense. Third-party vendors, including Google, use
      cookies to serve ads based on your prior visits to this and other websites.
    </p>
    <ul>
      <li>
        Google’s use of advertising cookies enables it and its partners to serve ads to you based on
        your visits to this site and/or other sites on the Internet.
      </li>
      <li>
        You may opt out of personalised advertising by visiting{' '}
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
          Google Ads Settings
        </a>
        .
      </li>
      <li>
        You can also opt out of third-party vendor cookies at{' '}
        <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
          aboutads.info/choices
        </a>{' '}
        and{' '}
        <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">
          optout.networkadvertising.org
        </a>
        .
      </li>
    </ul>
    <p>
      For more information on how Google uses data, see Google’s{' '}
      <a
        href="https://policies.google.com/technologies/partner-sites"
        target="_blank"
        rel="noopener noreferrer"
      >
        Privacy &amp; Terms
      </a>
      .
    </p>

    <h2>Third-Party Services</h2>
    <p>We rely on the following processors, each with its own privacy policy:</p>
    <ul>
      <li>Google AdSense — advertising</li>
      <li>EmailJS — delivery of contact-form messages</li>
      <li>Supabase — content and booking storage</li>
    </ul>

    <h2>How We Use Information</h2>
    <ul>
      <li>To respond to enquiries and scheduled calls.</li>
      <li>To operate, maintain, and improve the website.</li>
      <li>To display relevant advertising and understand site usage.</li>
    </ul>

    <h2>Your Rights (GDPR &amp; CCPA)</h2>
    <p>
      Depending on your location, you may have the right to access, correct, or delete your personal
      data, to object to or restrict processing, and to opt out of the sale of personal information.
      To exercise any of these rights, contact us using the details below.
    </p>

    <h2>Data Retention &amp; Security</h2>
    <p>
      We retain personal information only as long as necessary for the purposes described here and
      apply reasonable safeguards to protect it. No method of transmission over the Internet is
      completely secure, however, and we cannot guarantee absolute security.
    </p>

    <h2>Children’s Privacy</h2>
    <p>
      This site is not directed to children under 13, and we do not knowingly collect personal
      information from them.
    </p>

    <h2>Changes to This Policy</h2>
    <p>
      We may update this Privacy Policy from time to time. Changes are effective when posted on this
      page with a revised “Last updated” date.
    </p>

    <h2>Contact</h2>
    <p>
      Questions about this policy? Email{' '}
      <a href={`mailto:${siteConfig.author.email}`}>{siteConfig.author.email}</a>.
    </p>
  </LegalPage>
);

export default PrivacyPolicy;
