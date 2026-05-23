import { useState, useEffect } from 'react';

/* ─── Full-page result view ──────────────────────────── */
function ResultPage({ result, previewUrl, onBack }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const confidence = result.confidence != null
    ? `${(result.confidence * 100).toFixed(0)}%`
    : null;

  return (
    <div className="result-page">
      {/* Sticky navbar */}
      <nav className="result-nav animate-fade-in">
        <span className="result-nav-brand">✦ L'AI ZLAYJI ✦</span>
        <button className="btn-back" onClick={onBack}>
          ← Nouvelle analyse
        </button>
      </nav>

      <div className="result-page-inner">
        {/* Hero banner */}
        <div className="result-hero animate-fade-in">
          {/* Horseshoe-arch image frame */}
          {previewUrl && (
            <div className="result-arch-frame animate-scale-in" style={{ animationDelay: '0.15s' }}>
              <img src={previewUrl} alt={result.object_name} />
            </div>
          )}

          <div className="hero-badge animate-fade-in" style={{ animationDelay: '0.2s' }}>
            ✦ Patrimoine Marocain Identifié ✦
          </div>

          <h1 className="result-name animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {result.object_name}
          </h1>

          {confidence && (
            <span className="confidence-badge animate-fade-in" style={{ animationDelay: '0.4s' }}>
              ✓ {confidence} de précision
            </span>
          )}
        </div>

        {/* Moroccan separator */}
        <div className="moroccan-sep animate-fade-in" style={{ animationDelay: '0.45s' }}>
          <span></span>✦ ◆ ✦<span></span>
        </div>

        {/* Content cards */}
        <div className="result-grid">

          {result.description && (
            <div className="result-card animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <h3>Description</h3>
              <p>{result.description}</p>
            </div>
          )}

          {result.historical_context && (
            <div className="result-card animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <h3>Contexte Historique</h3>
              <p>{result.historical_context}</p>
            </div>
          )}

          {result.origin && (
            <div className="result-card animate-fade-in" style={{ animationDelay: '0.65s' }}>
              <div className="result-card-icon">🗺️</div>
              <h3>Origine & Région</h3>
              <p>{result.origin}</p>
            </div>
          )}

          {result.cultural_significance && (
            <div className="result-card animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <div className="result-card-icon">🌙</div>
              <h3>Signification Culturelle</h3>
              <p>{result.cultural_significance}</p>
            </div>
          )}

          {result.materials && (
            <div className="result-card animate-fade-in" style={{ animationDelay: '0.75s' }}>
              <div className="result-card-icon">🏺</div>
              <h3>Matériaux & Techniques</h3>
              <p>{result.materials}</p>
            </div>
          )}

          {result.conservation && (
            <div className="result-card animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <div className="result-card-icon">🛡️</div>
              <h3>Conservation</h3>
              <p>{result.conservation}</p>
            </div>
          )}

          {/* Catch-all for any extra fields the API might return */}
          {Object.entries(result)
            .filter(([k]) => !['object_name', 'confidence', 'description',
              'historical_context', 'origin', 'cultural_significance',
              'materials', 'conservation'].includes(k))
            .map(([key, val], i) => val && typeof val === 'string' && (
              <div key={key} className="result-card animate-fade-in"
                style={{ animationDelay: `${0.85 + i * 0.08}s` }}>
                <div className="result-card-icon">📌</div>
                <h3>{key.replace(/_/g, ' ')}</h3>
                <p>{val}</p>
              </div>
            ))
          }

        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}
          className="animate-fade-in">
          <div className="moroccan-sep" style={{ marginBottom: '2rem' }}>
            <span></span>✦ ◆ ✦<span></span>
          </div>
          <button className="btn-primary" onClick={onBack}>
            ✦ Analyser un autre objet
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main upload / scan view ────────────────────────── */
function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/api/recognize', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de se connecter à l'API. Assurez-vous que le backend FastAPI est démarré.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setResult(null);
  };

  /* ── If we have a result, show the full-page view ── */
  if (result && !isLoading) {
    return <ResultPage result={result} previewUrl={previewUrl} onBack={handleBack} />;
  }

  /* ── Upload / landing view ── */
  return (
    <div className="app-container">
      {/* ─── Hero with Tajine Animation ────────────────── */}
      <header className="hero-section">
        <div className="tajine-animation">
          {/* Steam / golden particles */}
          <div className="tajine-steam">
            <span className="steam-particle" style={{ '--i': 0 }}>✦</span>
            <span className="steam-particle" style={{ '--i': 1 }}>✧</span>
            <span className="steam-particle" style={{ '--i': 2 }}>✦</span>
            <span className="steam-particle" style={{ '--i': 3 }}>◆</span>
            <span className="steam-particle" style={{ '--i': 4 }}>✧</span>
            <span className="steam-particle" style={{ '--i': 5 }}>✦</span>
            <span className="steam-particle" style={{ '--i': 6 }}>✧</span>
            <span className="steam-particle" style={{ '--i': 7 }}>◆</span>
          </div>

          {/* Golden glow behind tajine */}
          <div className="tajine-glow"></div>

          {/* The lid that lifts */}
          <div className="tajine-lid-wrapper">
            <img src="/tajine-lid.png" alt="Couvercle du tajine" className="tajine-lid" />
          </div>

          {/* Title revealed from inside the tajine */}
          <div className="tajine-title-reveal">
            <div className="hero-badge">✦ Maroc · IA · Patrimoine ✦</div>
            <h1 className="hero-title">L'AI ZLAYJI</h1>
            <span className="hero-arabic">الثرات المغربي</span>
          </div>

          {/* The base stays in place */}
          <div className="tajine-base-wrapper">
            <img src="/tajine-base.png" alt="Base du tajine" className="tajine-base" />
          </div>
        </div>

        <p className="hero-subtitle tajine-subtitle-reveal">
          Découvrez les trésors cachés de la culture marocaine grâce à
          l'intelligence artificielle. Analysez un objet, un monument ou
          un motif pour en révéler toute l'histoire.
        </p>
      </header>

      {/* ─── Two panels ──────────────────────────────── */}
      <main className="grid-2">

        {/* Panel 1 — Upload */}
        <section className="glass-panel animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="panel-title">
            <span className="panel-step">1</span>
            <h2 style={{ fontSize: '1.25rem' }}>Scannez un objet</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Téléversez une image de zellige, de poterie, d'un monument ou
            d'un motif marocain.
          </p>

          <div className={`upload-area ${selectedFile ? 'has-file' : ''}`}>
            <input
              type="file"
              className="upload-input"
              accept="image/*"
              onChange={handleFileChange}
            />
            {previewUrl ? (
              <img src={previewUrl} alt="Aperçu" className="preview-image" />
            ) : (
              <div>
                <span className="upload-icon">🕌</span>
                <p>Cliquez ou glissez une image ici</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.4rem', opacity: 0.6 }}>
                  JPG · PNG · WEBP
                </p>
              </div>
            )}
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              className="btn-primary"
              onClick={handleAnalyze}
              disabled={!selectedFile || isLoading}
            >
              {isLoading ? (
                <><span className="loader"></span> Analyse en cours…</>
              ) : (
                <>✦ Révéler l'histoire</>
              )}
            </button>
          </div>

          {error && <div className="error-msg">{error}</div>}
        </section>

        {/* Panel 2 — Result preview / waiting */}
        <section className="glass-panel animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="panel-title">
            <span className="panel-step">2</span>
            <h2 style={{ fontSize: '1.25rem' }}>Médiation Culturelle</h2>
          </div>

          {!isLoading && (
            <div className="waiting-state">
              <span>🏺</span>
              <p>En attente d'un objet à analyser…</p>
            </div>
          )}

          {isLoading && (
            <div className="loading-state">
              <div className="loader" style={{ width: 48, height: 48, borderWidth: 4 }}></div>
              <p>Consultation des archives virtuelles…</p>
            </div>
          )}
        </section>
      </main>

      {/* ─── Decorative footer line ──────────────────── */}
      <div className="moroccan-sep animate-fade-in" style={{ marginTop: '4rem', animationDelay: '0.6s' }}>
        <span></span>✦ ◆ ✦<span></span>
      </div>
    </div>
  );
}

export default App;
