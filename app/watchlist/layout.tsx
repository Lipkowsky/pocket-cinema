import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

import Link from "next/link";
import { Suspense } from "react";

export default function WatchlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-10 md:gap-20 items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-4 md:px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>PocketCinema</Link>
            </div>
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>
        </nav>
        <div className="flex flex-col w-full max-w-5xl px-4 sm:px-6 md:px-8 box-border">
          {children}
        </div>
          

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-8 md:py-16 mt-auto">
          <p className="font-bold hover:underline">
            Powered by Piotr Lipkowski
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
