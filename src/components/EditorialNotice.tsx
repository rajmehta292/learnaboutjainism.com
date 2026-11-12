import { Link } from "@/i18n/routing";

export default function EditorialNotice() {
  return (
    <aside className="editorial-notice" role="note" aria-label="Editorial status">
      <span className="editorial-notice__label">Editorial status · Draft</span>
      <p>
        This summary and its tradition notes have not been reviewed claim by claim. Quoted
        passages stay hidden until an edition and exact location can be verified.
      </p>
      <Link href="/about-this-library">How review works</Link>
    </aside>
  );
}
