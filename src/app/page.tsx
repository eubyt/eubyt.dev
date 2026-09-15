import Image from "next/image";
import { GridIntersection, GridLineH } from "@/components/grid";

export default function Home() {
  return (
    <div className="flex flex-1 justify-center">
      <div className="relative z-20 mt-5 flex w-[92vw] flex-col items-start sm:mt-20 sm:w-[50vw]">
        <div className="relative flex w-full items-center gap-3.5 pt-6 pb-4 sm:gap-6 sm:pt-10 sm:pb-6">
          <GridLineH className="top-0" />
          <GridIntersection corner="top-left" />
          <GridIntersection corner="top-right" />

          <main className="flex w-full flex-col items-start gap-6 py-8">
            <Image
              className="h-5 w-[100px] dark:invert"
              src="/next.svg"
              alt="Next.js logo"
              width={100}
              height={20}
              priority
            />
            <div className="flex flex-col items-start gap-6 text-left">
              <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-foreground">
                To get started, edit the{" "}
                <code className="rounded bg-foreground/6 px-1.5 py-0.5 font-mono text-[0.9em]">
                  page.tsx
                </code>{" "}
                file.
              </h1>
              <p className="max-w-md text-lg leading-8 text-muted-foreground">
                Looking for a starting point or more instructions? Head over to{" "}
                <a
                  href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  className="font-medium text-foreground"
                >
                  Templates
                </a>{" "}
                or the{" "}
                <a
                  href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  className="font-medium text-foreground"
                >
                  Learning
                </a>{" "}
                center.
              </p>
            </div>
            <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
              <a
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:opacity-90 md:w-[158px]"
                href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  className="h-[14px] w-4 dark:invert"
                  src="/vercel.svg"
                  alt="Vercel logomark"
                  width={16}
                  height={14}
                />
                Deploy Now
              </a>
              <a
                className="flex h-12 w-full items-center justify-center rounded-full border border-border px-5 transition-colors hover:bg-muted md:w-[158px]"
                href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </a>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
