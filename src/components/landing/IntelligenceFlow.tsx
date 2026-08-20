const flow = [
    ["01", "Connect", "Bring together vendor and business information."],
    ["02", "Structure", "Organize the information into canonical entities."],
    ["03", "Evidence", "Connect decisions to supporting evidence."],
    ["04", "Intelligence", "Apply rules, analysis and AI assistance."],
    ["05", "Decision", "Understand readiness, eligibility and risk."],
    ["06", "Action", "Turn intelligence into the next best action."],
  ];
  
  export default function IntelligenceFlow() {
    return (
      <section className="section flow-section" id="intelligence">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">The GemLotus Method</span>
  
            <h2 className="h2">
              From evidence
              <br />
              to decision.
            </h2>
  
            <p>
              Business information rarely arrives as a clean dataset. It arrives
              as documents, certificates, product information, factory records,
              tender requirements and fragmented evidence. GemLotus turns that
              complexity into structured intelligence.
            </p>
          </div>
  
          <div className="flow-track">
            {flow.map(([number, title, description]) => (
              <div className="flow-item" key={number}>
                <div className="flow-number">{number}</div>
  
                <div className="flow-icon">✦</div>
  
                <h3>{title}</h3>
  
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }