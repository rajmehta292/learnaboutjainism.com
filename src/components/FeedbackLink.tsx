"use client";

import type { MouseEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSiteLocale } from "@/i18n/LocaleProvider";

export default function FeedbackLink({ children, className }: { children: ReactNode; className?: string }) {
  const locale = useSiteLocale();
  const router = useRouter();
  const href = `/${locale}/feedback`;
  function openForm(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    const page = encodeURIComponent(window.location.href);
    router.push(`${href}?page=${page}`);
  }
  return <a className={className} href={href} onClick={openForm}>{children}</a>;
}
