const solutions = [
    {
      num: "01",
      title: "Assessment OS",
      text: "Structured vendor assessment, evidence, checklist and readiness workflows.",
    },
    {
      num: "02",
      title: "Tender Intelligence",
      text: "Transform tender requirements into structured eligibility and action intelligence.",
    },
    {
      num: "03",
      title: "Document Intelligence",
      text: "Turn business documents into usable structured information and workflows.",
    },
    {
      num: "04",
      title: "Readiness & Risk",
      text: "Understand evidence gaps, readiness signals, risks and next actions.",
    },
    {
      num: "05",
      title: "Deadline Intelligence",
      text: "Track important assessment and response deadlines through reusable platform infrastructure.",
    },
    {
      num: "06",
      title: "Bid Intelligence",
      text: "Analyze legitimate historical signals without turning statistical patterns into accusations.",
    },
    {
      num: "07",
      title: "Payment Intelligence",
      text: "Create a structured intelligence layer around procurement-related payment workflows.",
    },
    {
      num: "08",
      title: "Grievance Intelligence",
      text: "Organize cases, evidence, timelines and response workflows.",
    },
  ];
  
  export default function Solutions() {
    return (
      <section className="section solutions">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">The Platform</span>
  
            <h2 className="h2">
              Intelligence products
              <br />
              built on one foundation.
            </h2>
  
            <p>
              Each capability is designed to reuse the platform&apos:s canonical
              vendor, evidence, rules and security foundations rather than
              creating isolated systems.
            </p>
          </div>
  
          <div className="solution-grid">
            {solutions.map((item) => (
              <article className="solution-card" key={item.num}>
                <div className="solution-num">{item.num}</div>
  
                <h3>{item.title}</h3>
  
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }