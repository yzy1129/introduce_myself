import { AppLink } from "@/components/AppLink";

export function NotFoundPage() {
  return (
    <main id="main-content" tabIndex={-1} className="app-main app-main-not-found">
      <section className="route-hero route-hero-not-found">
        <div className="route-hero-shell route-hero-shell-not-found">
          <div className="route-hero-copy">
            <span className="route-hero-index">404</span>
            <span className="route-hero-eyebrow">航线丢失</span>
            <h1>这一页不在当前星图中</h1>
            <p className="route-hero-summary">
              你访问的路径没有对应章节。回到首页后，可以从完整目录重新进入。
            </p>
            <div className="route-hero-actions">
              <AppLink className="hero-core-button chapter-route-link" to="/">
                <span className="hero-core-button-halo" aria-hidden="true" />
                <span className="hero-core-button-pulse" aria-hidden="true" />
                <span className="hero-core-button-copy">
                  <strong>返回首页</strong>
                  <em>重新进入章节星图</em>
                </span>
              </AppLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
