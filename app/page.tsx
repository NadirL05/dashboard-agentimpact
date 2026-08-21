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
    stripeStatus: "good",
    stripeLabel: "Live",
    stripeLinks: [
      { plan: "Simple", amount: "150 €/mo", url: "https://buy.stripe.com/5kQ4gA9OC06q8Mk7S9cbC00" },
      { plan: "Medium", amount: "350 €/mo", url: "https://buy.stripe.com/9B65kE3qe3iCd2AegxcbC01" },
      { plan: "Luxe", amount: "650 €/mo", url: "https://buy.stripe.com/3cI14o9OC4mGaUsdctcbC02" },
    ],
    calendlyStatus: "good",
    calendlyLabel: "Branché",
    calendlyNote: "Sous les cartes tarifs, sur la home et /pricing.",
    seoStatus: "good",
    seoLabel: "94 / 100 perf",
    seoScore: 94,
    seoNote: "Refonte design (fond clair, agent-readiness, JSON-LD inline) + 3 articles /ressources publiés le 20/08. Auth = Supabase (Clerk non migré, risque jugé trop élevé sur une app avec clients réels). CTA tarifs corrigé le 21/08 : renvoie vers /signup plutôt que le Payment Link direct (le webhook n'active un compte qu'à partir d'un orgId posé par le flow authentifié — un paiement via lien statique brut serait orphelin).",
    todo: [
      "Créer un premier témoignage client réel (gap n°1 identifié vs concurrents)",
      "En-têtes de sécurité (CSP) posés — à revalider après tout changement de domaine tiers",
      "Webhook Stripe live créé côté Stripe mais pas encore câblé sur Vercel (restauyacine) — bloqué par un mismatch modèle mensuel/annuel réel vs 3 tiers affichés sur la landing, à trancher avant de poser les env vars",
    ],
  },
  {
    name: "PLU IA",
    tag: "Analyse foncière & urbanisme",
    color: "var(--pluia)",
    domain: "plu-ia.agentimpact.fr",
    domainUrl: "https://plu-ia.agentimpact.fr",
    domainStatus: "good",
    stripeStatus: "good",
    stripeLabel: "Live",
    stripeLinks: [
      { plan: "Découverte", amount: "Gratuit" },
      { plan: "Pro", amount: "99 €/mo", url: "https://buy.stripe.com/aFa14o4ob6cc56r8Id83C00" },
      { plan: "Entreprise", amount: "Sur mesure" },
    ],
    calendlyStatus: "good",
    calendlyLabel: "Branché",
    calendlyNote: "CTA démo + plan Entreprise.",
    seoStatus: "good",
    seoLabel: "Clerk live",
    seoNote: "Identité \"plan cadastral\" + 3D wireframe massing. Auth Clerk basculée en clés live (app-plu-ia.agentimpact.fr). Outil (sas-plu-3d) et landing bien séparés sur leurs sous-domaines respectifs. CTA plan Pro corrigé le 21/08 : renvoie vers le dashboard (inscription) au lieu du Payment Link direct — même raison que HostIA, le webhook a besoin d'un userId posé par /api/stripe/checkout authentifié.",
    todo: [
      "Audit SEO/GEO complet groupé avec les 2 autres produits",
      "Reconnecter Google OAuth si besoin sur le nouveau domaine Clerk live",
    ],
  },
  {
    name: "Hector",
    tag: "Collaborateur IA · CGPI",
    color: "var(--hector)",
    domain: "hector.agentimpact.fr",
    domainUrl: "https://hector.agentimpact.fr",
    domainStatus: "good",
    domainDetail: "app-hector.agentimpact.fr (outil) + api-hector.agentimpact.fr (API) également en ligne.",
    stripeStatus: "good",
    stripeLabel: "Live",
    stripeLinks: [
      { plan: "Mensuel", amount: "149 €/mo", url: "https://buy.stripe.com/28E5kE3sG8QW4Yd6QhcZa00" },
      { plan: "Annuel", amount: "1 490 €/an", url: "https://buy.stripe.com/9B6aEYfbo5EK76l8YpcZa01" },
    ],
    calendlyStatus: "good",
    calendlyLabel: "Branché (fallback secondaire sous les CTA Stripe)",
    calendlyNote: 'CTA principal "Commencer" (paiement direct) depuis le 21/08 — Calendly reste en option secondaire.',
    seoStatus: "good",
    seoLabel: "Clerk live",
    seoNote: "Auth Clerk basculée en clés live (app-hector.agentimpact.fr) le 21/08 — CSP corrigée pour le nouveau domaine Clerk. CTA Stripe test-mode (identifié comme faille de confiance) corrigé puis re-câblé en live.",
    todo: [
      "CTA \"Commencer\" reste en paiement direct (pas de flow inscription) : patrimoine n'a aucun webhook Stripe à ce jour, donc pas d'endroit où router un CTA inscription — à revoir si un flow de provisioning de compte est ajouté",
      "Prix 149€/1490€ reste une hypothèse non validée commercialement, à confirmer avant scaling",
      "Revue sécurité isolation multi-tenant avant onboarding d'un vrai cabinet (recommandation de l'audit concurrentiel)",
      "Vérifier couverture réelle des intégrations Powens vs promesse landing",
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
  const stripeLiveCount = PRODUCTS.reduce((n, p) => n + (p.stripeStatus === "good" ? p.stripeLinks.filter((l) => l.url).length : 0), 0);
  const seoAuditedCount = PRODUCTS.filter((p) => p.seoScore !== undefined).length;

  return (
    <div className="shell">
      <header className="top">
        <div>
          <p className="eyebrow">AgentImpact — vue interne</p>
          <h1>Portefeuille produits</h1>
        </div>
        <span className="updated mono">màj 21 août 2026 (soir)</span>
      </header>

      <p className="lede">
        État réel des 3 landings en construction — domaine, paiement, prise de RDV, SEO/GEO.
        Rien n&apos;est inventé : ce qui n&apos;est pas encore fait est marqué comme tel.
      </p>

      <div className="summary-row">
        <div className="summary-cell"><div className="num mono">{PRODUCTS.length}</div><div className="label">Landings en repo dédié</div></div>
        <div className="summary-cell"><div className="num mono">{liveCount}</div><div className="label">Domaine live</div></div>
        <div className="summary-cell"><div className="num mono">{stripeLiveCount}</div><div className="label">Payment Links live</div></div>
        <div className="summary-cell"><div className="num mono">3 / 3</div><div className="label">Produits Stripe live</div></div>
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
        Tous les liens Stripe ci-dessus sont en <strong>mode live</strong> depuis le 21/08/2026 — un paiement réel est possible sur chacun, ne pas cliquer pour tester. Le lien Calendly (nadir-lahyani-agentimpact/30min) est partagé sur les 3 produits, en fallback secondaire. Clerk est en clés live sur PLU-IA et Hector ; HostIA reste sur Supabase Auth (décision explicite, migration jugée trop risquée sur une app avec clients réels). Sur HostIA et PLU-IA, les CTA de paiement ne pointent plus vers le Payment Link direct mais vers l&apos;inscription : le paiement se fait ensuite depuis le dashboard authentifié, seul endroit où le webhook Stripe peut rattacher la transaction à un compte. Hector fait exception (paiement direct) faute de webhook côté patrimoine (l&apos;outil n&apos;a aucun code de webhook Stripe à ce jour).
      </footer>
    </div>
  );
}
