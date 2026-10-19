"use client";

import * as React from "react";
import { useEffect, useRef, useCallback, useMemo } from "react";
// Repointed from "framer-motion" to "motion/react" — same library, and the
// project already ships `motion` (v12). `originkit add` installs framer-motion
// (v13) by default, which would duplicate the whole animation runtime in the
// bundle. motion/react exports motion, useAnimate and stagger identically.
// Re-apply this if this component is ever re-fetched.
import {
  motion,
  useAnimate,
  stagger as motionStagger,
  type AnimationOptions,
} from "motion/react";

const TAGS = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "div", "span"] as const;

type ScrollConfig = { position: "top" | "bottom"; distance: number };

type Transition = AnimationOptions & {
  type?: "tween" | "spring";
  stiffness?: number;
  damping?: number;
  mass?: number;
  duration?: number;
  ease?: string;
};

type WaveColorShiftProps = {
  text?: string;
  font?: React.CSSProperties;
  color?: string;
  waveColor?: string;
  colorSpread?: number;
  startY?: number;
  startOpacity?: number;
  transition?: Transition;
  tag?: string;
  scrollConfig?: ScrollConfig;
  stagger?: number;
  appearTrigger?: "default" | "hover" | "scroll";
  /**
   * LOCAL ADDITION (not upstream). Renders just the tag, dropping the
   * `width:100%` flex wrapper below. That wrapper is block-level and takes the
   * full line, so without this the component cannot sit inline beside another
   * element — which is exactly what SectionHeader needs in order to keep its
   * gradient-masked accent word on the same line as the swept title.
   */
  inline?: boolean;
};

export default function WaveColorShift({
  text = "Wave Color Shift",
  font = {
    fontFamily: "Inter",
    fontWeight: 400,
    fontSize: 120,
    lineHeight: "1.2em",
    letterSpacing: "0em",
    textAlign: "left",
  },
  color = "#FFFFFF",
  waveColor = "#00FF66",
  colorSpread = 100,
  startY = 40,
  startOpacity = 0,
  transition = {
    type: "tween",
    stiffness: 800,
    damping: 60,
    mass: 1,
    duration: 0.6,
    ease: "easeOut",
  },
  tag = "h3",
  scrollConfig = { position: "bottom", distance: 20 },
  stagger = 0.04,
  inline = false,
  appearTrigger = "default",
}: WaveColorShiftProps) {
  const [scope, animate] = useAnimate();
  const hoverFiredRef = useRef(false);
  const chars = useMemo(() => (text ?? "").split(""), [text]);

  const computedWaveColors = useMemo(() => {
    const totalChars = chars.length;
    if (totalChars === 0) return [];

    const spreadRatio = Math.max(0, Math.min(100, colorSpread)) / 100;
    const affectedCount = Math.max(0, Math.round(totalChars * spreadRatio));
    const middle = (totalChars - 1) / 2;
    const halfBand = (Math.max(affectedCount, 1) - 1) / 2;

    return chars.map((_, index) => {
      const isAffected =
        affectedCount > 0 && Math.abs(index - middle) <= halfBand;
      if (!isAffected) return color;
      return waveColor;
    });
  }, [waveColor, chars, colorSpread, color]);

  const resetToHidden = useCallback(() => {
    if (!scope.current) return;
    const charNodes = scope.current.querySelectorAll(".char");
    charNodes.forEach((node: Element, index: number) => {
      animate(
        node,
        {
          y: startY,
          opacity: startOpacity,
          color: computedWaveColors[index] ?? waveColor,
        },
        { duration: 0 }
      );
    });
  }, [animate, startY, startOpacity, waveColor, scope, computedWaveColors]);

  const runAppear = useCallback(() => {
    if (!scope.current) return;

    const animationConfig = {
      ...transition,
      delay: motionStagger(stagger),
    };

    animate(
      ".char",
      { y: 0, opacity: 1, color: color },
      animationConfig as any
    );
  }, [animate, transition, stagger, color, scope]);

  useEffect(() => {
    let rafId: number | null = null;

    resetToHidden();
    hoverFiredRef.current = false;

    if (appearTrigger === "default") {
      const t = setTimeout(runAppear, 50);
      return () => clearTimeout(t);
    }

    if (appearTrigger === "scroll") {
      const el = scope.current;
      if (!el) return;

      const scrollPos = scrollConfig?.position ?? "bottom";
      const scrollDist = Math.max(0, Math.min(100, scrollConfig?.distance ?? 20));

      const check = () => {
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const rect = el.getBoundingClientRect();
        if (scrollPos === "top") return rect.top <= vh * (scrollDist / 100);
        return rect.bottom <= vh * (1 - scrollDist / 100);
      };

      if (check()) {
        runAppear();
        return;
      }

      let ticking = false;
      const onScroll = () => {
        if (!ticking) {
          rafId = window.requestAnimationFrame(() => {
            if (check()) {
              runAppear();
              window.removeEventListener("scroll", onScroll, true);
              window.removeEventListener("resize", onScroll);
            }
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", onScroll);

      return () => {
        window.removeEventListener("scroll", onScroll, true);
        window.removeEventListener("resize", onScroll);
        if (rafId) window.cancelAnimationFrame(rafId);
      };
    }
  }, [
    appearTrigger,
    scrollConfig?.position,
    scrollConfig?.distance,
    runAppear,
    resetToHidden,
    scope,
  ]);

  const fontStyles = (font ?? {}) as React.CSSProperties;
  const align = fontStyles.textAlign || "left";
  const justifyContent =
    align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";

  const safeTag = (TAGS as readonly string[]).includes(tag) ? tag : "h3";
  const Tag = (motion as any)[safeTag];

  const onEnter = () => {
    if (appearTrigger === "hover" && !hoverFiredRef.current) {
      hoverFiredRef.current = true;
      runAppear();
    }
  };

  const body = (
      <Tag
        ref={scope}
        aria-label={text}
        onMouseEnter={inline ? onEnter : undefined}
        style={{
          margin: 0,
          display: "inline-block",
          whiteSpace: "pre-wrap",
          ...fontStyles,
        }}
      >
        {chars.map((char, index) => (
          <motion.span
            key={index}
            className="char"
            aria-hidden="true"
            style={{
              display: "inline-block",
              opacity: startOpacity,
              y: startY,
              color: computedWaveColors[index] ?? waveColor,
              willChange: "transform, opacity, color",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </Tag>
  );

  if (inline) return body;

  return (
    <div
      onMouseEnter={onEnter}
      style={{
        width: "100%",
        display: "flex",
        justifyContent,
        alignItems: "center",
        overflow: "visible",
      }}
    >
      {body}
    </div>
  );
}