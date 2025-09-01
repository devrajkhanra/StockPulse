import { DownloadIcon, TrendingUpIcon, DatabaseIcon, ChartLine, Sparkles, ArrowRight, CheckCircle, Zap, Shield, Clock } from "lucide-react";

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%)' }}>
      {/* Hero Section */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, background: 'repeating-linear-gradient(135deg, #a5b4fc 0 2px, transparent 2px 40px)' }} />
        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '5em 1.5em' }}>
          <div style={{ textAlign: 'center', marginBottom: '4em' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', height: 80, width: 80, alignItems: 'center', justifyContent: 'center', borderRadius: 24, background: 'linear-gradient(135deg, #5b21b6, #7c3aed 80%)', boxShadow: '0 8px 32px rgba(91,33,182,0.15)' }}>
                  <ChartLine style={{ height: 40, width: 40, color: '#fff' }} />
                </div>
                <div style={{ position: 'absolute', top: -8, right: -8 }}>
                  <div style={{ display: 'flex', height: 24, width: 24, alignItems: 'center', justifyContent: 'center', borderRadius: 12, background: '#10b981', boxShadow: '0 2px 8px rgba(16,185,129,0.15)' }}>
                    <Sparkles style={{ height: 12, width: 12, color: '#fff' }} />
                  </div>
                </div>
              </div>
            </div>
            <h1 style={{ fontSize: '3em', fontWeight: 700, color: '#222', marginBottom: 24, letterSpacing: '-0.02em' }}>
              NSE Data
              <span className="text-gradient" style={{ display: 'block' }}>Downloader</span>
            </h1>
            <p style={{ fontSize: '1.25em', color: '#6b7280', marginBottom: 32, maxWidth: 700, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
              Professional financial data management for National Stock Exchange data files.
              Download, organize, and manage NSE data with enterprise-grade reliability and modern design.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', marginBottom: 32 }}>
              <button className="btn-primary" style={{ fontSize: '1.1em', padding: '1em 2.5em', boxShadow: '0 4px 16px rgba(91,33,182,0.10)', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => window.location.href = "/home"}>
                <Sparkles style={{ marginRight: 8, height: 20, width: 20 }} />
                Get Started
                <ArrowRight style={{ marginLeft: 8, height: 20, width: 20 }} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.95em', color: '#6b7280' }}>
                <CheckCircle style={{ height: 16, width: 16, color: '#10b981' }} />
                <span>No registration required</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, fontSize: '0.95em', color: '#6b7280' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="status-indicator active" />
                <span>System Operational</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield style={{ height: 16, width: 16, color: '#10b981' }} />
                <span>Secure Downloads</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap style={{ height: 16, width: 16, color: '#3b82f6' }} />
                <span>High Performance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4em 1.5em' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: '2em', fontWeight: 700, color: '#222', marginBottom: 16 }}>
            Everything you need for NSE data management
          </h2>
          <p style={{ fontSize: '1.1em', color: '#6b7280', maxWidth: 600, margin: '0 auto' }}>
            Built with modern web technologies and designed for professional traders and analysts
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 64 }}>
          {/* Feature 1 */}
          <div className="card" style={{ textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            <div style={{ paddingBottom: 16 }}>
              <div style={{ margin: '0 auto 16px', display: 'flex', height: 64, width: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 16, background: 'linear-gradient(135deg, #3b82f6, #6366f1 80%)', boxShadow: '0 2px 8px rgba(59,130,246,0.15)' }}>
                <DownloadIcon style={{ height: 32, width: 32, color: '#fff' }} />
              </div>
              <div style={{ fontSize: '1.25em', fontWeight: 600 }}>Bulk Downloads</div>
            </div>
            <div style={{ fontSize: '1em', color: '#6b7280', lineHeight: 1.5 }}>
              Download multiple data sources and date ranges efficiently with our advanced download manager and progress tracking
            </div>
          </div>
          {/* Feature 2 */}
          <div className="card" style={{ textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            <div style={{ paddingBottom: 16 }}>
              <div style={{ margin: '0 auto 16px', display: 'flex', height: 64, width: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 16, background: 'linear-gradient(135deg, #10b981, #22d3ee 80%)', boxShadow: '0 2px 8px rgba(16,185,129,0.15)' }}>
                <TrendingUpIcon style={{ height: 32, width: 32, color: '#fff' }} />
              </div>
              <div style={{ fontSize: '1.25em', fontWeight: 600 }}>Real-time Progress</div>
            </div>
            <div style={{ fontSize: '1em', color: '#6b7280', lineHeight: 1.5 }}>
              Track download progress in real-time with detailed statistics, completion status, and performance metrics
            </div>
          </div>
          {/* Feature 3 */}
          <div className="card" style={{ textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            <div style={{ paddingBottom: 16 }}>
              <div style={{ margin: '0 auto 16px', display: 'flex', height: 64, width: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 16, background: 'linear-gradient(135deg, #a21caf, #6366f1 80%)', boxShadow: '0 2px 8px rgba(99,102,241,0.15)' }}>
                <DatabaseIcon style={{ height: 32, width: 32, color: '#fff' }} />
              </div>
              <div style={{ fontSize: '1.25em', fontWeight: 600 }}>Smart Organization</div>
            </div>
            <div style={{ fontSize: '1em', color: '#6b7280', lineHeight: 1.5 }}>
              Automatically organize downloaded files into structured directories with intelligent naming and categorization
            </div>
          </div>
          {/* Feature 4 */}
          <div className="card" style={{ textAlign: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
            <div style={{ paddingBottom: 16 }}>
              <div style={{ margin: '0 auto 16px', display: 'flex', height: 64, width: 64, alignItems: 'center', justifyContent: 'center', borderRadius: 16, background: 'linear-gradient(135deg, #f59e42, #ef4444 80%)', boxShadow: '0 2px 8px rgba(239,68,68,0.15)' }}>
                <Zap style={{ height: 32, width: 32, color: '#fff' }} />
              </div>
              <div style={{ fontSize: '1.25em', fontWeight: 600 }}>High Performance</div>
            </div>
            <div style={{ fontSize: '1em', color: '#6b7280', lineHeight: 1.5 }}>
              Optimized for speed with concurrent downloads, smart caching, and efficient resource management
            </div>
          </div>
        </div>

        {/* Data Sources Showcase */}
        <div className="card" style={{ marginBottom: 64, boxShadow: '0 8px 32px rgba(91,33,182,0.10)', textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: '2em', fontWeight: 700, marginBottom: 16 }}>Comprehensive Data Coverage</div>
          <div style={{ fontSize: '1.1em', color: '#6b7280', marginBottom: 32 }}>
            Access all major NSE data sources through a unified interface
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24 }}>
            {[
              { name: "Nifty 50", icon: "📊", desc: "Current stock listings", color: 'linear-gradient(135deg, #fde68a, #f59e42 80%)' },
              { name: "Indices", icon: "📈", desc: "Historical index data", color: 'linear-gradient(135deg, #6ee7b7, #10b981 80%)' },
              { name: "Stocks", icon: "🏢", desc: "Daily bhav data", color: 'linear-gradient(135deg, #60a5fa, #6366f1 80%)' },
              { name: "Market Activity", icon: "📊", desc: "Activity reports", color: 'linear-gradient(135deg, #a78bfa, #f472b6 80%)' },
              { name: "Options", icon: "⚡", desc: "F&O market data", color: 'linear-gradient(135deg, #f87171, #f43f5e 80%)' },
            ].map((source, index) => (
              <div key={source.name} style={{ textAlign: 'center', padding: 24, borderRadius: 16, background: source.color, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', color: '#222', fontSize: 20 }}>
                <div style={{ margin: '0 auto 16px', display: 'flex', height: 48, width: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 12, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', fontSize: 32 }}>
                  {source.icon}
                </div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>{source.name}</div>
                <div style={{ fontSize: '0.95em', color: '#6b7280' }}>{source.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="card" style={{ display: 'inline-block', boxShadow: '0 8px 32px rgba(91,33,182,0.10)', background: 'linear-gradient(135deg, #ede9fe 0%, #e0e7ff 100%)', padding: 32 }}>
            <h3 style={{ fontSize: '1.5em', fontWeight: 700, color: '#222', marginBottom: 16 }}>
              Ready to streamline your data workflow?
            </h3>
            <p style={{ color: '#6b7280', marginBottom: 24, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
              Join thousands of professionals who trust our platform for their NSE data needs
            </p>
            <button className="btn-primary" style={{ fontSize: '1.1em', padding: '1em 2.5em', marginTop: 8 }} onClick={() => window.location.href = "/home"}>
              <Sparkles style={{ marginRight: 8, height: 20, width: 20 }} />
              Start Downloading Now
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e5e7eb', background: '#f3f4f6', padding: '2em 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5em', textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>
            &copy; 2025 NSE Data Downloader. Professional financial data management solution.
          </p>
        </div>
      </footer>
    </div>
  );
}