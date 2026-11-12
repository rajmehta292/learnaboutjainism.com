import PracticeEntryDraft from "@/components/PracticeEntryDraft";

export const metadata = {
  title: "Navkar Mantra",
  description: "Editorial status for the Navkar Mantra entry.",
  robots: { index: false, follow: true },
};

export default function NavkarMantraPage() {
  return (
    <PracticeEntryDraft
      title="Navkar Mantra"
      description="A Jain salutation whose wording, transliteration, and interpretations should be read from a specific text and tradition."
    />
  );
}
