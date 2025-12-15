import { useEffect } from "react";
import Header from "@/components/Header";

const MasterSponsorLanding = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="master-sponsor-landing">
            <Header />
            <style>{`
        .master-sponsor-landing {
           --bg:#050816;
           --card:#020617;
           --primary:#1ea672;
           --accent:#38bdf8;
           --text:#e5e7eb;
           --muted:#94a3b8;
           min-height: 100vh;
           background: linear-gradient(180deg,#020617,#050816);
           color: var(--text);
           font-family: system-ui,-apple-system,Segoe UI,sans-serif;
        }

        .master-sponsor-landing .container-custom {
          max-width:1100px;
          margin:auto;
          padding:40px 20px;
        }

        .master-sponsor-landing .hero {
          text-align:center;
          padding:90px 20px 70px;
        }

        .master-sponsor-landing .hero h1 {
          font-size:44px;
          line-height:1.1;
          margin-bottom:20px;
        }

        .master-sponsor-landing .hero span {
          color:var(--primary);
        }

        .master-sponsor-landing .hero p {
          font-size:18px;
          color:var(--muted);
          max-width:850px;
          margin:auto;
        }

        .master-sponsor-landing .cta-button {
          display:inline-block;
          margin-top:35px;
          padding:18px 34px;
          background:var(--primary);
          color:#001 !important;
          font-weight:800;
          border-radius:999px;
          text-decoration:none;
          font-size:16px;
        }

        .master-sponsor-landing .section {
          margin-top:90px;
        }

        .master-sponsor-landing .section h2 {
          font-size:34px;
          margin-bottom:20px;
        }

        .master-sponsor-landing .grid {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
          gap:22px;
        }

        .master-sponsor-landing .card-custom {
          background:var(--card);
          border:1px solid rgba(148,163,184,.15);
          border-radius:22px;
          padding:26px;
        }

        .master-sponsor-landing .card-custom h3 {
          margin-top:0;
          color:var(--accent);
          font-size: 1.17em;
          font-weight: bold;
        }

        .master-sponsor-landing .metric {
          font-size:30px;
          font-weight:800;
          color:var(--primary);
        }

        .master-sponsor-landing .card-custom p {
          color:var(--muted);
          font-size:15px;
        }

        .master-sponsor-landing .highlight {
          background:linear-gradient(135deg,#0f172a,#020617);
          border-radius:26px;
          padding:46px;
          text-align:center;
        }

        .master-sponsor-landing .badge {
          display:inline-block;
          padding:7px 16px;
          border-radius:999px;
          background:rgba(30,166,114,.15);
          color:var(--primary);
          font-weight:700;
          font-size:13px;
          margin-bottom:12px;
        }

        .master-sponsor-landing footer {
          text-align:center;
          padding:50px 20px;
          color:var(--muted);
          font-size:13px;
        }
      `}</style>

            {/* HERO */}
            <section className="hero">
                <div className="container-custom">
                    <span className="badge">Posição Exclusiva</span>
                    <h1>
                        Seja a <span>marca líder</span><br />
                        da pesca esportiva nas principais regiões do Brasil
                    </h1>
                    <p>
                        O Patrocínio MASTER da MasterFisher oferece exclusividade total por região,
                        posicionando sua marca no centro das decisões de guias e turistas
                        que movimentam o turismo de pesca no Brasil.
                    </p>
                    <a href="#contato" className="cta-button">Quero ser Patrocinador MASTER</a>
                </div>
            </section>

            {/* MERCADO */}
            <section className="section container-custom">
                <h2>Por que esta posição é estratégica</h2>
                <div className="grid">
                    <div className="card-custom">
                        <div className="metric">9 milhões</div>
                        <p>Pescadores ativos no Brasil</p>
                    </div>
                    <div className="card-custom">
                        <div className="metric">30–40%</div>
                        <p>Crescimento anual do setor</p>
                    </div>
                    <div className="card-custom">
                        <div className="metric">202</div>
                        <p>Destinos oficiais de pesca</p>
                    </div>
                    <div className="card-custom">
                        <div className="metric">US$ 20 bi</div>
                        <p>Movimentados pelo turismo de pesca no mundo</p>
                    </div>
                </div>
            </section>

            {/* EXCLUSIVIDADE */}
            <section className="section container-custom">
                <div className="highlight">
                    <span className="badge">Exclusividade Real</span>
                    <h2>Apenas uma marca MASTER por região</h2>
                    <p>
                        Cada região estratégica da MasterFisher aceita <strong>apenas um patrocinador MASTER</strong>.
                        Isso significa ausência total de concorrentes diretos,
                        máxima exposição e domínio de atenção.
                    </p>
                </div>
            </section>

            {/* BENEFÍCIOS */}
            <section className="section container-custom">
                <h2>O que a marca MASTER recebe</h2>
                <div className="grid">
                    <div className="card-custom">
                        <h3>🏆 Exclusividade Regional</h3>
                        <p>Sua marca será a única associada à região escolhida (Araguaia, Pantanal ou Amazônia).</p>
                    </div>
                    <div className="card-custom">
                        <h3>🎣 Influência Direta</h3>
                        <p>Exposição contínua para guias que influenciam decisões de compra de equipamentos.</p>
                    </div>
                    <div className="card-custom">
                        <h3>🌍 Turismo & Experiência</h3>
                        <p>Presença na jornada completa do turista, do planejamento à pescaria.</p>
                    </div>
                    <div className="card-custom">
                        <h3>📊 Inteligência de Mercado</h3>
                        <p>Acesso a dados consolidados de comportamento, buscas e interesse regional.</p>
                    </div>
                </div>
            </section>

            {/* POSICIONAMENTO */}
            <section className="section container-custom">
                <div className="highlight">
                    <h2>Isso não é publicidade. É posicionamento.</h2>
                    <p>
                        O Patrocínio MASTER não concorre por atenção.
                        Ele ocupa o espaço principal da pesca esportiva
                        em uma das regiões mais desejadas do Brasil.
                    </p>
                </div>
            </section>

            {/* CTA FINAL */}
            <section id="contato" className="section container-custom">
                <h2>Vamos conversar</h2>
                <p style={{ color: 'var(--muted)' }}>
                    Se sua marca busca liderança, autoridade e presença estratégica
                    no turismo de pesca brasileiro,
                    a posição MASTER foi criada para isso.
                </p>
                <a href="mailto:comercial@masterfisher.com.br" className="cta-button">
                    Reservar posição MASTER
                </a>
            </section>

            <footer>
                MasterFisher © 2025<br />
                Portal que conecta turistas aos melhores guias de pesca do Brasil
            </footer>
        </div>
    );
};

export default MasterSponsorLanding;
