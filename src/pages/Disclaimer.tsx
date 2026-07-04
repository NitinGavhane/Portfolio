import LegalPage from '../components/LegalPage';
import { siteConfig } from '../lib/siteConfig';

const Disclaimer = () => (
  <LegalPage
    title="Disclaimer"
    description="Disclaimer for the information and advertising presented on nitingavhane.com."
    path="/disclaimer"
    updated="July 4, 2026"
  >
    <p>
      The information provided by {siteConfig.brand} on {siteConfig.url} is for general
      informational purposes only. All information is provided in good faith; however, we make no
      representation or warranty of any kind regarding the accuracy, adequacy, validity, reliability,
      or completeness of any information on the site.
    </p>

    <h2>Professional Disclaimer</h2>
    <p>
      The site cannot and does not contain professional advice. Technical, security, and business
      content is provided for general informational and educational purposes and is not a substitute
      for professional consultation. Always seek the advice of a qualified professional before acting
      on any information found here.
    </p>

    <h2>External Links Disclaimer</h2>
    <p>
      This site may contain links to other websites or content belonging to or originating from
      third parties. We do not investigate, monitor, or check such external links for accuracy or
      reliability, and are not responsible for their content.
    </p>

    <h2>Advertising Disclaimer</h2>
    <p>
      This site displays advertisements served by Google AdSense and may contain affiliate links.
      Advertisements are selected by third-party networks and do not constitute an endorsement by
      {' '}
      {siteConfig.name}.
    </p>

    <h2>Contact</h2>
    <p>
      Questions about this disclaimer? Email{' '}
      <a href={`mailto:${siteConfig.author.email}`}>{siteConfig.author.email}</a>.
    </p>
  </LegalPage>
);

export default Disclaimer;
