export default function Hero() {
    return (
      <section className="hero">
        <div className="hero-glow" />
  
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              Procurement Intelligence Operating System
            </span>
  
            <h1 className="display hero-title">
              Turn business
              <br />
              evidence into
              <br />
              <span className="accent">intelligence.</span>
            </h1>
  
            <p className="hero-description">
              GemLotus AI connects vendor data, factories, products, documents,
              evidence, assessments and procurement intelligence into one
              structured decision system.
            </p>
  
            <div className="hero-actions">
              <a href="#platform" className="btn btn-orange">
                Explore GemLotus
                <span>→</span>
              </a>
  
              <a href="#intelligence" className="btn btn-dark-outline">
                See how it works
              </a>
            </div>
  
            <div className="hero-proof">
              <div className="proof-item">
                <i className="proof-dot" />
                Evidence driven
              </div>
  
              <div className="proof-item">
                <i className="proof-dot" />
                Rule aware
              </div>
  
              <div className="proof-item">
                <i className="proof-dot" />
                Human controlled AI
              </div>
            </div>
          </div>
  
          <div className="command-center">
            <div className="command-inner">
              <div className="command-top">
                <span className="command-label">
                  GemLotus Intelligence Core
                </span>
  
                <span className="live-pill">
                  <i />
                  AI SYSTEM
                </span>
              </div>
  
              <h2 className="command-title">
                From fragmented information
                <br />
                to actionable intelligence.
              </h2>
  
              <p className="command-sub">
                A visual representation of the GemLotus intelligence architecture.
              </p>
  
              <div className="intelligence-map">
                <div className="orbit" />
                <div className="orbit two" />
  
                <div className="core-node">
                  <div>
                    <strong>GEMLOTUS</strong>
                    <small>AI CORE</small>
                  </div>
                </div>
  
                <div className="node">VENDOR DATA</div>
                <div className="node">DOCUMENTS</div>
                <div className="node">FACTORY</div>
                <div className="node">PRODUCTS</div>
                <div className="node">EVIDENCE</div>
                <div className="node">ASSESSMENT</div>
              </div>
  
              <div className="command-footer">
                <div className="command-stat">
                  <strong>01</strong>
                  <span>Source of truth</span>
                </div>
  
                <div className="command-stat">
                  <strong>∞</strong>
                  <span>Intelligence paths</span>
                </div>
  
                <div className="command-stat">
                  <strong>AI</strong>
                  <span>Decision support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }