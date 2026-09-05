import type { Metadata } from "next";
import PageCta from "@/components/PageCta";
import ProjectsGrid from "@/components/ProjectsGrid";
import { PROJECTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects",
  description: "Major HT & LT projects delivered across India — Qualcomm, Sutherland, Verizon and more.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="page active">
      <div className="litepage"><div className="inwrap">
        <div className="statrow">
          {/* same split as the home stat bar: figure and its noun on one line, the
              verb underneath */}
          <div className="st"><b>13<i>M+</i> Sq. Ft.</b><span>Executed</span></div>
          <div className="st"><b>250<i>+</i> Projects</b><span>Delivered</span></div>
          <div className="st"><b>3 Metro Cities</b><span>Presence</span></div>
          <div className="st"><b>25<i>+</i> Marquee Clients</b><span>Trusted</span></div>
        </div>
        <div className="pjfeat">
          <div>
            <h3>Trusted by leading enterprises — repeatedly</h3>
            <p>Major HT &amp; LT electrification delivered for marquee clients across India — and it&apos;s the repeat orders that define us. Multi-phase campus programmes, follow-on packages and sustained engagements executed alongside leading PMCs, architects and clients.</p>
          </div>
          <div className="big">25+<small>REPEAT-ORDER CLIENTS</small></div>
        </div>
        <h2 className="secthead">Clients &amp; engagements</h2>
        <ProjectsGrid projects={PROJECTS} />
        <PageCta
          title="Your project could be next."
          text="From single facilities to multi-phase campuses — we deliver HT & LT electrification end to end."
          linkLabel="Discuss Your Project"
        />
      </div></div>
    </div>
  );
}