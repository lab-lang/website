import { SectionBody } from '@/components/section'

export function HeroSection() {
  return (
    <section className="agar-wash relative overflow-hidden" id="intro">
      <SectionBody className="pb-16 pt-14 sm:pt-16 lg:pb-24 lg:pt-20">
        <div className="flex items-center gap-2.5">
          <span className="size-1.5 rounded-full bg-amber ring-3 ring-amber/25" />
          <span className="micro text-amber-deep">Brand</span>
        </div>

        <div>
          <h1 className="type-display mt-6 max-w-[38ch] text-pretty text-[clamp(2.2rem,5vw,4rem)]">
            Brand Guidelines for Lab.
          </h1>
        </div>

        <div>
          <p className="type-deck mt-7 max-w-[42em] text-pretty text-[clamp(1.05rem,1.6vw,1.4rem)] text-ink/78">
            Lab is a compiler toolchain that turns experiments described in Lab
            or Python into work a laboratory can run. Its mark is the
            language&rsquo;s own punctuation: an equals sign, and under it the
            arrow that commits a program to the physical world. Lab draws a hard
            line between work that may be re-run and work that may not, and
            those two marks are where the line falls. This page covers the mark,
            the colors, and the type, for anyone writing or building about Lab.
          </p>
        </div>
      </SectionBody>
    </section>
  )
}
