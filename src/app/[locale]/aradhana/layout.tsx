import type { Metadata } from "next";
import { Link } from "@/i18n/routing";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function AradhanaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="practice-stage">
      <div className="site-container practice-stage__notice">
        <aside className="practice-notice" role="note" aria-label="Practice context">
          <span>Practice context · Draft material</span>
          <p>
            These pages describe selected observances for orientation. Practices differ across
            communities and individuals. Do not use this material to decide whether or how long to
            fast; it is not medical advice or religious authority.
          </p>
          <Link href="/about-this-library">Read the source and review method <span aria-hidden="true">→</span></Link>
        </aside>
      </div>
      {children}
    </div>
  );
}
