import { useState } from "react";
import type { FormEvent } from "react";
import { Check, Copy, Mail, Phone, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { SectionShell } from "@/components/ui/SectionShell";
import { getSectionMeta } from "@/data/navigation";
import { profile } from "@/data/profile";
import { useCopyToClipboard } from "@/hooks/useClipboard";

const meta = getSectionMeta("contact");

export function Contact() {
  const { status, copy } = useCopyToClipboard();

  return (
    <SectionShell
      id={meta.id}
      kicker={meta.index}
      label={meta.label}
      title="Let's build something"
      description="Internships, collaborations, or a question about one of my projects — my inbox is open."
    >
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Direct channels */}
        <div className="space-y-3">
          <div className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-accent-ink">
              <Mail size={18} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] uppercase tracking-wider text-faint">Email</p>
              <a
                href={`mailto:${profile.email}`}
                className="block truncate text-sm text-ink transition-colors hover:text-accent-ink"
              >
                {profile.email}
              </a>
            </div>
            <button
              type="button"
              onClick={() => void copy(profile.email)}
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-line px-3 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors hover:border-accent hover:text-accent-ink"
              aria-label={`Copy email address. Current status: ${status === "copied" ? "copied" : status === "failed" ? "copy failed" : "idle"}`}
            >
              {status === "copied" ? (
                <>
                  <Check size={13} className="text-accent-ink" aria-hidden="true" /> Copied
                </>
              ) : status === "failed" ? (
                <>
                  <Copy size={13} aria-hidden="true" /> Copy failed
                </>
              ) : (
                <>
                  <Copy size={13} aria-hidden="true" /> Copy
                </>
              )}
            </button>
          </div>

          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-strong"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-accent-ink">
              <GithubIcon size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] uppercase tracking-wider text-faint">GitHub</p>
              <p className="truncate text-sm text-ink group-hover:text-accent-ink">@jahinhasan</p>
            </div>
          </a>

          <a
            href={profile.phoneHref}
            className="group flex items-center gap-4 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-strong"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-accent-ink">
              <Phone size={18} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] uppercase tracking-wider text-faint">Phone</p>
              <p className="truncate text-sm text-ink group-hover:text-accent-ink">{profile.phoneDisplay}</p>
            </div>
          </a>

          {profile.linkedin ? (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-strong"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-accent-ink">
                <LinkedinIcon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[11px] uppercase tracking-wider text-faint">LinkedIn</p>
                <p className="truncate text-sm text-ink group-hover:text-accent-ink">{profile.linkedin}</p>
              </div>
            </a>
          ) : null}
        </div>

        {/* Mailto composer — honest about what it does */}
        <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
          <h3 className="font-display text-base font-semibold text-ink">Write a message</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            This form has no server — it opens <strong className="text-ink">your own email app</strong>{" "}
            with the message pre-filled, addressed to me. Nothing is sent until you hit send there.
          </p>
          <MailtoForm />
        </div>
      </div>
    </SectionShell>
  );
}

function MailtoForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact — ${name.trim() || "hello"}`);
    const body = encodeURIComponent(`${message.trim()}\n\n— ${name.trim() || "a visitor"}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const inputClasses =
    "w-full rounded-lg border border-line bg-raised/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-accent focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div>
        <label htmlFor="contact-name" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-faint">
          Your name
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          autoComplete="name"
          className={inputClasses}
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1.5 block font-mono text-[11px] uppercase tracking-wider text-faint">
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hi Jahin — we're hiring an intern for…"
          rows={5}
          required
          className={`${inputClasses} resize-y`}
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
      >
        <Send size={15} aria-hidden="true" />
        Open in email app
      </button>
    </form>
  );
}
