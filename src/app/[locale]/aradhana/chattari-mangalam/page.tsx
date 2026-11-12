import PracticeEntryDraft from "@/components/PracticeEntryDraft";

export const metadata = {
  title: "Chattari Mangalam",
  description: "Editorial status for the Chattari Mangalam entry.",
  robots: { index: false, follow: true },
};

export default function ChattariMangalamPage() {
  return (
    <PracticeEntryDraft
      title="Chattari Mangalam"
      description="A Jain prayer naming auspicious refuges; its wording and use should be understood within its liturgical context."
    />
  );
}
