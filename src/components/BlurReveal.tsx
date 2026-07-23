"use client";

import {
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type Ctx = { i: number; stagger: number };

function splitText(text: string, ctx: Ctx): ReactNode[] {
  const tokens = text.split(/(\s+)/);
  const out: ReactNode[] = [];
  for (const token of tokens) {
    if (token === "") continue;
    if (/^\s+$/.test(token)) {
      out.push(token);
    } else {
      const idx = ctx.i++;
      out.push(
        <span
          key={`w-${idx}`}
          className="blur-word"
          style={{ animationDelay: `${idx * ctx.stagger}ms` }}
        >
          {token}
        </span>,
      );
    }
  }
  return out;
}

function processNode(node: ReactNode, ctx: Ctx): ReactNode {
  if (typeof node === "string" || typeof node === "number") {
    return splitText(String(node), ctx);
  }
  if (Array.isArray(node)) {
    return node.map((n, idx) => (
      <span key={`g-${idx}`} style={{ display: "contents" }}>
        {processNode(n, ctx)}
      </span>
    ));
  }
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    if (el.props.children !== undefined) {
      return cloneElement(el, {
        ...el.props,
        children: processNode(el.props.children, ctx),
      });
    }
    return node;
  }
  return node;
}

type Props = {
  children: ReactNode;
  stagger?: number;
  threshold?: number;
  className?: string;
};

export function BlurReveal({
  children,
  stagger = 60,
  threshold = 0.25,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true);
            observer.disconnect();
          }
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const ctx: Ctx = { i: 0, stagger };
  const processed = processNode(children, ctx);

  return (
    <span
      ref={ref}
      className={[
        "blur-reveal",
        active ? "is-active" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {processed}
    </span>
  );
}
