type RouteTransitionProps = {
  active: boolean;
  phase: "idle" | "out" | "in";
  label: string;
};

export function RouteTransition({
  active,
  phase,
  label,
}: RouteTransitionProps) {
  return (
    <div
      className={`route-transition ${active ? "is-active" : ""} ${active ? `is-${phase}` : ""}`}
      aria-hidden="true"
    >
      <div className="route-transition-door route-transition-door-left" />
      <div className="route-transition-door route-transition-door-right" />
      <div className="route-transition-grid" />
      <div className="route-transition-flare" />
      <div className="route-transition-ring" />
      <div className="route-transition-copy">
        <span>页面切换序列</span>
        <strong>{label}</strong>
      </div>
    </div>
  );
}
