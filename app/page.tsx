import Link from "next/link";
import HeroWall from "@/components/HeroWall";
import Footer from "@/components/Footer";
import ClientsMarquee from "@/components/ClientsMarquee";
import CountUp from "@/components/CountUp";
import { SERVICES } from "@/lib/data";

const STATS = [
  { to: 13, unit: "M+", prefix: "", label: "Sq Ft Executed" },
  { to: 25, unit: "+", prefix: "", label: "Marquee Clients" },
  { to: 250, unit: "+", prefix: "", label: "Projects Delivered" },
  { to: 100, unit: "%", prefix: "", label: "Satisfaction Focus" },
];

export default function HomePage() {
  return (
    <>
      <section className="hero slideframe" id="top">
        <HeroWall />
        <div className="glass">
          <div className="bname">AJ Power Solutions</div>
          <h1>Empowering India&rsquo;s Infrastructure with Specialized HT &amp; LT Electrification</h1>
          <p style={{ marginTop: 20 }}>
            Specialized Electrical Contractors and Engineers — delivering design, execution, testing and 24/7
            maintenance across IT parks, data centres, industries and hospitals.
          </p>
          <div className="acts">
            <Link className="btn btn-g" href="/services">Explore Services</Link>
            <Link className="btn btn-w" href="/contact">Get in Touch</Link>
          </div>
          <div className="soc">
            <a href="https://www.linkedin.com/in/aj-power-solutions-a887b316b/" target="_blank" rel="noopener" aria-label="LinkedIn">in</a>
            <a href="mailto:hyd@ajpowersolutions.com" aria-label="Email">✉</a>
          </div>
        </div>
      </section>
            

      <section className="pinsec">
        <div className="pinsec-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/pinsec-bg.jpg" alt="Transmission towers against a bright blue sky" />
        </div>

        <div className="pinsec-content" id="clients">
          <div className="shead rv">
            <div className="kicker">Trusted by industry leaders</div>
            <h2>Delivering excellence <span style={{ color: "var(--teal-300)" }}>nationwide.</span></h2>
            <div className="rule"></div>
          </div>

          <div className="statbar rv" role="group" aria-label="Company statistics">
            <div className="track">
              {STATS.map((s, i) => (
                <div className="s" key={i}>
                  <div className="n">{s.prefix}<CountUp to={s.to} /><span className="u">{s.unit}</span></div>
                  <div className="l">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rv" style={{ marginTop: 44 }}>
            <ClientsMarquee />
          </div>
        </div>

        <div className="pinsec-content" id="why">
          <div className="shead rv">
            <div className="kicker">Why Choose Us</div>
            <h2>Experience Excellence with <span style={{ color: "var(--teal-300)" }}>AJ Power Solutions</span></h2>
            <div className="rule"></div>
          </div>
          <div className="rv mx-auto grid w-full max-w-[var(--maxw)] grid-cols-1 gap-7 sm:grid-cols-3">
              <div
                className="flex flex-col rounded-[24px] p-8 shadow-[0_24px_50px_-20px_rgba(5,26,33,.35)] transition-transform duration-300 hover:-translate-y-1.5"
                style={{ background: "var(--surface)", borderTop: "4px solid var(--teal-500)" }}
              >
                <span className="block text-[.85rem] font-bold" style={{ color: "var(--muted)" }}>01</span>
                <div className="mt-4 grid h-14 w-14 shrink-0 place-items-center rounded-2xl" style={{ background: "var(--teal-100)", color: "var(--teal-700)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" /><path d="M9 12l2 2 4-4" /></svg>
                </div>
                <h3 className="mt-5 text-[1.2rem]" style={{ color: "var(--ink)" }}>Quality Excellence</h3>
                <p className="mt-2 text-[.92rem] font-medium leading-relaxed" style={{ color: "var(--body-text)" }}>In-house design and engineering with value engineering from concept to statutory approvals, ensuring superior quality on every project.</p>
              </div>

              <div
                className="flex flex-col rounded-[24px] p-8 shadow-[0_24px_50px_-20px_rgba(5,26,33,.35)] transition-transform duration-300 hover:-translate-y-1.5"
                style={{ background: "var(--surface)", borderTop: "4px solid var(--navy-700)" }}
              >
                <span className="block text-[.85rem] font-bold" style={{ color: "var(--muted)" }}>02</span>
                <div className="mt-4 grid h-14 w-14 shrink-0 place-items-center rounded-2xl" style={{ background: "var(--surface-2)", color: "var(--navy-700)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4" /><path d="M1 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" /><path d="M17 3.5a4 4 0 0 1 0 7.5" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /></svg>
                </div>
                <h3 className="mt-5 text-[1.2rem]" style={{ color: "var(--ink)" }}>Expert Leadership</h3>
                <p className="mt-2 text-[.92rem] font-medium leading-relaxed" style={{ color: "var(--body-text)" }}>Directors with over two decades of experience in HT &amp; LT contracting, collaborating with architects, clients, industry leaders, JLL, CBRE, Savills, RSP and Semac.</p>
              </div>

              <div
                className="flex flex-col rounded-[24px] p-8 shadow-[0_24px_50px_-20px_rgba(5,26,33,.35)] transition-transform duration-300 hover:-translate-y-1.5"
                style={{ background: "var(--surface)", borderTop: "4px solid var(--emerald-500)" }}
              >
                <span className="block text-[.85rem] font-bold" style={{ color: "var(--muted)" }}>03</span>
                <div className="mt-4 grid h-14 w-14 shrink-0 place-items-center rounded-2xl" style={{ background: "var(--emerald-100)", color: "var(--emerald-600)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
                </div>
                <h3 className="mt-5 text-[1.2rem]" style={{ color: "var(--ink)" }}>Comprehensive Service</h3>
                <p className="mt-2 text-[.92rem] font-medium leading-relaxed" style={{ color: "var(--body-text)" }}>Round-the-clock service department, dedicated EHS and QC teams, testing, commissioning and preventive maintenance.</p>
              </div>
            </div>
        </div>

        <div className="pinsec-content" id="services">
          <div className="shead rv">
            <div className="kicker">Services</div>
            <h2>Our <span style={{ color: "var(--teal-300)" }}>Services</span></h2>
            <div className="rule"></div>
          </div>
          <div className="svgrid">
            {SERVICES.map((s) => (
              <Link className="svc rv" href={`/services/${s.id}`} aria-label={`${s.t} details`} key={s.id}>
                <span className="bar"></span>
                <div className="ph">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.t} loading="lazy" />
                  <span className="no">SERVICE · {s.no}</span>
                </div>
                <div className="bd"><h3>{s.t}</h3><p>{s.s}</p></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="band tint slideframe" id="cta">
        <div className="bg">
          <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=85" alt="Earth city lights at night" />
        </div>
        <div className="glass rv">
          <h2>Transform Your Electrical Infrastructure</h2>
          <div className="rule"></div>
          <p>Partner with us for HT &amp; LT electrification that adds economical value to your business while meeting the highest safety and quality standards.</p>
          <div className="acts"><Link className="btn btn-g" href="/contact">Start Your Project</Link></div>
        </div>
         <Footer />
      </section>
    </>
  );
}
   