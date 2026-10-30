import { useState } from "react";
import type { FormEvent } from "react";
import { Check, Copy, Phone, Send } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { SectionShell } from "@/components/ui/SectionShell";
import { getSectionMeta } from "@/data/navigation";
import { profile } from "@/data/profile";
import { useCopyToClipboard } from "@/hooks/useClipboard";
import { cn } from "@/lib/cn";

const meta = getSectionMeta("contact");

export function Contact() {
  const { status, copy } = useCopyToClipboard();

  return (
    <SectionShell
      id={meta.id}
      kicker={meta.index}
      label={meta.label}
      title="Have a project in mind?"
      description="Freelance work, collaborations, or a question about one of my projects — my inbox is open."
    >
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          {/* The email address IS the composition */}
          <a
            href={`mailto:${profile.email}`}
            className="group inline-block max-w-full"
            aria-label={`Email ${profile.name}`}
          >
            <span
              className={cn(
                "display-section block text-ink transition-colors group-hover:text-accent-ink",
                "text-[clamp(1.35rem,4.6vw,2.9rem)]",
              )}
            >
              <span className="whitespace-nowrap">{profile.email.split("@")[0]}@</span>
              <wbr />
              <span className="whitespace-nowrap">{profile.email.split("@")[1]}</span>
            </span>
            <span
              aria-hidden="true"
              className="mt-2 block h-1 w-full origin-left scale-x-100 bg-accent transition-transform duration-300 group-hover:scale-x-0 motion-reduce:transition-none"
            />
          </a>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void copy(profile.email)}
              className="inline-flex h-10 items-center gap-2 border border-line-strong px-4 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:border-accent hover:text-accent-ink"
              aria-label={`Copy email address. Current status: ${status === "copied" ? "copied" : status === "failed" ? "copy failed" : "idle"}`}
            >
              {status === "copied" ? (
                <>
                  <Check size={14} className="text-accent-ink" aria-hidden="true" /> Copied
                </>
              ) : status === "failed" ? (
                <>
                  <Copy size={14} aria-hidden="true" /> Copy failed
                </>
              ) : (
                <>
                  <Copy size={14} aria-hidden="true" /> Copy email
                </>
              )}
            </button>
            <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-faint">
              <span className="relative flex size-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping bg-accent opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 bg-accent" />
              </span>
              {profile.availability}
            </p>
          </div>

          <ul className="mt-10 space-y-0 border-t border-line">
            <ChannelRow href={profile.github} external label="GitHub" value="@jahinhasan">
              <GithubIcon size={16} />
            </ChannelRow>
            {profile.linkedin ? (
              <ChannelRow href={profile.linkedin} external label="LinkedIn" value={profile.linkedin}>
                <LinkedinIcon size={16} />
              </ChannelRow>
            ) : null}
            <ChannelRow href={profile.phoneHref} label="Phone" value={profile.phoneDisplay}>
              <Phone size={16} aria-hidden="true" />
            </ChannelRow>
          </ul>
        </div>

        {/* Mailto composer — honest about what it does */}
        <div className="border border-line-strong bg-surface p-5 shadow-hard sm:p-6">
          <h3 className="font-display text-base uppercase text-ink">Write a message</h3>
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

function ChannelRow({
  href,
  label,
  value,
  external = false,
  children,
}: {
  href: string;
  label: string;
  value: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li className="border-b border-line">
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex items-center gap-4 py-4 transition-colors"
      >
        <span className="text-accent-ink" aria-hidden="true">
          {children}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-wider text-faint">{label}</span>
        <span className="ml-auto truncate font-mono text-sm text-ink transition-colors group-hover:text-accent-ink">
          {value}
        </span>
      </a>
    </li>
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
    "w-full border border-line bg-raised/60 px-3.5 py-2.5 text-sm text-ink placeholder:text-faint focus:border-accent focus:outline-none";

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
          placeholder="Hi Jahin — I have a project in mind…"
          rows={5}
          required
          className={`${inputClasses} resize-y`}
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-10 items-center gap-2 bg-accent px-4 text-sm font-medium text-accent-fg transition-transform hover:-translate-y-0.5"
      >
        <Send size={15} aria-hidden="true" />
        Open in email app
      </button>
    </form>
  );
}
