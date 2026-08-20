const nodes = [
    ["Organization", "Canonical identity", "gn1"],
    ["Factory", "Manufacturing evidence", "gn2"],
    ["Documents", "Business records", "gn3"],
    ["Products", "Capability data", "gn4"],
    ["Assessments", "Readiness state", "gn5"],
    ["Tenders", "Opportunity intelligence", "gn6"],
  ];
  
  export default function VendorGraph() {
    return (
      <section className="section vendor-section">
        <div className="container vendor-grid">
          <div className="vendor-copy">
            <span className="eyebrow">Canonical Vendor Intelligence</span>
  
            <h2 className="h2">
              One vendor.
              <br />
              One source of truth.
            </h2>
  
            <p>
              GemLotus does not create a separate vendor system for every
              product. The platform is designed around one canonical vendor
              intelligence model that can power assessments, tenders,
              compliance and future intelligence products.
            </p>
  
            <div className="vendor-points">
              <div className="vendor-point">
                <div className="vendor-point-mark">✓</div>
                <div>
                  <strong>Shared business context</strong>
                  <span>Every product works from the same vendor foundation.</span>
                </div>
              </div>
  
              <div className="vendor-point">
                <div className="vendor-point-mark">✓</div>
                <div>
                  <strong>Reusable evidence</strong>
                  <span>Evidence can support multiple decisions.</span>
                </div>
              </div>
  
              <div className="vendor-point">
                <div className="vendor-point-mark">✓</div>
                <div>
                  <strong>Versioned intelligence</strong>
                  <span>Important decisions retain their applicable context.</span>
                </div>
              </div>
            </div>
          </div>
  
          <div className="vendor-graph">
            <div className="graph-lines" />
  
            {nodes.map(([title, subtitle, className]) => (
              <div className={`graph-node ${className}`} key={title}>
                <strong>{title}</strong>
                <span>{subtitle}</span>
              </div>
            ))}
  
            <div className="graph-center">
              <div>
                <strong>VENDOR</strong>
                <span>INTELLIGENCE CORE</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }