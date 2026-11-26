import { Hero } from "@/components/landing/hero";
import { TrustStrip } from "@/components/landing/trust-strip";
import { Levels } from "@/components/landing/levels";
import { WhyAngelitos } from "@/components/landing/why-angelitos";
import { Gallery } from "@/components/landing/gallery";
import { Admissions } from "@/components/landing/admissions";
import { Faq } from "@/components/landing/faq";
import { CommunityAccess } from "@/components/landing/community-access";
import { Location } from "@/components/landing/location";
import { FinalCta } from "@/components/landing/final-cta";
import { MobileWhatsAppBar } from "@/components/landing/mobile-whatsapp-bar";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="overflow-x-hidden bg-background">
      <Hero />
      <TrustStrip />
      <Levels />
      <WhyAngelitos />
      <Gallery />
      <Admissions />
      <Faq />
      <CommunityAccess />
      <Location />
      <FinalCta />
      <Footer />
      <MobileWhatsAppBar />
    </div>
  );
}
