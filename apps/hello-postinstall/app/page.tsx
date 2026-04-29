import type { Metadata } from "next";
import { InstallTabs } from "@/components/install-tabs";
import { OWASP_URL, PACKAGE_NAME, REPO_URL, SITE_URL } from "@/lib/utils";

const PAGE_TITLE = "hello-postinstall";
const PAGE_DESCRIPTION =
  "A tiny npm package to demonstrate why running install scripts from untrusted packages is risky";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: PACKAGE_NAME,
    description: PAGE_DESCRIPTION,
    codeRepository: REPO_URL,
    programmingLanguage: "JavaScript",
    runtimePlatform: "Node.js",
    license: "https://opensource.org/licenses/MIT",
    url: SITE_URL,
    author: {
      "@type": "Person",
      name: "Mark Miro",
      url: "https://github.com/markmiro",
    },
  };

  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col gap-8 px-6 py-16 sm:py-24">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="flex flex-col gap-3">
        <h1 className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
          {PACKAGE_NAME}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          {PAGE_DESCRIPTION}
        </p>
      </header>

      <section aria-labelledby="install-heading" className="flex flex-col gap-3">
        <h2
          id="install-heading"
          className="text-sm font-medium tracking-wide text-muted-foreground uppercase"
        >
          Install
        </h2>
        <InstallTabs />
      </section>

      <section aria-labelledby="security-heading" className="flex flex-col gap-3">
        <h2
          id="security-heading"
          className="text-sm font-medium tracking-wide text-muted-foreground uppercase"
        >
          Security
        </h2>
        <p className="text-base leading-relaxed">
          Installing this package runs its <code className="font-mono">postinstall</code>{" "}
          script, which makes a network request. That is the point of the demo —
          and also the reason OWASP recommends ignoring run scripts on install.
        </p>
        <p className="text-base leading-relaxed">
          <a
            href={OWASP_URL}
            className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
            rel="noopener external"
          >
            Read OWASP NPM Security Cheat Sheet — #3 Minimize attack surfaces by
            ignoring run scripts &rarr;
          </a>
        </p>
      </section>

      <footer className="mt-auto pt-8 text-sm text-muted-foreground">
        <p>
          MIT licensed. Source on{" "}
          <a
            href={REPO_URL}
            className="underline underline-offset-4 hover:no-underline"
            rel="noopener external"
          >
            GitHub
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
