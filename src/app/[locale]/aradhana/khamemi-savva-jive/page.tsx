import PracticeEntryDraft from "@/components/PracticeEntryDraft";

export const metadata = {
  title: "Khamemi Savva Jive",
  description: "Editorial status for the Khamemi Savva Jive entry.",
  robots: { index: false, follow: true },
};

export default function KhamemiSavvaJivePage() {
  return (
    <PracticeEntryDraft
      title="Khamemi Savva Jive"
      description="A forgiveness verse whose wording, occasion, and interpretation should be checked against specific community sources."
    />
  );
}
