import PracticeEntryDraft from "@/components/PracticeEntryDraft";

export const metadata = {
  title: "Bhaktamar Stotra",
  description: "Editorial status for the Bhaktamar Stotra entry.",
  robots: { index: false, follow: true },
};

export default function BhaktamarStotraPage() {
  return (
    <PracticeEntryDraft
      title="Bhaktamar Stotra"
      description="A Sanskrit stotra in Jain devotional practice; attribution, textual variants, and translations need review."
    />
  );
}
