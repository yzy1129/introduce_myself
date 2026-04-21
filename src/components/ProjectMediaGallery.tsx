import type { ProjectMedia } from "@/types/content";
import { resolveAssetPath } from "@/utils/resolveAssetPath";

type ProjectMediaGalleryProps = {
  items: ProjectMedia[];
};

const mediaKindLabel: Record<ProjectMedia["kind"], string> = {
  image: "截图",
  video: "视频",
  diagram: "架构图",
};

function resolveMediaPath(path?: string) {
  if (!path) {
    return undefined;
  }

  return resolveAssetPath(path);
}

export function ProjectMediaGallery({ items }: ProjectMediaGalleryProps) {
  return (
    <div className="project-media-grid">
      {items.map((item) => {
        const source = resolveMediaPath(item.src);
        const poster = resolveMediaPath(item.poster);
        const actionLabel =
          item.ctaLabel ??
          (item.kind === "video"
            ? "打开演示"
            : item.kind === "diagram"
              ? "查看架构图"
              : "查看截图");

        return (
          <article key={item.id} className={`project-media-card kind-${item.kind}`}>
            <div className="project-media-frame">
              {item.kind === "video" ? (
                source ? (
                  <video
                    controls
                    preload="metadata"
                    poster={poster}
                    className="project-media-video"
                  >
                    <source src={source} />
                  </video>
                ) : poster ? (
                  <img
                    src={poster}
                    alt={item.alt ?? item.title}
                    loading="lazy"
                    className="project-media-image"
                  />
                ) : (
                  <div className="project-media-fallback">
                    <span>VIDEO SLOT</span>
                  </div>
                )
              ) : source ? (
                <img
                  src={source}
                  alt={item.alt ?? item.title}
                  loading="lazy"
                  className="project-media-image"
                />
              ) : (
                <div className="project-media-fallback">
                  <span>MEDIA SLOT</span>
                </div>
              )}
            </div>

            <div className="project-media-copy">
              <span>{mediaKindLabel[item.kind]}</span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>

              <div className="project-media-actions">
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noreferrer">
                    {actionLabel}
                  </a>
                ) : source ? (
                  <a href={source} target="_blank" rel="noreferrer">
                    {actionLabel}
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
