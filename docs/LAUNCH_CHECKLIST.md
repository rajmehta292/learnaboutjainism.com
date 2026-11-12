# Launch checklist

## Repository and build

- [ ] Configure a production host that supports the Next.js App Router and Node.js 22.
- [ ] Connect the GitHub repository and deploy the `main` branch.
- [ ] Require the repository workflow to pass for pull requests.
- [ ] Set production environment variables only in the hosting provider's secret manager. No production credentials belong in Git.
- [ ] Confirm the homepage, topic search, article pages, practice pages, locale routing, and static API routes in a preview deployment.
- [ ] Add an error monitor and uptime check after the production URL is available.

## Domain and public claims

- [ ] Configure `learnaboutjainism.com` and `www` in the selected host, then add the provider's DNS records at the domain registrar.
- [ ] Verify DNS resolution and HTTPS from outside the hosting account. A DNS lookup during the initial project review on 2026-11-11 did not resolve `learnaboutjainism.com`; verify the current registrar and nameservers before release.
- [ ] Confirm canonical metadata and social preview cards use the production domain.
- [ ] Be explicit on the live site that the catalogue and supplemental datasets are in editorial review. Do not describe Hindi or Gujarati as translated editions yet.
- [ ] Keep detailed ritual and health-related guidance out of the site until reviewed by qualified people with relevant community, textual, and clinical expertise.

## Before announcing

- [ ] Run `npm ci`, `npm run lint`, `npm run content:audit`, and `npm run build` in CI.
- [ ] Review the content queues and the live page status notices.
- [ ] Check the deployed pages at phone and desktop widths, with keyboard navigation and browser zoom.
- [ ] Publish a contact method for corrections and accessibility reports.
