"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useSiteLocale } from "@/i18n/LocaleProvider";
import { getMessages } from "@/i18n/messages";

type AccountUser = { email: string; name: string; role: "reader" | "librarian" };

function safeDestination(value: string, locale: string) {
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[\u0000-\u001f\u007f]/.test(value)) {
    return "/" + locale + "/account";
  }
  try {
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin || !/^\/(en|gu|hi)(?:\/|$)/.test(url.pathname)) return "/" + locale + "/account";
    return url.pathname + url.search + url.hash;
  } catch {
    return "/" + locale + "/account";
  }
}

export default function SignInPanel() {
  const locale = useSiteLocale();
  const copy = getMessages(locale).Account;
  const [returnTo, setReturnTo] = useState("/" + locale + "/account");
  const [user, setUser] = useState<AccountUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const errorCode = query.get("error") || "";
    const errorCopy: Record<string, string> = {
      configuration: copy.configurationError,
      database: copy.databaseError,
      cancelled: copy.cancelledError,
      expired: copy.expiredError,
      google: copy.googleError,
      state: copy.stateError,
    };
    fetch("/api/auth/session", { cache: "no-store" })
      .then(async (response) => {
        const value = await response.json();
        if (!response.ok) throw new Error(value.error || copy.genericError);
        setReturnTo(safeDestination(query.get("return_to") || "/" + locale + "/account", locale));
        setError(errorCopy[errorCode] || (errorCode ? copy.genericError : ""));
        setUser(value.user || null);
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : copy.genericError))
      .finally(() => setLoading(false));
  }, [copy, locale]);

  const signInHref = "/api/auth/google/start?return_to=" + encodeURIComponent(returnTo);
  const adminReturn = returnTo === "/en/admin" || returnTo.startsWith("/en/admin/");

  return (
    <main className="account-page" id="main-content">
      <div className="account-wrap">
        <section className="account-signin-card">
          <p className="eyebrow">{copy.title}</p>
          <h1>{copy.signInTitle}</h1>
          <p>{copy.signInIntro}</p>
          {loading ? <p className="account-muted" role="status">{copy.loading}</p> : null}
          {error ? <p className="account-alert" role="alert">{error}</p> : null}
          {!loading && user ? (
            <div className="account-signed-in">
              <p><strong>{copy.signedInAs}</strong> {user.name || user.email}</p>
              {adminReturn && user.role !== "librarian"
                ? <p className="account-alert">{copy.librarianDenied}</p>
                : <a className="button button--primary" href={returnTo}>{adminReturn ? copy.openWorkspace : copy.returnToAccount}</a>}
            </div>
          ) : !loading ? (
            <a className="button button--primary account-google-button" href={signInHref}>
              {copy.googleButton}
            </a>
          ) : null}
          <p className="account-privacy">{copy.googlePrivacy}</p>
          <p className="account-signin-back"><Link href="/account">{copy.returnToAccount}</Link></p>
        </section>
      </div>
    </main>
  );
}
