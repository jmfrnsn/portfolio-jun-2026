import { FooterSection } from "@/components/home/FooterSection";
import { SectionContentShell } from "@/components/section/SectionContentShell";

type EtymologyLayoutProps = {
  children: React.ReactNode;
};

export function EtymologyLayout({ children }: EtymologyLayoutProps) {
  return (
    <div className="bg-paper text-ink">
      <SectionContentShell>
        <main>{children}</main>
      </SectionContentShell>
      <FooterSection />
    </div>
  );
}
