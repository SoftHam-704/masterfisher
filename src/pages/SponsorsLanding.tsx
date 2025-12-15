import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";

const SponsorsLanding = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="sponsors-landing">
            <Header />
            <style>{`
        .sponsors-landing {
           --bg:#050816;
           --card:#020617;
           --primary:#1ea672;
           --secondary:#38bdf8;
           --text:#e5e7eb;
           --muted:#94a3b8;
           min-height: 100vh;
           background: linear-gradient(180deg,#020617,#050816);
           color: var(--text);
           font-family: system-ui,-apple-system,Segoe UI,sans-serif;
        }

        .sponsors-landing .container-custom {
          max-width:1100px;
          margin:auto;
          padding:40px 20px;
        }

        .sponsors-landing .hero {
          text-align:center;
          padding:80px 20px 60px;
        }

        .sponsors-landing .hero h1 {
          font-size:42px;
          line-height:1.1;
          margin-bottom:20px;
        }

        .sponsors-landing .hero span {
          color:var(--primary);
        }

        .sponsors-landing .hero p {
          font-size:18px;
          color:var(--muted);
          max-width:800px;
          margin:auto;
        }

        .sponsors-landing .cta-button {
          display:inline-block;
          margin-top:30px;
          padding:18px 30px;
          background:var(--primary);
          color:#001 !important;
          font-weight:700;
          border-radius:999px;
          text-decoration:none;
          font-size:16px;
        }

        .sponsors-landing .section {
          margin-top:80px;
        }

        .sponsors-landing .section h2 {
          font-size:32px;
          margin-bottom:20px;
        }

        .sponsors-landing .grid {
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
          gap:20px;
        }

        .sponsors-landing .card-custom {
          background:var(--card);
          border:1px solid rgba(148,163,184,.15);
          border-radius:20px;
          padding:24px;
        }

        .sponsors-landing .card-custom h3 {
          margin-top:0;
          color:var(--secondary);
          font-size: 1.17em;
          font-weight: bold;
        }

        .sponsors-landing .metric {
          font-size:28px;
          font-weight:800;
          color:var(--primary);
        }

        .sponsors-landing .card-custom p {
          color:var(--muted);
          font-size:15px;
        }

        .sponsors-landing .highlight {
          background:linear-gradient(135deg,#0f172a,#020617);
          border-radius:24px;
          padding:40px;
          text-align:center;
        }

        .sponsors-landing .highlight h2 {
          margin-top:0;
        }

        .sponsors-landing .badge {
          display:inline-block;
          padding:6px 14px;
          border-radius:999px;
          background:rgba(30,166,114,.15);
          color:var(--primary);
          font-weight:600;
          font-size:13px;
        }

        .sponsors-landing footer {
          text-align:center;
          padding:40px 20px;
          color:var(--muted);
          font-size:13px;
        }
      `}</style>

            <section className="hero">
                <div className="container-custom">
                    <h1>
                        Conecte sua marca<br />
                        ao <span>maior crescimento da pesca esportiva no Brasil</span>
                    </h1>
                    <p>
                        A MasterFisher é o portal que conecta turistas aos melhores guias de pesca do Brasil,
                        criando um ecossistema perfeito para marcas que querem estar
                        onde a decisão de compra acontece.
                    </p>
                    <a href="#contato" className="cta-button">Quero ser patrocinador</a>
                </div>
            </section>

            <section className="section container-custom">
                <h2>Um mercado em plena expansão</h2>
                <div className="grid">
                    <div className="card-custom">
                        <div className="metric">US$ 20 bi</div>
                        <p>Turismo de pesca movimentado anualmente no mundo</p>
                    </div>
                    <div className="card-custom">
                        <div className="metric">9 milhões</div>
                        <p>De pescadores ativos no Brasil</p>
                    </div>
                    <div className="card-custom">
                        <div className="metric">30–40%</div>
                        <p>Crescimento anual do setor nos últimos anos</p>
                    </div>
                    <div className="card-custom">
                        <div className="metric">202</div>
                        <p>Destinos oficiais de pesca em 18 estados brasileiros</p>
                    </div>
                </div>
            </section>

            <section className="section container-custom">
                <div className="highlight">
                    <span className="badge">Por que a MasterFisher?</span>
                    <h2>Porque sua marca aparece antes da compra</h2>
                    <p>
                        Diferente de anúncios genéricos, a MasterFisher posiciona sua marca
                        exatamente no momento em que o turista está planejando sua pescaria,
                        escolhendo destino, guia e equipamento.
                    </p>
                </div>
            </section>

            <section className="section container-custom">
                <h2>Onde sua marca aparece</h2>
                <div className="grid">
                    <div className="card-custom">
                        <h3>🌎 Regiões Premium</h3>
                        <p>Araguaia, Pantanal e Amazônia — os destinos mais desejados do Brasil.</p>
                    </div>
                    <div className="card-custom">
                        <h3>🎣 Guias Profissionais</h3>
                        <p>Exposição direta para guias que influenciam decisões de equipamentos.</p>
                    </div>
                    <div className="card-custom">
                        <h3>📲 Conteúdo & Experiência</h3>
                        <p>Presença em conteúdos, perfis, páginas regionais e materiais especiais.</p>
                    </div>
                </div>
            </section>

            <section className="section container-custom">
                <div className="highlight">
                    <h2>Exclusividade real</h2>
                    <p>
                        Aceitamos <strong>apenas uma marca MASTER por região</strong>.
                        Sem concorrência direta.
                        Quem entra primeiro, ocupa o espaço.
                    </p>
                    <a href="#contato" className="cta-button">Quero reservar uma região</a>
                </div>
            </section>

            <section id="contato" className="section container-custom">
                <h2>Vamos conversar</h2>
                <p style={{ color: 'var(--muted)' }}>
                    Se sua marca busca posicionamento estratégico, autoridade
                    e conexão real com pescadores e turistas,
                    a MasterFisher é o próximo passo.
                </p>
                <a href="mailto:comercial@masterfisher.com.br" className="cta-button">
                    Falar com o time comercial
                </a>
            </section>

            <footer>
                MasterFisher © 2025<br />
                Portal que conecta turistas aos melhores guias de pesca do Brasil
            </footer>
        </div>
    );
};

export default SponsorsLanding;
