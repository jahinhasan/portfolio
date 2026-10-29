import { Mail } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-5 text-center sm:flex-row sm:px-8 sm:text-left">
        <p className="text-xs text-faint">
          © {new Date().getFullYear()} {profile.name} · Built with React, TypeScript & Tailwind CSS
        </p>
        <div className="flex items-center gap-4 text-faint">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile (opens in new tab)"
            className="transition-colors hover:text-accent"
          >
            <GithubIcon size={16} />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Send an email"
            className="transition-colors hover:text-accent"
          >
            <Mail size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
