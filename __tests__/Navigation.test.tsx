import { render, screen } from "@testing-library/react";
import Navigation from "@/components/Navigation";
import { BookProvider } from "@/context/BookContext";
import "@testing-library/jest-dom";

// Mock framer-motion to avoid animation issues in Jest
jest.mock("framer-motion", () => ({
  motion: {
    nav: ({ children, className }: { children: React.ReactNode; className: string }) => (
      <nav className={className}>{children}</nav>
    ),
    div: ({ children, className }: { children: React.ReactNode; className: string }) => (
      <div className={className}>{children}</div>
    ),
  },
}));

describe("Navigation", () => {
  it("renders the logo", () => {
    render(
      <BookProvider>
        <Navigation />
      </BookProvider>
    );
    expect(screen.getByText("LUMINA")).toBeInTheDocument();
  });

  it("renders all navigation links with proper aria-labels", () => {
    render(
      <BookProvider>
        <Navigation />
      </BookProvider>
    );

    expect(screen.getByRole("button", { name: /Navigate to Upload/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Navigate to Notes/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Navigate to Quiz/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Navigate to Export/i })).toBeInTheDocument();
  });
});

