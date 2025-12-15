import { useEffect, useState } from "react";

const GuiasLanding = () => {
  const [selectedRegion, setSelectedRegion] = useState("araguaia");

  useEffect(() => {
    const yearElement = document.getElementById("year");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString();
    }
  }, []);

  const regions = {
    araguaia: {
      name: "Rio Araguaia",
      badge: "GUIAS PIONEIROS • RIO ARAGUAIA",
      icon: "🎣",
      title: "Seja encontrado por turistas que já decidiram pescar no Araguaia.",
      subtitle: "A MasterFisher é o portal que conecta turistas apaixonados por pesca aos guias que conhecem o Araguaia de verdade.",
      bulletPoint: "Você guia turistas no Rio Araguaia (barco, pousada, rancho ou acampamento).",
      hookBox: "Conta simples: você paga R$ 50,00 uma vez. Se um único grupo de turistas fechar pescaria pelo portal, o investimento se paga. Todo o resto do ano é lucro.",
      ctaText: "Quero aparecer para turistas",
      ctaSecondary: "Oferta especial para os primeiros guias do Araguaia.",
      faqRegion: "Araguaia",
      tagline: "💡 Só um grupo de turistas no ano já paga seu investimento muitas vezes.",
    },
    pantanal: {
      name: "Pantanal",
      badge: "GUIAS PIONEIROS • PANTANAL",
      icon: "🐊",
      title: "Seja encontrado por turistas que querem pescar no Pantanal.",
      subtitle: "A MasterFisher conecta guias da região do Pantanal a turistas apaixonados por pesca esportiva.",
      bulletPoint: "Você guia turistas no Pantanal (barco, pousada, rancho ou acampamento).",
      hookBox: "Conta simples: você paga R$ 50,00 uma vez. Se um único grupo de turistas fechar pescaria pelo portal, o investimento se paga. Todo o resto do ano é lucro.",
      ctaText: "Quero ser guia no Pantanal",
      ctaSecondary: "Oferta especial para os primeiros guias do Pantanal.",
      faqRegion: "Pantanal",
      tagline: "💡 Só um grupo de turistas no ano já paga seu investimento muitas vezes.",
    },
    amazonas: {
      name: "Amazônia",
      badge: "GUIAS FUNDADORES • AMAZÔNIA",
      icon: "🌿",
      title: "Conecte-se com turistas do Brasil e do mundo que sonham em pescar na Amazônia.",
      subtitle: "A MasterFisher está reunindo os primeiros guias da Amazônia para conectar com turistas apaixonados por pesca esportiva.",
      bulletPoint: "Você guia turistas na Amazônia (rios, lagos, igarapés).",
      hookBox: "Guia fundador: Seja um dos primeiros guias da Amazônia no MasterFisher e ganhe destaque especial no portal. Turistas internacionais vão te encontrar!",
      ctaText: "Quero ser guia da Amazônia",
      ctaSecondary: "Oferta especial para os guias fundadores.",
      faqRegion: "Amazônia",
      tagline: "🌍 Acesso a turistas internacionais que buscam aventuras de pesca na Amazônia.",
    },
  };

  const region = regions[selectedRegion];

  return (
    <div className="guias-landing">
      <style>{`
        .guias-landing {
          --bg: #050816;
          --bg-alt: #0b1020;
          --primary: #1ea672;
          --primary-dark: #15865b;
          --text: #f5f5f5;
          --text-muted: #c0c4d0;
          --accent: #fcd34d;
          --danger: #f97373;
          --card: #101528;
          --border: #1f2937;
          --radius-lg: 14px;
          --radius-xl: 20px;
          --shadow-soft: 0 18px 45px rgba(0, 0, 0, 0.45);
        }

        .guias-landing * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .guias-landing {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: radial-gradient(circle at top, #111827, #020617 60%);
          color: var(--text);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }

        .guias-landing a {
          color: inherit;
          text-decoration: none;
        }

        .guias-landing .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .guias-landing .container {
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
          padding: 20px 16px 48px;
        }

        .guias-landing header {
          padding: 18px 0 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .guias-landing .logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .guias-landing .logo-mark {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 20%, #38bdf8, #0f172a);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 20px;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.6);
        }

        .guias-landing .logo-text-main {
          font-weight: 700;
          font-size: 20px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .guias-landing .logo-text-sub {
          font-size: 12px;
          color: var(--text-muted);
        }

        .guias-landing .badge-top {
          font-size: 11px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(148, 163, 184, 0.08);
          border: 1px solid rgba(148, 163, 184, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.11em;
        }

        .guias-landing .region-selector {
          margin-top: 10px;
          margin-bottom: 10px;
        }

        .guias-landing .region-selector label {
          display: block;
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .guias-landing .region-selector select {
          width: 100%;
          max-width: 300px;
          padding: 10px 14px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.4);
          color: var(--text);
          font-size: 14px;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }

        .guias-landing .region-selector select:hover {
          border-color: var(--primary);
        }

        .guias-landing .region-selector select:focus {
          outline: none;
          border-color: var(--primary);
        }

        .guias-landing main {
          flex: 1;
          display: flex;
          align-items: stretch;
          margin-top: 10px;
        }

        .guias-landing .layout {
          display: grid;
          grid-template-columns: minmax(0, 3fr) minmax(0, 2.7fr);
          gap: 24px;
          align-items: flex-start;
        }

        @media (max-width: 900px) {
          .guias-landing .layout {
            grid-template-columns: 1fr;
          }
          .guias-landing header {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        .guias-landing .card {
          background: linear-gradient(145deg, #020617, #020617 55%, #020617);
          border-radius: 26px;
          border: 1px solid rgba(148, 163, 184, 0.25);
          padding: 26px 24px 24px;
          box-shadow: var(--shadow-soft);
          position: relative;
          overflow: hidden;
        }

        .guias-landing .card::before {
          content: "";
          position: absolute;
          inset: -30%;
          background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.12), transparent 55%);
          opacity: 0.8;
          pointer-events: none;
        }

        .guias-landing .pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.4);
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .guias-landing .pill-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #22c55e;
          box-shadow: 0 0 12px rgba(34, 197, 94, 0.9);
        }

        .guias-landing .hero-title {
          font-size: clamp(26px, 4vw, 34px);
          line-height: 1.1;
          margin-top: 16px;
          margin-bottom: 10px;
        }

        .guias-landing .hero-title span.highlight {
          background: linear-gradient(90deg, #f97316, #facc15);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .guias-landing .hero-subtitle {
          font-size: 14px;
          color: var(--text-muted);
          max-width: 520px;
        }

        .guias-landing .hero-subtitle strong {
          color: #e5e7eb;
        }

        .guias-landing .hero-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 18px;
          margin-bottom: 20px;
        }

        .guias-landing .stat {
          padding: 10px 10px;
          border-radius: 16px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(30, 64, 175, 0.7);
        }

        .guias-landing .stat-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: var(--text-muted);
          margin-bottom: 2px;
        }

        .guias-landing .stat-value {
          font-size: 18px;
          font-weight: 700;
        }

        .guias-landing .stat-note {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .guias-landing .hook-box {
          margin-top: 4px;
          padding: 10px 11px;
          border-radius: 14px;
          background: rgba(15, 23, 42, 0.9);
          border: 1px dashed rgba(148, 163, 184, 0.6);
          font-size: 13px;
        }

        .guias-landing .hook-box strong {
          color: var(--accent);
        }

        .guias-landing .cta-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-top: 18px;
        }

        .guias-landing .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: #0b1120;
          font-weight: 700;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          box-shadow: 0 15px 30px rgba(16, 185, 129, 0.45);
          transition: transform 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease;
        }

        .guias-landing .btn-primary span.icon {
          font-size: 18px;
        }

        .guias-landing .btn-primary:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
          box-shadow: 0 20px 40px rgba(16, 185, 129, 0.6);
        }

        .guias-landing .btn-secondary {
          font-size: 12px;
          padding: 9px 12px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.4);
          background: rgba(15, 23, 42, 0.8);
          cursor: pointer;
        }

        .guias-landing .secure-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          font-size: 11px;
          color: var(--text-muted);
        }

        .guias-landing .secure-dot {
          width: 16px;
          height: 16px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
        }

        .guias-landing .sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .guias-landing .card-secondary {
          background: radial-gradient(circle at top, #020617, #020617 70%);
          border-radius: 22px;
          border: 1px solid rgba(148, 163, 184, 0.25);
          padding: 20px 18px 18px;
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.9);
          position: relative;
          overflow: hidden;
        }

        .guias-landing .card-secondary::before {
          content: "";
          position: absolute;
          inset: -20%;
          background: radial-gradient(circle at top right, rgba(96, 165, 250, 0.18), transparent 55%);
          opacity: 0.9;
          pointer-events: none;
        }

        .guias-landing .card-title {
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--text-muted);
          margin-bottom: 6px;
        }

        .guias-landing .card-heading {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .guias-landing .bullet-list {
          list-style: none;
          margin: 8px 0 6px;
          padding: 0;
          font-size: 13px;
        }

        .guias-landing .bullet-list li {
          display: flex;
          gap: 8px;
          margin-bottom: 6px;
        }

        .guias-landing .bullet-dot {
          margin-top: 4px;
          font-size: 13px;
        }

        .guias-landing .price-tag {
          margin-top: 10px;
          padding: 10px 11px;
          border-radius: 14px;
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(52, 211, 153, 0.7);
          display: flex;
          flex-direction: column;
          gap: 3px;
          font-size: 13px;
        }

        .guias-landing .price-main {
          font-size: 20px;
          font-weight: 700;
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .guias-landing .price-main span.period {
          font-size: 12px;
          color: var(--text-muted);
        }

        .guias-landing .price-note {
          font-size: 11px;
          color: var(--text-muted);
        }

        .guias-landing .tagline {
          font-size: 12px;
          color: var(--accent);
          margin-top: 8px;
        }

        .guias-landing .faq {
          background: rgba(15, 23, 42, 0.95);
          border-radius: 18px;
          border: 1px solid rgba(148, 163, 184, 0.25);
          padding: 16px 15px 14px;
          font-size: 13px;
        }

        .guias-landing .faq-title {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: var(--text-muted);
          margin-bottom: 6px;
        }

        .guias-landing .faq-item {
          margin-bottom: 7px;
        }

        .guias-landing .faq-item strong {
          display: block;
          font-size: 12px;
          margin-bottom: 1px;
        }

        .guias-landing .faq-item p {
          color: var(--text-muted);
          font-size: 12px;
        }

        .guias-landing footer {
          padding: 16px 0 8px;
          font-size: 11px;
          color: #6b7280;
          text-align: center;
        }

        @media (max-width: 600px) {
          .guias-landing .card {
            padding: 20px 18px 20px;
          }
          .guias-landing .hero-grid {
            grid-template-columns: 1fr;
          }
          .guias-landing .cta-row {
            flex-direction: column;
            align-items: stretch;
          }
          .guias-landing .btn-primary,
          .guias-landing .btn-secondary {
            width: 100%;
            justify-content: center;
            text-align: center;
          }
        }
      `}</style>

      <div className="page">
        <div className="container">
          <header>
            <div className="logo">
              <div className="logo-mark">MF</div>
              <div>
                <div className="logo-text-main">MasterFisher</div>
                <div className="logo-text-sub">Portal de guias de pesca • Brasil</div>
              </div>
            </div>
            <div className="badge-top">{region.badge}</div>
          </header>

          <div className="region-selector">
            <label htmlFor="region">Selecione sua região:</label>
            <select
              id="region"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="araguaia">Rio Araguaia</option>
              <option value="pantanal">Pantanal</option>
              <option value="amazonas">Amazônia</option>
            </select>
          </div>

          <main>
            <div className="layout">
              <section className="card">
                <div className="pill">
                  <span className="pill-dot"></span>
                  Você guia no {region.name}?
                </div>

                <h1 className="hero-title">
                  <span className="highlight">
                    {selectedRegion === "amazonas" ? "Conecte-se" : "Seja encontrado"}
                  </span>{" "}
                  {selectedRegion === "araguaia" && "por turistas que já decidiram pescar no Araguaia."}
                  {selectedRegion === "pantanal" && "por turistas que querem pescar no Pantanal."}
                  {selectedRegion === "amazonas" && "com turistas do Brasil e do mundo que sonham em pescar na Amazônia."}
                </h1>

                <p className="hero-subtitle">
                  A <strong>MasterFisher</strong> {region.subtitle.replace("A MasterFisher ", "")}{" "}
                  Você paga <strong>R$ 50,00 uma única vez por ano</strong> e aparece o ano inteiro.
                </p>

                <div className="hero-grid">
                  <div className="stat">
                    <div className="stat-label">Investimento anual</div>
                    <div className="stat-value">R$ 50,00</div>
                    <div className="stat-note">Sem mensalidade, sem boleto, sem dor de cabeça.</div>
                  </div>
                  <div className="stat">
                    <div className="stat-label">
                      {selectedRegion === "amazonas" ? "Ativação do perfil" : "Ponto de equilíbrio"}
                    </div>
                    <div className="stat-value">
                      {selectedRegion === "amazonas" ? "24 horas" : "1 cliente"}
                    </div>
                    <div className="stat-note">
                      {selectedRegion === "amazonas"
                        ? "Seu perfil fica visível em até 1 dia útil."
                        : "Se apenas 1 turista fechar com você, já valeu."}
                    </div>
                  </div>
                </div>

                <div className="hook-box">
                  <strong>{selectedRegion === "amazonas" ? "Guia fundador:" : "Conta simples:"}</strong> {region.hookBox.replace(/^(Guia fundador:|Conta simples:)\s*/, "")}
                </div>

                <div className="cta-row">
                  <a
                    className="btn-primary"
                    href="/cadastrar-guia"
                  >
                    <span className="icon">{region.icon}</span>
                    <span>{region.ctaText}</span>
                  </a>

                  <div className="btn-secondary">{region.ctaSecondary}</div>
                </div>

                <div className="secure-row">
                  <div className="secure-dot">🔒</div>
                  <span>
                    Pagamento 100% seguro via Mercado Pago.{" "}
                    {selectedRegion === "amazonas" ? "Aceita cartões internacionais." : "Pague com cartão em poucos segundos."}
                  </span>
                </div>

                {/* Content moved from card-secondary */}
                <div style={{ marginTop: "40px", paddingTop: "30px", borderTop: "1px solid rgba(148, 163, 184, 0.2)" }}>
                  <div className="card-title">Para quem é</div>
                  <h2 className="card-heading">
                    {selectedRegion === "amazonas"
                      ? "Guias que querem atrair turistas do Brasil e do mundo."
                      : "Guias de pesca que querem parar de depender só da indicação."}
                  </h2>

                  <ul className="bullet-list">
                    <li>
                      <span className="bullet-dot">✅</span>
                      <span>{region.bulletPoint}</span>
                    </li>
                    <li>
                      <span className="bullet-dot">✅</span>
                      <span>
                        {selectedRegion === "amazonas"
                          ? "Quer ser encontrado por turistas nacionais e internacionais."
                          : "Quer ser encontrado por quem já está vindo pescar na região."}
                      </span>
                    </li>
                    <li>
                      <span className="bullet-dot">✅</span>
                      <span>
                        {selectedRegion === "amazonas"
                          ? "Quer ter destaque especial como guia fundador."
                          : "Não quer se incomodar com mensalidade e boletos todo mês."}
                      </span>
                    </li>
                  </ul>

                  <div className="price-tag">
                    <div className="price-main">
                      R$ 50,00
                      <span className="period">/ ano</span>
                    </div>
                    <div className="price-note">
                      Você paga uma vez. Seu nome e contato ficam visíveis no portal MasterFisher por{" "}
                      <strong>12 meses</strong>.
                    </div>
                  </div>

                  <div className="tagline">{region.tagline}</div>

                  <div style={{ marginTop: "12px" }}>
                    <a
                      className="btn-primary"
                      style={{ width: "100%", justifyContent: "center", fontSize: "13px" }}
                      href="/cadastrar-guia"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="icon">🚤</span>
                      <span>Quero ser guia MasterFisher</span>
                    </a>
                  </div>
                </div>
              </section>

              <aside className="sidebar">
                <section className="faq">
                  <div className="faq-title">Perguntas rápidas</div>

                  <div className="faq-item">
                    <strong>É mensalidade?</strong>
                    <p>
                      Não. Você paga <strong>R$ 50,00 uma única vez</strong> e fica 1 ano no ar. Sem boleto e sem
                      cobrança mensal.
                    </p>
                  </div>

                  <div className="faq-item">
                    <strong>Como eu pago?</strong>
                    <p>
                      O pagamento é feito via <strong>Mercado Pago</strong>, plataforma internacional segura.{" "}
                      {selectedRegion === "amazonas"
                        ? "Aceita cartões de crédito do Brasil e do exterior."
                        : "Você pode pagar com cartão, em poucos segundos."}
                    </p>
                  </div>

                  <div className="faq-item">
                    <strong>O que eu ganho ao entrar?</strong>
                    <p>
                      Seu nome, cidade, modalidades de pesca e contato (WhatsApp / Instagram) aparecerão no portal
                      MasterFisher para turistas que buscam guias no {region.faqRegion}.
                    </p>
                  </div>

                  <div className="faq-item">
                    <strong>Como vocês vão trazer turistas?</strong>
                    <p>
                      A MasterFisher vai produzir conteúdo sobre pesca no {region.faqRegion}, divulgar nas redes sociais e atrair
                      turistas {selectedRegion === "amazonas" ? "do Brasil e do mundo" : "para o portal"}. Quando eles chegarem, você já estará lá.
                    </p>
                  </div>

                  <div className="faq-item">
                    <strong>
                      {selectedRegion === "amazonas" ? 'O que é "guia fundador"?' : "A oferta de R$ 50,00 é para sempre?"}
                    </strong>
                    <p>
                      {selectedRegion === "amazonas"
                        ? "Os primeiros guias da Amazônia recebem destaque especial no portal e um badge de \"Guia Fundador\", mostrando que você foi um dos pioneiros."
                        : "Não. Esse é um valor promocional para os guias pioneiros. No futuro, o valor poderá ser ajustado para novos cadastros."}
                    </p>
                  </div>
                </section>
              </aside>
            </div>
          </main>

          <footer>
            MasterFisher &copy; <span id="year"></span> · Portal de guias de pesca · {region.name} · Brasil
          </footer>
        </div>
      </div>
    </div>
  );
};

export default GuiasLanding;
