export default function AssessmentPreview() {
    return (
      <section className="section product-section" id="assessment">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">First Production Intelligence</span>
  
            <h2 className="h2">
              Assessment is not a score.
              <br />
              It is a decision system.
            </h2>
  
            <p>
              GemLotus Assessment OS is designed around applicable entity types,
              OEM subtypes, checklist rules, evidence, fees and versioned
              assessment snapshots.
            </p>
          </div>
  
          <div className="product-preview">
            <aside className="product-sidebar">
              <h3>Assessment OS</h3>
  
              <p>
                A structured assessment workspace built on evidence and
                applicable rules.
              </p>
  
              <div className="product-tabs">
                {[
                  "Assessment Overview",
                  "Company",
                  "Factory",
                  "Products",
                  "Evidence",
                  "Checklist",
                  "Readiness",
                ].map((item, index) => (
                  <div
                    key={item}
                    className={`product-tab ${index === 0 ? "active" : ""}`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </aside>
  
            <div className="product-dashboard">
              <div className="dashboard-head">
                <h4>Assessment Intelligence</h4>
                <span className="status">ILLUSTRATIVE UI</span>
              </div>
  
              <div className="dashboard-grid">
                <div className="d-card">
                  <div className="d-label">Evidence coverage</div>
                  <div className="d-value">84%</div>
                  <div className="progress">
                    <span style={{ width: "84%" }} />
                  </div>
                </div>
  
                <div className="d-card">
                  <div className="d-label">Checklist state</div>
                  <div className="d-value">72%</div>
                  <div className="progress">
                    <span style={{ width: "72%" }} />
                  </div>
                </div>
  
                <div className="d-card">
                  <div className="d-label">Open evidence gaps</div>
                  <div className="d-value">07</div>
                </div>
  
                <div className="d-card">
                  <div className="d-label">Critical review items</div>
                  <div className="d-value">02</div>
                </div>
  
                <div className="d-card wide">
                  <div className="d-label">Action queue</div>
  
                  <div className="gap-list">
                    <div className="gap">
                      <span>Manufacturing evidence</span>
                      <b>REVIEW</b>
                    </div>
  
                    <div className="gap">
                      <span>Product documentation</span>
                      <b>MISSING</b>
                    </div>
  
                    <div className="gap">
                      <span>Certificate validity</span>
                      <b>VERIFY</b>
                    </div>
  
                    <div className="gap">
                      <span>Assessment checklist</span>
                      <b>READY</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }