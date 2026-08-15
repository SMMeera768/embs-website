# Work Log

## Friday, August 14, 2026

1. Fixed the CORS config on the API so the site can move to Vercel. [backend] The old check was `origin.endsWith('.netlify.app')`, which meant every single API call from a `.vercel.app` domain would have been blocked. Rewrote it to parse the hostname properly and allow vercel.app, netlify.app, localhost, and anything listed in CLIENT_URL. Also swapped the rejection path from throwing an Error (which surfaced as a confusing 500) to returning false, so the browser reports a normal CORS failure. Wrote 12 test cases against it including suffix spoofing like `vercel.app.attacker.io`.

2. Added `vercel.json` and `.vercelignore` for the static deploy. [frontend] The ignore file matters more than it looks, without it Vercel would upload the entire `backend/` folder including its committed node_modules. Config sets security headers, long cache on images, no cache on HTML, and a rewrite so `/admin` resolves.

3. Renamed the two asset paths that had spaces in them. [frontend] `bg image embs/` became `bg-image-embs/` and `EMBS logo.png` became `embs-logo.png`. Spaces in URLs work most of the time but they are a known source of trouble on static hosts and proxies. Updated all 11 files that referenced them.

4. Fixed the mobile navbar, which was broken between 640px and 900px. [frontend] The hamburger only appeared below 640px, so on tablets and landscape phones the five desktop nav links were crammed against the logo with zero gap. At 700px the "Home" pill was physically overlapping the brand text and "IEEE EMBS" was wrapping onto two lines. Moved the breakpoint to 900px. Measured every page at 13 widths before and after to confirm.

5. Cleaned up three stacked "critical fix" media queries at the bottom of navbar.css. [frontend] They were fighting each other. The hamburger sat on the left below 640px but on the right above it, and the drawer background was forced to 97% opacity, which was just transparent enough for the bright hero headline to ghost through the menu. Consolidated everything into the single 900px block with a solid background.

6. Bumped the hamburger to a 44px square and the dropdown items to 44px tall. [frontend] They were 30x24 and 39px, both under the comfortable touch target minimum.

7. Built out `project.html`, which had been an empty stub since the first commit. [frontend] It is now a single project detail page that reads `?id=` from the URL. Wired the "View Details" button on the projects grid to actually point at it, it was going to `href="#"` before.

8. Fixed a three way schema mismatch on projects. [backend] [frontend] The public page was reading `category`, `status`, `mentor`, `teamMembers`, `githubLink` and `paperLink`, the admin panel was sending `repoUrl`, `liveUrl` and stuffing the category into `tags`, and the Mongoose model had none of those fields so Mongoose was silently dropping them. Net effect was that the category filter chips could never match anything. Extended the model, fixed the frontend field names, and added a slug normaliser so "AI in Healthcare" matches the `ai-healthcare` chip. Verified all 8 categories filter correctly, including old records that stored the category in tags.

9. Wrote `backend/seedContent.js` for demo content. [backend] Deliberately did not touch the existing `seed.js` for this because that one calls deleteMany on Users, Events and Members, so running it against the live database would destroy the admin account and the real member records. The new script only inserts into collections that are already empty, and it is a dry run unless you pass `--apply`. Seeds 18 records across blogs, podcasts, projects, achievements and announcements.

10. Added a guard to `seed.js` so it refuses to run without `--force`. [backend] It is wired to `npm run seed`, which is far too easy to type for something that wipes the database with no confirmation.

11. Added the junk event cleanup to the same script. [backend] There were three duplicate "BioTech Innovation Summit" records with keyboard mash descriptions, left over from testing the admin panel back in July. The script deletes them by id but re-checks the title and description first, so it will skip rather than delete the wrong record if the data has changed since.

12. SEO pass across all 12 public pages. [frontend] Every single one was missing a meta description, Open Graph tags and Twitter card tags. Added per page descriptions written for each page rather than one generic blurb, so link previews and search results are actually useful.

13. Accessibility pass. [frontend] Added a skip to content link on all 13 pages, added `<main>` landmarks to index, about and events which had none at all, added aria-expanded and aria-controls state to the hamburger and dropdown arrows, wired up Escape to close the menu, and added focus-visible outlines plus a prefers-reduced-motion block.

14. Fixed a nav behaviour bug found while doing the ARIA work. [frontend] My first pass had every dropdown label toggle its submenu on mobile instead of navigating, which would have left `activities.html` unreachable on phones since it is not repeated inside its own dropdown. Changed it so labels pointing at a real page still navigate and only the chevron toggles. "Community" is the exception since its href is `javascript:void(0)`, so its label has to act as the toggle.

15. Fixed navbar contrast on the six light background pages. [frontend] About, activities, projects, blog, gallery and members all have a white section directly under the navbar. The bar is translucent dark, so over white it composited to mid grey and the light nav text dropped to roughly 3.6:1 for the brand title and 1.8:1 for the subtitle, both below WCAG AA. Raised the glass background to 85% and the subtitle alpha to 0.72. Measured the actual rendered pixels afterwards, everything now sits between 5.1:1 and 16.2:1.

16. Wrote the README. [frontend] [backend] Covers the architecture, local setup, a step by step Vercel deploy walkthrough, the full environment variable table, how the CORS allowlist decides what gets through, and a troubleshooting section. Also added `backend/.env.example` so there is a documented template to copy.
