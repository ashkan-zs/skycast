import type { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <main className="app-shell min-h-screen bg-neutral-900 px-4 py-6 text-neutral-0 sm:px-8 lg:px-12 lg:py-10">
      <div className="mx-auto min-h-[calc(100vh-3rem)] w-full max-w-[1440px] lg:min-h-[calc(100vh-5rem)]">
        {children}
      </div>
    </main>
  );
}

export default AppLayout;
