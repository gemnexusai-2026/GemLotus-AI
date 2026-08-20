export default function Footer() {
    return (
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#" className="brand">
                <span className="brand-mark">
                  <span>G</span>
                </span>
                GEMLOTUS AI
              </a>
  
              <p>
                Procurement Intelligence Operating System — transforming
                fragmented business evidence into structured intelligence,
                decisions and action.
              </p>
  
              <div className="footer-contact">
                <a href="mailto:gemnexusai@gmail.com">
                  gemnexusai@gmail.com
                </a>
  
                <a href="tel:+919890602105">
                  +91 98906 02105
                </a>
              </div>
            </div>
  
            <div>
              <h4>Platform</h4>
  
              <div className="footer-links">
                <a href="#platform">Architecture</a>
                <a href="#assessment">Assessment OS</a>
                <a href="#intelligence">Intelligence</a>
                <a href="#security">Security</a>
              </div>
            </div>
  
            <div>
              <h4>Intelligence</h4>
  
              <div className="footer-links">
                <a href="#assessment">Assessment</a>
                <a href="#platform">Tender Intelligence</a>
                <a href="#platform">Evidence</a>
                <a href="#security">AI Governance</a>
              </div>
            </div>
  
            <div>
              <h4>Company</h4>
  
              <div className="footer-links">
                <a href="#contact">Contact</a>
                <a href="#platform">Solutions</a>
                <a href="#security">Trust & Security</a>
                <a href="mailto:gemnexusai@gmail.com">Email Us</a>
              </div>
            </div>
          </div>
  
          <div className="footer-bottom">
            <span>
              © {new Date().getFullYear()} GemLotus AI. All rights reserved.
            </span>
  
            <span>
              Managed by <strong>Vorixa India AItech Solutions</strong>
            </span>
          </div>
        </div>
      </footer>
    );
  }