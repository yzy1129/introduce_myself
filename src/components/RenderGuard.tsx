import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from "react";

type RenderGuardProps = PropsWithChildren<{
  fallback?: ReactNode;
}>;

type RenderGuardState = {
  hasError: boolean;
};

export class RenderGuard extends Component<RenderGuardProps, RenderGuardState> {
  state: RenderGuardState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("RenderGuard caught a render error.", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }

    return this.props.children;
  }
}
