import { ArrowUpRight, ShieldCheck, ServerOff } from "lucide-react";
import { Link } from "wouter";
import { PageShell, SiteFooter, SiteHeader } from "@/components/SiteChrome";

const configuredAdminUrl = ((import.meta.env.VITE_ADMIN_CONSOLE_URL as string | undefined) || "").trim();
const secureAdminUrl = /^https:\/\/[^\s]+$/i.test(configuredAdminUrl) ? configuredAdminUrl : "";

/** Stable public entry point. The actual admin authentication runs on its own server. */
export default function AdminAccess() {
  return (
    <PageShell>
      <SiteHeader />
      <main className="admin-access-page">
        <div className="container admin-access-layout">
          <div className="admin-access-copy">
            <span className="admin-access-kicker"><ShieldCheck size={16} /> PRIVATE ADMIN ACCESS</span>
            <h1>Admin Console</h1>
            <p>Content management, Defence Aspirant records, and platform activity are available only to authorized administrators through a separate, server-protected console.</p>
            {secureAdminUrl ? (
              <>
                <a className="primary-button admin-access-action" href={secureAdminUrl} target="_blank" rel="noopener noreferrer">
                  Open secure Admin Console <ArrowUpRight size={17} />
                </a>
                {new URL(secureAdminUrl).hostname.endsWith(".manus.computer") &&
                  <p className="admin-access-preview-note">This console currently uses a temporary sandbox address. If it is unavailable, the separate admin service needs to be restarted; permanent hosting is still required.</p>}
              </>
            ) : (
              <div className="admin-access-state" role="status">
                <ServerOff size={24} aria-hidden="true" />
                <div>
                  <strong>Permanent console connection is not set up yet.</strong>
                  <p>The previous preview address was temporary, so this page does not send you to an unreliable or expired login. An administrator can provide access after the console is deployed on a stable HTTPS host.</p>
                </div>
              </div>
            )}
            <div className="admin-access-links">
              <Link href="/">← Back to Learners Park</Link>
              <Link href="/founder">Contact Learners Park <ArrowUpRight size={14} /></Link>
            </div>
          </div>
          <aside className="admin-access-aside">
            <span>ADMIN / DEPLOYMENT</span>
            <h2>One stable doorway. One secure destination.</h2>
            <ol>
              <li>Deploy the Admin Console and its database to persistent hosting.</li>
              <li>Configure its permanent HTTPS login address for the public website.</li>
              <li>Keep authentication and student data on the server—not in this public page.</li>
            </ol>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </PageShell>
  );
}
