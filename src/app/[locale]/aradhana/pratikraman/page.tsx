import PracticeEntryDraft from "@/components/PracticeEntryDraft";

export const metadata = {
  title: "Pratikraman",
  description: "Editorial status for the Pratikraman entry.",
  robots: { index: false, follow: true },
};

export default function PratikramanPage() {
  return (
    <PracticeEntryDraft
      title="Pratikraman"
      description="A Jain practice of reflection and atonement with forms that vary by community, lineage, and context."
    />
  );
}
