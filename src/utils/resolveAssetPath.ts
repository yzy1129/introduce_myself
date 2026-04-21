function isExternalAssetPath(path: string) {
  return /^(?:https?:)?\/\//.test(path) || path.startsWith("data:");
}

export function resolveAssetPath(path: string) {
  if (isExternalAssetPath(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (typeof document === "undefined") {
    return normalizedPath;
  }

  return new URL(normalizedPath, document.baseURI).toString();
}
