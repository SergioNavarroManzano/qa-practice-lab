# QA Practice Lab

A lightweight demo web app built for **Playwright + TypeScript** E2E testing practice, designed to simulate realistic QA tasks.

## Modules

| Module | Testing opportunities |
| --- | --- |
| Authentication | Happy path, invalid login, empty fields, session and logout |
| Request form | Required fields, email validation, boundary values, reset |
| Locator playground | Accessible role, label, ID, class, test ID, radio, checkbox, dynamic visibility |
| Task manager | Create, complete, filter and delete tasks; localStorage persistence |
| Bug Lab | Deliberately incorrect discount boundary condition for bug reports |

### Demo credentials
- **Email:** `qa@test.com`
- **Password:** `Playwright123!`

These credentials are **public and fictitious**. Authentication is simulated client-side; it is not secure and must not be reused in production.

## Run locally

Open `index.html` in your browser or, preferably, run a local HTTP server:

```bash
python -m http.server 8080
```

Navigate to `http://localhost:8080/`.

## Publish for free with GitHub Pages

1. Create a **public** GitHub repository named `qa-practice-lab`.
2. Upload `index.html`, `styles.css`, `app.js` and `README.md` to the root of the repository (or push them with Git).
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Set branch `main`, folder `/(root)` and click **Save**.
6. Your site will be available at `https://YOUR_USERNAME.github.io/qa-practice-lab/` once GitHub publishes it.

This project has no external dependencies or server-side code. GitHub Free supports Pages for public repositories.

## Test isolation notes

- Use Playwright `page.goto('/')` with the published URL as `baseURL`.
- Authentication state is stored in `sessionStorage`.
- Task state is stored in `localStorage` and can be reset using the on-page control.
- Other state is transient.
- No personal data is transmitted, and no real authentication occurs.

## Suggested QA tickets

- `QA-001` Navigate between modules and assert URL/heading.
- `QA-002` Successful login, session and logout.
- `QA-003` Invalid login, including empty field variants.
- `QA-004` Test IDs, roles, labels, radio controls and dynamic details.
- `QA-005` Form validation: invalid email, missing consent, name/description limits.
- `QA-006` Investigate the discount boundary bug and submit a defect report.

## Known intentional defect

In the Bug Lab, the written requirement is *10% discount for totals greater than or equal to €100*. The implementation incorrectly applies the discount only above €100. It is intentionally left unfixed for defect-report exercises.

## License

MIT. Educational demo only.
