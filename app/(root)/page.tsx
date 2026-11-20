import { Hero } from "@/components/landing/hero";
import { TrustStrip } from "@/components/landing/trust-strip";
import { WhyAngelitos } from "@/components/landing/why-angelitos";
import { Grades } from "@/components/landing/grades";
import { ADayWithUs } from "@/components/landing/a-day-with-us";
import { Gallery } from "@/components/landing/gallery";
import { Admissions } from "@/components/landing/admissions";
import { Contact } from "@/components/landing/contact";
import { WhatsAppFloat } from "@/components/landing/whatsapp-float";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-background">
      <Hero />
      <TrustStrip />
      <WhyAngelitos />
      <Grades />
      <ADayWithUs />
      <Gallery />
      <Admissions />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
