import { render, renderHook, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach } from "vitest";
import { PreferencesProvider } from "@/features/customization/PreferencesContext";
import { usePreferences } from "@/features/customization/usePreferences";
import { STORAGE_KEY, loadPreferences } from "@/features/customization/preferences";
import { defaultProjectOrder } from "@/data/projects";
import { defaultSectionOrder } from "@/data/navigation";
import { applyAccent, applyDocumentTheme } from "@/features/customization/applyTheme";

function useProbe(): ReturnType<typeof usePreferences> {
  return usePreferences();
}

function renderProvider() {
  const initial = loadPreferences();
  applyDocumentTheme(initial.preferences.theme);
  applyAccent(initial.preferences.accent);
  return renderHook(() => useProbe(), {
    wrapper: ({ children }) => (
      <PreferencesProvider initial={initial}>{children}</PreferencesProvider>
    ),
  });
}

describe("PreferencesProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts from defaults when storage is empty", () => {
    const { result } = renderProvider();
    expect(result.current.preferences.theme).toBe("dark");
    expect(result.current.persisted).toBe(false);
  });

  it("setTheme updates state, the DOM attribute, and persists", async () => {
    const { result } = renderProvider();
    act(() => result.current.setTheme("light"));
    await waitFor(() => expect(result.current.preferences.theme).toBe("light"));
    expect(document.documentElement.dataset.theme).toBe("light");
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
    expect(stored.theme).toBe("light");
  });

  it("setAccent updates the CSS variable with a readable foreground", async () => {
    const { result } = renderProvider();
    act(() => result.current.setAccent("#fbbf24")); // amber — needs dark text
    await waitFor(() => expect(result.current.preferences.accent).toBe("#fbbf24"));
    expect(document.documentElement.style.getPropertyValue("--accent")).toBe("#fbbf24");
    expect(document.documentElement.style.getPropertyValue("--accent-fg")).toBe("#101014");
  });

  it("moveSection reorders and navigation order follows", async () => {
    const { result } = renderProvider();
    const firstDefault = result.current.preferences.sectionOrder[0];
    act(() => result.current.moveSection(1, 0));
    await waitFor(() => expect(result.current.preferences.sectionOrder[0]).not.toBe(firstDefault));
    expect(result.current.preferences.sectionOrder).toHaveLength(10);
  });

  it("moveProject reorders the full catalog", async () => {
    const { result } = renderProvider();
    const before = result.current.preferences.projectOrder;
    act(() => result.current.moveProject(5, 0));
    const after = result.current.preferences.projectOrder;
    expect(after[0]).toBe(before[5]);
    expect(after).toHaveLength(before.length);
  });

  it("setProjectFeatured toggles are stored and win over data defaults", async () => {
    const { result } = renderProvider();
    act(() => result.current.setProjectFeatured("pdf-merger-tool", true));
    await waitFor(() =>
      expect(result.current.preferences.featuredOverrides["pdf-merger-tool"]).toBe(true),
    );
  });

  it("resetSectionOrder restores the canonical order", async () => {
    const { result } = renderProvider();
    act(() => result.current.moveSection(0, 8));
    act(() => result.current.resetSectionOrder());
    await waitFor(() => expect(result.current.preferences.sectionOrder[0]).toBe("hero"));
  });

  it("resetAll clears storage and restores defaults", async () => {
    const { result } = renderProvider();
    act(() => {
      result.current.setTheme("light");
      result.current.moveSection(0, 3);
    });
    act(() => result.current.resetAll());
    await waitFor(() => expect(result.current.preferences.theme).toBe("dark"));
    expect(result.current.persisted).toBe(false);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});

describe("customization panel interactions (light DOM integration)", () => {
  function PanelProbe() {
    const { preferences, setTheme } = usePreferences();
    return (
      <div>
        <span data-testid="theme">{preferences.theme}</span>
        <button onClick={() => setTheme("light")}>go light</button>
      </div>
    );
  }

  it("clicking a control updates rendered output and storage", async () => {
    const user = userEvent.setup();
    const initial = loadPreferences();
    render(
      <PreferencesProvider initial={initial}>
        <PanelProbe />
      </PreferencesProvider>,
    );
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    await user.click(screen.getByText("go light"));
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)!).theme).toBe("light");
  });
});

describe("project filtering + ordering persistence round-trip", () => {
  it("a reordered catalog survives save → load → validate", () => {
    const { result } = renderHook(() => useProbe(), {
      wrapper: ({ children }) => {
        const initial = loadPreferences();
        return (
          <PreferencesProvider initial={initial}>{children}</PreferencesProvider>
        );
      },
    });
    act(() => result.current.moveProject(0, 7));
    act(() => result.current.moveSection(2, 0));
    const stored = window.localStorage.getItem(STORAGE_KEY)!;
    // Simulate a reload.
    const reloaded = loadPreferences();
    expect(JSON.parse(stored)).toEqual(reloaded.preferences);
    expect(reloaded.persisted).toBe(true);
    expect(reloaded.preferences.projectOrder[7]).toBe(defaultProjectOrder[0]); // default index 0 moved to 7
    expect(reloaded.preferences.sectionOrder[0]).toBe(defaultSectionOrder[2]); // index 2 moved to 0
  });
});
