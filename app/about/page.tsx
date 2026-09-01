import type { Metadata } from "next";
import JourneyRoad from "@/components/JourneyRoad";

export const metadata: Metadata = {
  title: "About Us",
  description: "A leader in every aspect of electrical construction, maintenance and service — founded in 2018 in Hyderabad.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="page active">
      <div className="litepage"><div className="inwrap">
        <div className="abgrid" style={{ gridTemplateColumns: "1fr" }}>
          <div className="txt">
            <p><b>AJ POWER SOLUTIONS</b> is a leader in every aspect of electrical construction, maintenance and service — one of the reputed specialized HT &amp; LT electrical contractors across India for commercial, industrial, residential and IT sectors, equipped to handle the challenges and complexities of any job.</p>
            <p>We bring a dedication to safety, integrity and dependability to every job. Integrity, honesty, perseverance, respect and service — these are the true values embraced by each and every AJ Power Solutions employee. Our projects can be complex, but our ethics are not.</p>
            <p>Founded with the philosophy of <b>&quot;PEOPLE ARE OUR STRENGTH&quot;</b>, we are a growing, innovative company committed to quality service — building relationships that provide complete satisfaction and lead to lifetime partnerships.</p>
          </div>
        </div>

        <h2 className="secthead">Our Journey</h2>
        <JourneyRoad />
        <div className="timeline">
          <div className="tl"><span>2018</span><b>AJ Power Solutions founded</b><p>AJ Power Solutions journey started.</p></div>
          <div className="tl"><span>2019</span><b>Emerging journey</b><p>Continued our emerging journey.</p></div>
          <div className="tl"><span>2020</span><b>Pune office</b><p>New office set up at Pune, Maharashtra.</p></div>
          <div className="tl"><span>2021</span><b>Bengaluru expansion</b><p>Expanded to Bangalore, Karnataka.</p></div>
          <div className="tl"><span>2022</span><b>Tech Pi Solutions</b><p>Started visionary LT panel manufacturing unit, Tech Pi Solutions.</p></div>
          <div className="tl"><span>2023</span><b>Raceway &amp; cable tray unit</b><p>Established raceway and cable tray manufacturing unit.</p></div>
          <div className="tl"><span>2024</span><b>10+ million sq ft</b><p>Successfully completed 10+ million sq ft area.</p></div>
          <div className="tl"><span>Present</span><b>250+ projects</b><p>Successfully completed 250+ projects.</p></div>
        </div>

        <h2 className="secthead">Values · Vision · Mission</h2>
        <div className="vmv">
          <div className="card">
            <div className="ic" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6l2 4-5 12L7 7z" /><path d="M9 3 3 12l9 9" /><path d="M15 3l6 9-9 9" /></svg>
            </div>
            <h3>Our Values</h3><p>Our values guide the way we work with our business partners, within our communities and with each other.</p>
          </div>
          <div className="card">
            <div className="ic" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3.2" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /></svg>
            </div>
            <h3>Our Vision</h3><p>To provide interesting and challenging projects to empower — building India&apos;s infrastructure.</p>
          </div>
          <div className="card">
            <div className="ic" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h6l-1 8 9-12h-6z" /></svg>
            </div>
            <h3>Our Mission</h3><p>To be India&apos;s leading contracting company focused on customer satisfaction, honesty, reliability and integrity.</p>
          </div>
        </div>

        <h2 className="secthead">Leadership</h2>
        <div className="leadgrid">
          <div className="lead">
            <div className="av">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/arun-sir.jpg" alt="Aruna Kumar S.S — Founder & Director" />
            </div>
            <small>Founder &amp; Director</small>
            <h3>Aruna Kumar S.S</h3>
            <p>Over two decades of experience in HT &amp; LT electrical contracting — design, execution, testing and commissioning of sub-stations, industrial installations, high-rise buildings, townships, hospitals and IT parks. Known for timely completion and handover of projects.</p>
          </div>
          <div className="lead">
            <div className="av">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/jeeven-sir.jpg" alt="Jeevan B.S — Founder & Director" />
            </div>
            <small>Founder &amp; Director</small>
            <h3>Jeevan B.S</h3>
            <p>Extensive experience across electrical supply and distribution networks — heading administration, sales, engineering, project execution and finance, with exposure both in India and overseas.</p>
          </div>
        </div>
      </div></div>
    </div>
  );
}