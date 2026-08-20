const security = [
    "Authentication & authorization",
    "Tenant isolation",
    "Row Level Security",
    "Secure evidence storage",
    "Audit logging",
    "Input & API validation",
    "AI output validation",
    "Prompt-injection protection",
  ];
  
  export default function TrustSection() {
    return (
      <section className="section trust-section" id="security">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Responsible Intelligence</span>
  
            <h2 className="h2">
              AI with evidence.
              <br />
              Intelligence with control.
            </h2>
  
            <p>
              GemLotus treats AI as an intelligence layer—not as an authority
              that can invent verification, compliance or final decisions.
            </p>
          </div>
  
          <div className="trust-grid">
            <div className="trust-card dark">
              <span className="eyebrow">AI Governance</span>
  
              <h3>AI assists. Evidence decides.</h3>
  
              <p>
                AI can extract, classify, summarize, recommend, detect possible
                mismatches and assist drafting. It does not fabricate confidence
                or silently replace authoritative business decisions.
              </p>
  
              <div className="ai-rule">
                <strong>Core principle</strong>
                <span>
                  When the underlying provider or evidence is unavailable,
                  GemLotus should represent that uncertainty rather than
                  manufacture success.
                </span>
              </div>
            </div>
  
            <div className="trust-card">
              <span className="eyebrow">Enterprise Security</span>
  
              <h3>Security belongs in every module.</h3>
  
              <p>
                Security is treated as platform infrastructure, not as a badge
                added to the landing page after development.
              </p>
  
              <div className="trust-list">
                {security.map((item) => (
                  <div className="trust-row" key={item}>
                    <span className="check">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }