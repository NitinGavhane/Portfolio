import LegalPage from '../components/LegalPage';
import { siteConfig } from '../lib/siteConfig';

const Terms = () => (
  <LegalPage
    title="Terms of Service"
    description="The terms and conditions governing your use of nitingavhane.com."
    path="/terms"
    updated="July 4, 2026"
  >
    <p>
      These Terms of Service (“Terms”) govern your access to and use of {siteConfig.url}. By using
      this website, you agree to be bound by these Terms. If you do not agree, please do not use the
      site.
    </p>

    <h2>Use of the Site</h2>
    <p>
      You may use this site for lawful, personal, and informational purposes. You agree not to
      misuse the site, attempt to gain unauthorised access, disrupt its operation, or use it in any
      way that could harm the site or its visitors.
    </p>

    <h2>Intellectual Property</h2>
    <p>
      All content on this site — including text, articles, graphics, logos, and code — is owned by
      {' '}
      {siteConfig.name} unless otherwise stated, and is protected by applicable intellectual property
      laws. You may share links to articles, but you may not reproduce substantial portions without
      prior written permission.
    </p>

    <h2>Content &amp; Advice</h2>
    <p>
      Articles and resources are provided for general informational purposes only and do not
      constitute professional advice. See our <a href="/disclaimer">Disclaimer</a> for details.
    </p>

    <h2>Third-Party Links &amp; Advertising</h2>
    <p>
      This site may contain links to third-party websites and displays advertising through Google
      AdSense. We are not responsible for the content, policies, or practices of any third-party
      sites or advertisers.
    </p>

    <h2>Limitation of Liability</h2>
    <p>
      This site is provided “as is” without warranties of any kind. To the fullest extent permitted
      by law, {siteConfig.name} shall not be liable for any damages arising from your use of, or
      inability to use, the site.
    </p>

    <h2>Changes to These Terms</h2>
    <p>
      We may revise these Terms at any time. Continued use of the site after changes are posted
      constitutes acceptance of the revised Terms.
    </p>

    <h2>Contact</h2>
    <p>
      Questions about these Terms? Email{' '}
      <a href={`mailto:${siteConfig.author.email}`}>{siteConfig.author.email}</a>.
    </p>
  </LegalPage>
);

export default Terms;
