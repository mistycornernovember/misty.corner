import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ISSUES_DATA, FEATURES_DATA, NEWS_DATA, CONTRIBUTION_RULES } from './data';

// --- Visual Components ---

const MistyShape = ({ color = '#d1d1d1', delay = 0, size = '300px' }: { color?: string; delay?: number; size?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, filter: 'blur(30px)' }}
    animate={{ opacity: 0.4, scale: 1.1, filter: 'blur(50px)' }}
    transition={{ duration: 5, delay, repeat: Infinity, repeatType: 'reverse' }}
    style={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      zIndex: -1,
    }}
  />
);

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: '首頁', path: '/' },
    { name: '刊物', path: '/issues' },
    { name: '合作', path: '/features' },
  ];

  return (
    <div className="container" style={{ background: 'var(--bg-color)', minHeight: '100vh', position: 'relative' }}>
      <div className="mist-layer" aria-hidden="true" style={mistLayerStyle}></div>
      
      {/* PERSISTENT Background Shapes */}
      <div style={{ position: 'fixed', top: '10%', left: '5%', zIndex: 0, pointerEvents: 'none' }}>
        <MistyShape color="#e8e8e8" delay={0} size="400px" />
      </div>
      <div style={{ position: 'fixed', bottom: '10%', right: '5%', zIndex: 0, pointerEvents: 'none' }}>
        <MistyShape color="#dcdcdc" delay={2} size="500px" />
      </div>

      <nav role="navigation" aria-label="主要導覽" style={navStyle}>
        <Link to="/" className="logo-link" style={logoLinkStyle} aria-label="製霧所首頁">
          <div style={{ position: 'relative', width: '135px', height: '45px', display: 'flex', alignItems: 'center' }}>
            <img 
              src="/images/logo.png" 
              alt="製霧所 Logo" 
              style={{ 
                height: '70px', 
                width: 'auto', 
                objectFit: 'contain', 
                display: logoLoaded ? 'block' : 'none',
                zIndex: 1001
              }} 
              onLoad={() => setLogoLoaded(true)}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; setLogoLoaded(false); }}
            />
            {!logoLoaded && <span style={logoTextStyle}>製霧所</span>}
          </div>
        </Link>
        
        <div className="desktop-nav" style={navLinksStyle}>
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className="nav-item"
              aria-current={location.pathname === item.path ? 'page' : undefined}
              style={{
                ...navLinkStyle,
                borderBottom: location.pathname === item.path ? '1.5px solid var(--text-color)' : 'none'
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <button 
          className="mobile-nav-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          style={hamburgerButtonStyle}
          aria-expanded={isMenuOpen}
          aria-label="開啟選單"
        >
          <div style={{...lineStyle, transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'}}></div>
          <div style={{...lineStyle, opacity: isMenuOpen ? 0 : 1}}></div>
          <div style={{...lineStyle, transform: isMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'}}></div>
        </button>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            style={mobileMenuOverlayStyle}
          >
            <div style={mobileMenuLinksStyle}>
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)} style={{...navLinkStyle, fontSize: '2rem'}}>
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content" style={mainStyle}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer role="contentinfo" style={footerStyle}>
        <p>&copy; 2026 製霧所 MISTY CORNER. ALL RIGHTS RESERVED.</p>
      </footer>

      <style>{`
        .desktop-nav { display: flex; }
        .mobile-nav-toggle { display: none; background: none; border: none; padding: 0; }
        @media (max-width: 768px) {
          .desktop-nav { display: none; }
          .mobile-nav-toggle { display: flex; flex-direction: column; gap: 6px; cursor: pointer; z-index: 1001; }
        }
      `}</style>
    </div>
  );
};

// --- Page Components ---

const Home = () => (
  <div style={pagePadding}>
    <section style={fullHeroStyle} aria-labelledby="hero-title">
      <div style={heroBackgroundOverlay} />
      <div style={heroContentContainer}>
        <h1 id="hero-title" style={heroBigTitleStyle}>製霧所</h1>
        <p style={heroSubText}>2021 由酒精和創作組成，成員都會發酵。<br />不定期出沒於市集、公園，還有熱炒店。</p>
        <div style={{marginTop: '3rem'}}>
           <Link to="/issues" className="cta-button" style={ctaButtonStyle}>瀏覽刊物</Link>
        </div>
      </div>
    </section>

    <div style={innerContainer}>
      <section style={sectionGap} aria-labelledby="news-title">
        <h2 id="news-title" style={sectionTitleStyle}>最新消息 / NEWS</h2>
        <div style={newsContainerStyle}>
          {NEWS_DATA.map((news, idx) => (
            <article key={idx} style={newsItemStyle}>
              <h3 style={itemTitleStyle}>{news.title}</h3>
              {news.deadline && (
                <p style={{ ...newsTextStyle, color: 'var(--text-color)', fontWeight: 600, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  截稿日期：{news.deadline}
                </p>
              )}
              <p style={newsTextStyle}>
                {news.content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>{line}<br /></React.Fragment>
                ))}
              </p>
              {news.showRules && (
                <p style={{ ...newsTextStyle, marginTop: '2rem', paddingTop: '2rem', borderTop: '1px dashed #eee', color: '#555', fontSize: '0.9rem' }}>
                  {CONTRIBUTION_RULES.split('\n').map((line, i) => (
                    <React.Fragment key={i}>{line}<br /></React.Fragment>
                  ))}
                </p>
              )}
              {news.links && (
                <div style={contactListStyle}>
                  {news.links.map((link, linkIdx) => (
                    <span key={linkIdx}>
                      <a href={link.url} target={link.url.startsWith('http') ? "_blank" : undefined} rel={link.url.startsWith('http') ? "noopener noreferrer" : undefined}>
                        {link.label}
                      </a>
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section style={sectionGap} aria-labelledby="about-title">
        <h2 id="about-title" style={sectionTitleStyle}>組織介紹 / ABOUT</h2>
        <p style={{...newsTextStyle, maxWidth: '700px', lineHeight: '2.2'}}>
          2021 由酒精和創作組成，成員都會發酵。不定期出沒於市集、公園，還有熱炒店。我們致力於捕捉生活中的朦朧，將那些細碎、發酵後的思緒化作實體刊物與讀者連結。
        </p>
        <div style={{marginTop: '2rem', display: 'flex', gap: '2rem'}}>
          <a href="https://www.facebook.com/misty.corner.november" target="_blank" rel="noopener noreferrer" style={textLinkStyle}>[ FACEBOOK ]</a>
          <a href="mailto:misty.corner.november@gmail.com" style={textLinkStyle}>[ EMAIL ]</a>
        </div>
      </section>

      <section style={sectionGap} aria-labelledby="stockist-title">
        <h2 id="stockist-title" style={sectionTitleStyle}>寄賣地點 / STOCKISTS</h2>
        <div style={stockistGridStyle}>
          <StockistCard name="三餘書店" link="https://www.takaobooks.tw/html/main" />
          <StockistCard name="佔空間" link="https://www.facebook.com/ArtQPie" />
          <StockistCard name="天空競技場" link="https://www.instagram.com/the_sky_arena/" />
        </div>
      </section>
    </div>
  </div>
);

const StockistCard = ({ name, link }: { name: string; link: string }) => (
  <a href={link} target="_blank" rel="noopener noreferrer" style={stockistCardStyle}>
    <h3>{name}</h3>
    <p style={{fontSize: '0.65rem', marginTop: '1rem', color: '#999', letterSpacing: '0.1rem'}}>VISIT WEBSITE →</p>
  </a>
);

const Issues = () => (
  <div style={innerContainer}>
    <div style={{paddingTop: '8rem'}}>
      <h2 style={sectionTitleStyle}>刊物 / ISSUES</h2>
      <div className="issues-grid">
        {ISSUES_DATA.map((issue, idx) => (
          <motion.article
            key={issue.id}
            style={issueCardStyle}
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: Math.min(idx * 0.08, 0.32), ease: 'easeOut' }}
          >
            <div style={{...issueImageContainer, backgroundImage: `url("${issue.image}")`}}>
              <div style={imageOverlay} />
            </div>
            <div style={{padding: '2rem 0'}}>
              <h3 style={itemTitleStyle}>製霧所 第{issue.number}期「{issue.title}」</h3>
              <span style={dateStyle}>{issue.date} 發行</span>
              <div style={issueContentClassic}>
                {issue.description.split('\n').map((line, i) => (
                  <React.Fragment key={i}>{line}<br /></React.Fragment>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
    <style>{`
      .issues-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6rem 3.5rem; margin-bottom: 10rem; }
      @media (max-width: 1100px) { .issues-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 650px) { .issues-grid { grid-template-columns: 1fr; } }
    `}</style>
  </div>
);

const Features = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (id) {
    const feature = FEATURES_DATA.find(f => f.id === id);
    if (!feature) return <div>Article not found.</div>;
    return (
      <div style={articlePageStyle}>
        <button onClick={() => navigate('/features')} style={backButtonStyle}>← BACK TO LIST</button>
        <div style={{...articleHeroImage, backgroundImage: `url("${feature.image}")`}}>
          <div style={imageOverlay} />
        </div>
        <div style={articleBodyContainer}>
          <h1 style={articleTitleStyle}>{feature.title}</h1>
          {feature.preface && <div style={prefaceStyle}>{feature.preface.split('\n').map((l,i)=><p key={i}>{l}</p>)}</div>}
          <div style={interviewFlowStyle}>
            {feature.content.map((block, idx) => (
              <div key={idx} style={interviewTurnStyle}>
                <p><strong>製：</strong>{block.q}</p>
                <p><strong>{feature.interviewee}：</strong>{block.a}</p>
              </div>
            ))}
          </div>
          {feature.links?.length ? (
            <div style={articleLinksSectionStyle}>
              <h2 style={articleLinksTitleStyle}>{feature.linksTitle ?? `${feature.interviewee} 的網路連結`}</h2>
              <div style={articleLinksListStyle}>
                {feature.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={articleLinkStyle}
                  >
                    {link.label}：{link.url}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div style={innerContainer}>
      <div style={{paddingTop: '8rem'}}>
        <h2 style={sectionTitleStyle}>跨界合作 / FEATURES</h2>
        <div style={featureGridStyle}>
          {FEATURES_DATA.map(f => (
            <article key={f.id} style={featureCardStyle}>
              <Link
                to={`/features/${f.id}`}
                className="feature-entry-link feature-entry-image"
                aria-label={`閱讀 ${f.title}`}
                style={{ display: 'block', cursor: 'pointer' }}
              >
                <div style={{...featureCardImage, backgroundImage: `url("${f.image}")`}}>
                  <div style={imageOverlay} />
                </div>
              </Link>
              <div style={featureCardContent}>
                <Link
                  to={`/features/${f.id}`}
                  className="feature-entry-link feature-entry-title"
                  style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', width: 'fit-content' }}
                >
                  <h3 style={featureCardTitle}>{f.title}</h3>
                </Link>
                <Link
                  to={`/features/${f.id}`}
                  className="feature-entry-link feature-entry-excerpt"
                  style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                >
                  <p style={featureCardExcerpt}>{f.excerpt}</p>
                </Link>
                <Link
                  to={`/features/${f.id}`}
                  className="feature-entry-link feature-entry-readmore"
                  style={{ ...readMoreLinkStyle, cursor: 'pointer' }}
                >
                  READ FULL ARTICLE →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        .feature-entry-link {
          transition: opacity 0.28s ease;
        }
        .feature-entry-link:hover {
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/features" element={<Features />} />
          <Route path="/features/:id" element={<Features />} />
        </Routes>
      </Layout>
    </Router>
  );
}

// --- Styles ---

const navStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 8%', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1000, background: 'rgba(252, 251, 247, 0.85)', backdropFilter: 'blur(10px)' };
const logoLinkStyle: React.CSSProperties = { textDecoration: 'none', color: 'inherit' };
const logoTextStyle: React.CSSProperties = { fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0.2rem' };
const navLinksStyle: React.CSSProperties = { gap: '4rem' };
const navLinkStyle: React.CSSProperties = { fontSize: '0.85rem', letterSpacing: '0.15rem', padding: '5px 0', color: 'var(--text-color)', textDecoration: 'none' };
const hamburgerButtonStyle: React.CSSProperties = { width: '28px', height: '22px', position: 'relative' };
const lineStyle: React.CSSProperties = { width: '100%', height: '1.5px', backgroundColor: 'var(--text-color)', transition: '0.4s' };
const mobileMenuOverlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', background: 'var(--bg-color)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' };
const mobileMenuLinksStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '4rem', textAlign: 'center' };
const mainStyle: React.CSSProperties = { width: '100%' };
const innerContainer: React.CSSProperties = { maxWidth: '1200px', margin: '0 auto', padding: '0 5%' };
const pagePadding: React.CSSProperties = { paddingBottom: '10rem' };
const fullHeroStyle: React.CSSProperties = { height: '100vh', width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', backgroundImage: 'url("/images/home-bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', color: 'white' };
const heroBackgroundOverlay: React.CSSProperties = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(1px)' };
const heroContentContainer: React.CSSProperties = { position: 'relative', zIndex: 2 };
const heroBigTitleStyle: React.CSSProperties = { fontSize: 'clamp(4rem, 15vw, 10rem)', letterSpacing: '1.5rem', marginBottom: '2rem', fontWeight: 400, textShadow: '0 10px 30px rgba(0,0,0,0.25)' };
const heroSubText: React.CSSProperties = { fontSize: '1.2rem', letterSpacing: '0.2rem', lineHeight: '2', fontWeight: 300 };
const ctaButtonStyle: React.CSSProperties = { padding: '1.2rem 4rem', border: '1px solid white', color: 'white', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '0.2rem', transition: '0.4s' };
const sectionGap: React.CSSProperties = { marginTop: '12rem' };
const sectionTitleStyle: React.CSSProperties = { fontSize: '1.6rem', borderBottom: '1.5px solid #ccc', paddingBottom: '1.5rem', marginBottom: '4.5rem', letterSpacing: '0.15rem' };
const newsContainerStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '5rem' };
const newsItemStyle: React.CSSProperties = { padding: '3rem', border: '1px solid #d0d0d0', background: 'rgba(255,255,255,0.65)' };
const itemTitleStyle: React.CSSProperties = { fontSize: '1.4rem', marginBottom: '2rem', fontWeight: 600 };
const newsTextStyle: React.CSSProperties = { fontSize: '1rem', lineHeight: '2.1', color: '#000' };
const contactListStyle: React.CSSProperties = { marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' };
const textLinkStyle: React.CSSProperties = { color: 'var(--text-color)', textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '0.1rem', borderBottom: '1px solid #bbb' };
const stockistGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' };
const stockistCardStyle: React.CSSProperties = { padding: '3rem 2rem', border: '1px solid #d0d0d0', textAlign: 'center', textDecoration: 'none', color: 'inherit', background: '#fff' };
const issueCardStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column' };
const issueImageContainer: React.CSSProperties = { width: '100%', aspectRatio: '3/4.2', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', backgroundColor: '#ccc' };
const imageOverlay: React.CSSProperties = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.05)' };
const dateStyle: React.CSSProperties = { fontSize: '0.8rem', color: '#888', display: 'block', marginBottom: '2rem', letterSpacing: '0.05rem' };
const issueContentClassic: React.CSSProperties = { fontSize: '0.9rem', lineHeight: '2.1', color: '#222', marginTop: '1.5rem' };
const featureGridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '8rem 5rem', marginBottom: '10rem' };
const featureCardStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '2rem' };
const featureCardImage: React.CSSProperties = { width: '100%', height: '420px', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', backgroundColor: '#ccc' };
const featureCardContent: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '1.5rem' };
const featureCardTitle: React.CSSProperties = { fontSize: '1.8rem', fontWeight: 600, lineHeight: '1.4' };
const featureCardExcerpt: React.CSSProperties = {
  fontSize: '1rem',
  lineHeight: '1.9',
  color: '#333',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};
const readMoreLinkStyle: React.CSSProperties = { fontSize: '0.75rem', letterSpacing: '0.2rem', color: 'var(--text-color)', textDecoration: 'none', fontWeight: 600, borderBottom: '1.5px solid #bbb', width: 'fit-content', paddingBottom: '5px', };
const articlePageStyle: React.CSSProperties = { minHeight: '100vh', background: '#fff', position: 'relative', zIndex: 10 };
const backButtonStyle: React.CSSProperties = { position: 'fixed', top: '6.5rem', left: '5%', zIndex: 100, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(5px)', border: '1px solid #ccc', padding: '0.8rem 1.5rem', fontSize: '0.7rem', letterSpacing: '0.2rem', cursor: 'pointer' };
const articleHeroImage: React.CSSProperties = { width: '100%', height: '85vh', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' };
const articleBodyContainer: React.CSSProperties = { maxWidth: '850px', margin: '0 auto', padding: '8rem 2rem 15rem 2rem' };
const articleTitleStyle: React.CSSProperties = { fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: '1.2', marginBottom: '6rem', textAlign: 'center' };
const prefaceStyle: React.CSSProperties = { fontSize: '1.1rem', lineHeight: '2.2', color: '#444', marginBottom: '6rem', fontStyle: 'italic', borderLeft: '3px solid #ccc', paddingLeft: '2rem' };
const interviewFlowStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '4.5rem' };
const interviewTurnStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '2.2rem', fontSize: '1.2rem', lineHeight: '2.4', color: '#000' };
const articleLinksSectionStyle: React.CSSProperties = { marginTop: '8rem', paddingTop: '3rem', borderTop: '1px solid #ccc' };
const articleLinksTitleStyle: React.CSSProperties = { fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: 600 };
const articleLinksListStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '1rem' };
const articleLinkStyle: React.CSSProperties = { color: 'var(--text-color)', textDecoration: 'none', borderBottom: '1px solid #bbb', width: 'fit-content', lineHeight: '1.9' };
const footerStyle: React.CSSProperties = { padding: '8rem 0', borderTop: '1px solid #ccc', textAlign: 'center', fontSize: '0.75rem', letterSpacing: '0.2rem', color: '#888' };
const mistLayerStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 };
