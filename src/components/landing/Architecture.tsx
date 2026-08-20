const layers = [
    {
      name: "Platform Foundation",
      sub: "Trust layer",
      items: [
        "Authentication",
        "Organization",
        "Tenant",
        "Security",
        "Storage",
        "Audit",
        "Observability",
      ],
    },
    {
      name: "Vendor Intelligence",
      sub: "Business evidence",
      items: [
        "Vendor Profile",
        "Factory",
        "Products",
        "Machines",
        "Documents",
        "Certificates",
        "Evidence",
        "Compliance",
      ],
    },
    {
      name: "Decision Engines",
      sub: "Intelligence layer",
      items: [
        "Assessment",
        "Readiness",
        "Eligibility",
        "Risk",
        "Deadline",
        "NC",
        "Scoring",
        "Rules",
      ],
    },
    {
      name: "GemLotus Products",
      sub: "Business outcomes",
      items: [
        "Assessment OS",
        "Tender Intelligence",
        "Document Intelligence",
        "Payment Intelligence",
        "Grievance",
        "Bid Integrity",
        "Category Intelligence",
      ],
    },
  ];
  
  export default function Architecture() {
    return (
      <section className="section architecture" id="platform">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">System Architecture</span>
  
            <h2 className="h2">
              One intelligence
              <br />
              architecture.
            </h2>
  
            <p>
              GemLotus is not a collection of disconnected tools. Its products
              sit on shared platform foundations, vendor intelligence and
              reusable decision engines.
            </p>
          </div>
  
          <div className="arch-stack">
            {layers.map((layer) => (
              <div className="arch-layer" key={layer.name}>
                <div className="arch-layer-name">
                  {layer.name}
                  <small>{layer.sub}</small>
                </div>
  
                <div className="arch-items">
                  {layer.items.map((item) => (
                    <span className="arch-item" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }