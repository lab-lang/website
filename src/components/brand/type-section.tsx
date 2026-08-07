import { TypeSample } from '@/components/brand/type-sample'
import { SectionBody, SectionIntro } from '@/components/section'

export function TypeSection() {
  return (
    <section className="border-y border-ink/12 bg-sand/40" id="type">
      <SectionBody className="py-20 lg:py-24">
        <SectionIntro
          className="max-w-2xl"
          kicker="Typography"
          lede="A serif for headlines, a sans-serif for body text and small labels, and a monospace for anything that reads like code."
          ledeClassName="mt-6 max-w-[58ch] text-[16px] leading-[1.7] sm:text-[17px]"
          title="Three typefaces, three jobs."
          titleClassName="text-[clamp(2rem,4.2vw,3.2rem)]"
        />

        <div className="mt-12 rounded-2xl border border-ink/12 bg-shell/60 px-6 sm:px-8">
          <TypeSample
            name="Crimson Pro"
            note="Used for headlines and the wordmark."
            role="Headlines"
            sample="Brand Guidelines for Lab."
            sampleClassName="type-title text-[clamp(1.6rem,3vw,2.1rem)]"
          />
          <TypeSample
            name="Archivo"
            note="Used for paragraphs, and for small uppercase labels like the ones on this page."
            role="Body text"
            sample="A plasmid is a small loop of DNA that carries new instructions into a cell."
            sampleClassName="prose-lab text-[16px] leading-[1.6]"
          />
          <TypeSample
            name="IBM Plex Mono"
            note="Used for code, and anything that reads like a measurement or a filename."
            role="Code"
            sample="4,214 bp · circular · 0 BsaI sites"
            sampleClassName="font-mono text-[15px]"
          />
        </div>
      </SectionBody>
    </section>
  )
}
