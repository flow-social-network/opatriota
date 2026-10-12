import * as React from "react";

export interface DefaultLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  sidebar?: boolean;
}

export const DefaultLayout = ({
  children,
  title,
  description,
  sidebar = true,
}: DefaultLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="max-w-[1400px] mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-semibold">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </header>
      <main className="max-w-[1400px] mx-auto p-4">{children}</main>
    </div>
  );
};