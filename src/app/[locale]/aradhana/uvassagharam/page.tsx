import PracticeEntryDraft from "@/components/PracticeEntryDraft";

export const metadata = {
  title: "Uvasaggaharam Stotra",
  description: "Editorial status for the Uvasaggaharam Stotra entry.",
  robots: { index: false, follow: true },
};

export default function UvassagharamPage() {
  return (
    <PracticeEntryDraft
      title="Uvasaggaharam Stotra"
      description="A devotional stotra associated with Pārśvanātha; its text and interpretations need source-level review."
    />
  );
}
