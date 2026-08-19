type Status = "good" | "warn" | "bad";

interface StripeLink {
  plan: string;
  amount: string;
  url?: string;
}

interface Product {
  name: string;
  tag: string;
  color: string;
  domain: string;
  domainUrl?: string;
  domainNote?: string;
  domainStatus: Status;
  domainDetail?: string;
  stripeStatus: Status;
  stripeLabel: string;
  stripeLinks: StripeLink[];
  calendlyStatus: Status;
  calendlyLabel: string;
  calendlyNote: string;
  seoStatus: Status;
  seoLabel: string;
  seoScore?: number;
  seoNote: string;
  todo: string[];
}

const PRODUCTS: Product[] = [
  {
    name: "HostIA",
    tag: "Agent vocal IA · restaurants",
    color: "var(--hostia)",
    domain: "hostia.agentimpact.fr",
    domainUrl: "https://hostia.agentimpact.fr",
    domainStatus: "good",
    stripeStatus: "warn",
    stripeLabel: "Test seulement",
    stripeLinks: [
      { plan: "Simple", amount: "150 €/mo", url: "https://buy.stripe.com/test_bJe28scVR0Va5fb9BW3ks00" },
      { plan: "Medium", amount: "350 €/mo", url: "https://buy.stripe.com/test_eVq4gAf3ZavK0YVeWg3ks01" },
      { plan: "Luxe", amount: "650 €/mo", url: "https://buy.stripe.com/test_bJefZi9JF6fu6jf15q3ks02" },
    ],
    calendlyStatus: "good",
    calendlyLabel: "Branché",
    calendlyNote: "Sous les cartes tarifs, sur la home et /pricing.",
    seoStatus: "warn",
    seoLabel: "78 / 100",
    seoScore: 78,
    seoNote: "JSON-LD cassé → corrigé le 19/08. En-têtes sécurité manquants (CSP, X-Frame-Options).",
    todo: [
      "Basculer Stripe en mode live si vente confirmée",
      "Ajouter en-têtes de sécurité (next.config.js)",
      "Créer les pages mentions légales / CGV / confidentialité (404 actuellement)",
    ],
  },
  {
    name: "PLU IA",
    tag: "Analyse foncière & urbanisme",
    color: "var(--pluia)",
    domain: "plu-ia.agentimpact.fr",
    domainNote: "(encore sur l'outil)",
    domainStatus: "warn",
    domainDetail: "Landing déployée en preview, pas encore sur le domaine public. L'outil doit migrer vers app-plu-ia.agentimpact.fr.",
    stripeStatus: "warn",
    stripeLabel: "Test seulement",
    stripeLinks: [
      { plan: "Découverte", amount: "Gratuit" },
      { plan: "Pro", amount: "99 €/mo", url: "https://buy.stripe.com/test_dRm8wQ4pg0H55gXfZN48000" },
      { plan: "Entreprise", amount: "Sur mesure" },
    ],
    calendlyStatus: "good",
    calendlyLabel: "Branché",
    calendlyNote: "CTA démo + plan Entreprise.",
    seoStatus: "warn",
    seoLabel: "Pas encore auditable",
    seoNote: "URL preview protégée SSO Vercel — audit prévu une fois le domaine public attaché.",
    todo: [
      "Migrer l'outil (sas-plu-3d) vers app-plu-ia.agentimpact.fr — webhooks Stripe + redirect URLs Clerk à mettre à jour côté outil",
      "Rattacher plu-ia.agentimpact.fr à ce repo landing une fois l'outil confirmé sur le nouveau sous-domaine",
      "Audit SEO/GEO complet une fois public",
    ],
  },
  {
    name: "Hector",
    tag: "Collaborateur IA · CGPI",
    color: "var(--hector)",
    domain: "hector.agentimpact.fr (DNS manquant)",
    domainStatus: "bad",
    domainDetail: "Projet Vercel prêt, CNAME Cloudflare manquant — à ajouter à la main (outil MCP en échec).",
    stripeStatus: "warn",
    stripeLabel: "Test seulement",
    stripeLinks: [
      { plan: "Mensuel", amount: "149 €/mo", url: "https://buy.stripe.com/test_eVqcN65rdgYLblSaCP1Fe00" },
      { plan: "Annuel", amount: "1 490 €/an", url: "https://buy.stripe.com/test_8x2dRabPBcIvey46mz1Fe01" },
    ],
    calendlyStatus: "good",
    calendlyLabel: "Branché",
    calendlyNote: 'CTA "Voir un bilan en live".',
    seoStatus: "warn",
    seoLabel: "Pas encore auditable",
    seoNote: "Même blocage : pas de domaine public.",
    todo: [
      "Ajouter le CNAME hector → cname.vercel-dns.com sur Cloudflare",
      "Prix 149€/1490€ = hypothèse non validée commercialement — le confirmer avant de pousser du trafic payant",
      "Audit SEO/GEO une fois public",
    ],
  },
];

function Pill({ status, children }: { status: Status; children: React.ReactNode }) {
  return (
    <span className={`pill ${status}`}>
      <span className="dot" style={{ background: `var(--${status === "good" ? "good" : status === "warn" ? "warn" : "bad"})` }} />
      {children}
    </span>
  );
}

export default function Dashboard() {
  const liveCount = PRODUCTS.filter((p) => p.domainStatus === "good").length;
  const stripeLinkCount = PRODUCTS.reduce((n, p) => n + p.stripeLinks.filter((l) => l.url).length, 0);
  const seoAuditedCount = PRODUCTS.filter((p) => p.seoScore !== undefined).length;

  return (
    <div className="shell">
      <header className="top">
        <div>
          <p className="eyebrow">AgentImpact — vue interne</p>
          <h1>Portefeuille produits</h1>
        </div>
        <span className="updated mono">màj 19 août 2026</span>
      </header>

      <p className="lede">
        État réel des 3 landings en construction — domaine, paiement, prise de RDV, SEO/GEO.
        Rien n&apos;est inventé : ce qui n&apos;est pas encore fait est marqué comme tel.
      </p>

      <div className="summary-row">
        <div className="summary-cell"><div className="num mono">{PRODUCTS.length}</div><div className="label">Landings en repo dédié</div></div>
        <div className="summary-cell"><div className="num mono">{liveCount}</div><div className="label">Domaine live</div></div>
        <div className="summary-cell"><div className="num mono">{stripeLinkCount}</div><div className="label">Payment Links (test)</div></div>
        <div className="summary-cell"><div className="num mono">0</div><div className="label">Payment Links live</div></div>
        <div className="summary-cell"><div className="num mono">{seoAuditedCount}</div><div className="label">Audits SEO lancés</div></div>
      </div>

      <div className="products">
        {PRODUCTS.map((p) => (
          <section className="card" key={p.name}>
            <div className="card-head">
              <span className="swatch" style={{ background: p.color }} />
              <h2>{p.name}</h2>
              <span className="tag">{p.tag}</span>
              <span className="domain">
                {p.domainUrl ? (
                  <a href={p.domainUrl} target="_blank" rel="noopener noreferrer">{p.domain}</a>
                ) : (
                  <span className="mono" style={{ color: "var(--warn)" }}>{p.domain}</span>
                )}
                {p.domainNote ? <span className="mono" style={{ color: "var(--warn)" }}> {p.domainNote}</span> : null}
              </span>
            </div>
            <div className="card-body">
              <div className="field">
                <p className="field-label">Domaine</p>
                <Pill status={p.domainStatus}>{p.domainStatus === "good" ? "Live" : p.domainStatus === "warn" ? "Split en cours" : "Bloqué"}</Pill>
                {p.domainDetail ? <p className="field-note">{p.domainDetail}</p> : null}
              </div>
              <div className="field">
                <p className="field-label">Stripe</p>
                <Pill status={p.stripeStatus}>{p.stripeLabel}</Pill>
                <ul className="stripe-list">
                  {p.stripeLinks.map((l) => (
                    <li key={l.plan}>
                      <span>{l.plan}</span>
                      <span className="amt">
                        {l.amount}{" "}
                        {l.url ? <a href={l.url} target="_blank" rel="noopener noreferrer">lien ↗</a> : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="field">
                <p className="field-label">Calendly</p>
                <Pill status={p.calendlyStatus}>{p.calendlyLabel}</Pill>
                <p className="field-note">{p.calendlyNote}</p>
              </div>
              <div className="field">
                <p className="field-label">SEO / GEO</p>
                {p.seoScore !== undefined ? (
                  <div className="seo-score"><span className="n">{p.seoScore}</span><span className="of">/ 100 technique</span></div>
                ) : (
                  <Pill status={p.seoStatus}>{p.seoLabel}</Pill>
                )}
                <p className="field-note">{p.seoNote}</p>
              </div>
              <div className="field field-full">
                <p className="field-label">Reste à faire</p>
                <ul className="todo">
                  {p.todo.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        ))}
      </div>

      <footer className="note">
        Tous les liens Stripe ci-dessus sont en <strong>mode test</strong> — aucun paiement réel n&apos;est possible tant qu&apos;ils ne sont pas basculés en mode live dans Stripe Dashboard. Le lien Calendly (nadir-lahyani-agentimpact/30min) est partagé sur les 3 produits.
      </footer>
    </div>
  );
}
