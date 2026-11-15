import { Link } from "@/i18n/routing";

const stages = [
  {
    number: "01",
    title: "Receive",
    text: "A reader sends a correction, source concern, access barrier, or suggestion. The form does not ask for an account or email address.",
    record: "Saved in the librarian feedback inbox and linked to a GitHub issue.",
  },
  {
    number: "02",
    title: "Triage",
    text: "Check the report, find the page or passage, look for duplicates, and decide whether it needs research, an edit, or an accessibility fix.",
    record: "Set New, Triaged, In progress, Resolved, or Dismissed; leave a staff note.",
  },
  {
    number: "03",
    title: "Assign",
    text: "Give one librarian a clear next action. A second editor can take over or check the work; record decisions where the team can find them.",
    record: "Assignment and every status change are saved with the editor and date.",
  },
  {
    number: "04",
    title: "Check sources",
    text: "Compare each claim with a named source, edition, and page, section, or verse. Record the relevant tradition when accounts differ.",
    record: "Source links, locators, reviewer role, and review note stay with the page.",
  },
  {
    number: "05",
    title: "Revise and check again",
    text: "Save a working copy, explain what changed, and ask another editor to read the revised page when the change needs a second view.",
    record: "Drafts, notes, and prior versions remain in the page history.",
  },
  {
    number: "06",
    title: "Publish and close the loop",
    text: "Publish only after the source checklist and page review are complete. Resolve the feedback entry when the requested change is addressed or explained.",
    record: "The public page, sitemap status, review record, and GitHub issue show the final state.",
  },
];

export default function ReviewWorkflow() {
  return (
    <>
      <div className="admin-section-heading"><div><p className="eyebrow">LIBRARIAN HANDBOOK</p><h2>Review workflow</h2><p>Use the same steps for every topic and reader report so the team can see what happened and what comes next.</p></div></div>
      <ol className="workflow-timeline">
        {stages.map((stage) => <li className="workflow-step" key={stage.number}>
          <span className="workflow-step__number">{stage.number}</span>
          <div className="workflow-step__content"><h3>{stage.title}</h3><p>{stage.text}</p><div><strong>Keep a record</strong><span>{stage.record}</span></div></div>
        </li>)}
      </ol>
      <div className="admin-overview-grid workflow-actions">
        <section className="admin-card"><p className="eyebrow">START WITH A REPORT</p><h3>Read the inbox one entry at a time.</h3><p>Assign an owner, write down the next action, and update the status when the work moves.</p><Link className="button button--primary" href="/admin/feedback">Open feedback inbox →</Link></section>
        <section className="admin-card"><p className="eyebrow">START WITH AN ARTICLE</p><h3>Work through the source checklist.</h3><p>Keep the draft and evidence together so another librarian can continue the review.</p><Link className="button button--quiet" href="/admin/review">Open review center →</Link></section>
      </div>
      <aside className="workflow-privacy"><strong>Public and private records</strong><p>Reader reports are public GitHub issues and appear in the repository feedback ledger. Librarian assignments, staff notes, and private reader account notes stay in the Cloudflare editorial database. Do not put reader account notes or personal contact details in a public issue.</p></aside>
    </>
  );
}
