import { type Project } from "@/lib/data";

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="pjgrid" id="clients-grid">
      {projects.map((p) => {
        const initials = p.name.split(/\s|\(/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
        return (
          <div className="pj" key={p.name}>
            <span className="cnt2">{p.count} {p.count > 1 ? "projects" : "project"}</span>
            {p.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="logoimg" src={p.logo} alt={`${p.name} logo`} loading="lazy" />
            ) : (
              <div className="avv">{initials}</div>
            )}
            <span className="sect">{p.sector}</span>
            <h3>{p.name}</h3>
            <p>{p.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
