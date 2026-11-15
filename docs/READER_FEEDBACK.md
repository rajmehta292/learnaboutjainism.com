# Reader feedback

The “Suggest a correction or accessibility fix” link opens the public GitHub reader-feedback form. Submitting it creates a public issue, and the `Record reader feedback` workflow copies the report into [`reader-feedback.csv`](reader-feedback.csv) on `main`.

The CSV records the issue number and dates, feedback type, page URL, report text, supporting context, public issue URL, and issue state. Editing or reopening a feedback issue updates its existing row instead of adding a duplicate. The file can be opened in spreadsheet software.

The repository and issue tracker are public. The form tells visitors that their report will be public and asks them not to include personal, medical, or other private information. GitHub requires an account to submit the form.

The workflow uses the repository’s short-lived `GITHUB_TOKEN` with `contents: write` to commit the CSV update. It does not require a personal access token or a new Cloudflare secret. Repository Actions settings must allow the workflow token to write repository contents.
