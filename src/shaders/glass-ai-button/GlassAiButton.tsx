import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import sourceDocument from "./sources/glass-ai-button.html?raw";

export type GlassAiButtonProps = {
  className?: string;
  style?: CSSProperties;
  label?: string;
  onClick?: () => void;
};

export function GlassAiButton({
  className = "",
  style,
  label = "ORION AI",
  onClick,
}: GlassAiButtonProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;

  const [documentVisible, setDocumentVisible] = useState(() => (
    typeof document === "undefined" || !document.hidden
  ));
  const [hostVisible, setHostVisible] = useState(false);
  const [ready, setReady] = useState(false);

  const customizedSourceDocument = useMemo(() => {
    if (!label || label === "ORION AI") return sourceDocument;
    return sourceDocument.replaceAll("ORION AI", label);
  }, [label]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setHostVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      setHostVisible(entry?.isIntersecting ?? true);
    }, { rootMargin: "80px" });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data &&
        typeof event.data === "object" &&
        event.data.type === "glass-ai-button:burst"
      ) {
        if (
          !iframeRef.current ||
          !event.source ||
          event.source === iframeRef.current.contentWindow
        ) {
          onClickRef.current?.();
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const mounted = hostVisible && documentVisible;

  useEffect(() => {
    setReady(false);
  }, [mounted]);

  return (
    <div
      ref={hostRef}
      className={`threeui-background glass-ai-button${className ? ` ${className}` : ""}`}
      role="group"
      aria-label="Interactive glass AI button"
      data-state={!mounted ? "paused" : ready ? "ready" : "loading"}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#a8b0bd",
        pointerEvents: "auto",
        ...style,
      }}
    >
      {mounted ? (
        <iframe
          ref={iframeRef}
          title="Glass AI Button"
          srcDoc={customizedSourceDocument}
          sandbox="allow-scripts"
          loading="eager"
          onLoad={() => setReady(true)}
          style={{
            position: "absolute",
            inset: 0,
            display: "block",
            width: "100%",
            height: "100%",
            border: 0,
            background: "#a8b0bd",
            opacity: ready ? 1 : 0,
            pointerEvents: ready ? "auto" : "none",
            transition: "opacity 240ms ease-out",
          }}
        />
      ) : null}
    </div>
  );
}
