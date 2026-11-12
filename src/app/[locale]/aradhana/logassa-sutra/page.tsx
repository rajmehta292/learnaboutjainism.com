import PracticeEntryDraft from "@/components/PracticeEntryDraft";

export const metadata = {
  title: "Logassa Sutra",
  description: "Editorial status for the Logassa Sutra entry.",
  robots: { index: false, follow: true },
};

export default function LogassaSutraPage() {
  return (
    <PracticeEntryDraft
      title="Logassa Sutra"
      description="A hymn associated with praise of the Tirthankaras; this page awaits source-level review of its text and translations."
    />
  );
}
