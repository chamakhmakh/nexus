"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    number: "34",
    unit: "GB/DAY",
    statement: "The human brain is bombarded with",
    highlight: "34 gigabytes of information daily.",
    sub: "It was built to process a fraction of that.",
  },
  {
    number: "47",
    unit: "%",
    statement: "Your mind is wandering for",
    highlight: "47% of your waking hours.",
    sub: "Half your life — spent nowhere.",
  },
  {
    number: "150",
    unit: "MS",
    statement: "Every decision you make has a",
    highlight: "150ms unconscious delay.",
    sub: "You were never in control.",
  },
];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const statementRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const subRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const finalRef = useRef<HTMLDivElement>(null);
  const finalLineRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(cardRefs.current, { autoAlpha: 0, y: 40 });
      gsap.set(numberRefs.current, { textContent: "0" });
      gsap.set(finalRef.current, { autoAlpha: 0, y: 30 });
      gsap.set(finalLineRef.current, { scaleX: 0, transformOrigin: "center" });
      gsap.set(flashRef.current, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=400%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.from(".scene-label", {
        autoAlpha: 0,
        y: -10,
        duration: 0.5,
        ease: "power2.out",
      });

      stats.forEach((stat, i) => {
        // Flash cut
        tl.to(flashRef.current, {
          autoAlpha: 1,
          duration: 0.08,
          ease: "none",
        }).to(flashRef.current, { autoAlpha: 0, duration: 0.12, ease: "none" });

        // Card in
        tl.to(
          cardRefs.current[i],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "+=0.1",
        );

        // Number counts up
        const target = parseFloat(stat.number);
        tl.to(
          numberRefs.current[i],
          {
            textContent: target,
            duration: 0.8,
            ease: "power2.out",
            snap: { textContent: 1 },
            onUpdate: function () {
              const el = numberRefs.current[i];
              if (!el) return;
              el.textContent = Math.round(
                parseFloat(el.textContent || "0"),
              ).toString();
            },
          },
          "<",
        );

        tl.to(
          statementRefs.current[i],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.5",
        );

        tl.to(
          subRefs.current[i],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.3",
        );

        tl.to({}, { duration: 1.2 });

        if (i < stats.length - 1) {
          tl.to(cardRefs.current[i], {
            autoAlpha: 0,
            y: -30,
            duration: 0.5,
            ease: "power3.in",
          });
        }
      });

      // Final
      tl.to(
        flashRef.current,
        { autoAlpha: 1, duration: 0.1, ease: "none" },
        "+=0.2",
      ).to(flashRef.current, { autoAlpha: 0, duration: 0.15, ease: "none" });
      tl.to(cardRefs.current[stats.length - 1], {
        autoAlpha: 0,
        y: -30,
        duration: 0.5,
        ease: "power3.in",
      });
      tl.to(
        finalRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        },
        "+=0.1",
      ).to(
        finalLineRef.current,
        {
          scaleX: 1,
          duration: 1,
          ease: "power3.inOut",
        },
        "-=0.4",
      );
      tl.to({}, { duration: 1.5 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ background: "var(--black)" }}>
      <div
        ref={wrapperRef}
        className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "var(--black)" }}
      >
        {/* Flash */}
        <div
          ref={flashRef}
          className="absolute inset-0 pointer-events-none z-50"
          style={{ background: "var(--black)", opacity: 0 }}
        />

        {/* ── Scene label — always one line ── */}
        <div
          className="scene-label absolute top-8 sm:top-10 left-1/2 z-20 flex items-center gap-2"
          style={{ transform: "translateX(-50%)", whiteSpace: "nowrap" }}
        >
          <div
            style={{
              width: "clamp(20px, 4vw, 60px)",
              height: 1,
              background:
                "linear-gradient(90deg, transparent, var(--gold-dim))",
            }}
          />
          <span
            className="font-sans uppercase"
            style={{
              fontSize: "clamp(8px, 1.8vw, 10px)",
              letterSpacing: "clamp(0.2em, 0.4em, 0.4em)",
              color: "var(--gold-dim)",
              whiteSpace: "nowrap",
            }}
          >
            The Problem
          </span>
          <div
            style={{
              width: "clamp(20px, 4vw, 60px)",
              height: 1,
              background:
                "linear-gradient(90deg, var(--gold-dim), transparent)",
            }}
          />
        </div>

        {/* ── Stat cards ── */}
        {stats.map((stat, i) => (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
            style={{ padding: "0 clamp(20px, 6vw, 80px)" }}
          >
            {/* Number + unit row */}
            <div
              className="flex items-end justify-center"
              style={{
                gap: "clamp(8px, 2vw, 16px)",
                lineHeight: 1,
                marginBottom: "clamp(16px, 4vw, 32px)",
              }}
            >
              <span
                ref={(el) => {
                  numberRefs.current[i] = el;
                }}
                className="font-serif"
                style={{
                  fontSize: "clamp(72px, 22vw, 220px)",
                  fontWeight: 300,
                  color: "var(--cream)",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                0
              </span>
              <span
                className="font-sans font-light"
                style={{
                  fontSize: "clamp(14px, 4vw, 40px)",
                  color: "var(--gold)",
                  letterSpacing: "0.15em",
                  paddingBottom: "clamp(8px, 2vw, 18px)",
                }}
              >
                {stat.unit}
              </span>
            </div>

            {/* Statement */}
            <p
              ref={(el) => {
                statementRefs.current[i] = el;
              }}
              className="font-serif italic"
              style={{
                fontSize: "clamp(15px, 3.2vw, 38px)",
                fontWeight: 300,
                color: "rgba(245,240,232,0.45)",
                maxWidth: "clamp(280px, 75vw, 720px)",
                lineHeight: 1.45,
                opacity: 0,
                transform: "translateY(20px)",
              }}
            >
              {stat.statement}{" "}
              <span style={{ color: "var(--cream)" }}>{stat.highlight}</span>
            </p>

            {/* Sub */}
            <p
              ref={(el) => {
                subRefs.current[i] = el;
              }}
              className="font-sans uppercase"
              style={{
                marginTop: "clamp(12px, 3vw, 28px)",
                fontSize: "clamp(8px, 1.5vw, 11px)",
                letterSpacing: "clamp(0.15em, 0.3em, 0.3em)",
                color: "var(--gold-dim)",
                opacity: 0,
                transform: "translateY(10px)",
              }}
            >
              {stat.sub}
            </p>
          </div>
        ))}

        {/* ── Final reveal ── */}
        <div
          ref={finalRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{ padding: "0 clamp(20px, 6vw, 80px)", opacity: 0 }}
        >
          <p
            className="font-serif"
            style={{
              fontSize: "clamp(28px, 7vw, 96px)",
              fontWeight: 300,
              color: "var(--cream)",
              letterSpacing: "0.03em",
              lineHeight: 1.2,
              maxWidth: "clamp(280px, 80vw, 860px)",
            }}
          >
            We decided{" "}
            <span className="italic" style={{ color: "var(--gold)" }}>
              to fix that.
            </span>
          </p>

          <div
            ref={finalLineRef}
            style={{
              marginTop: "clamp(20px, 4vw, 40px)",
              width: "clamp(60px, 12vw, 180px)",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, var(--gold), transparent)",
            }}
          />

          <p
            className="font-sans uppercase"
            style={{
              marginTop: "clamp(12px, 2.5vw, 24px)",
              fontSize: "clamp(8px, 1.5vw, 10px)",
              letterSpacing: "clamp(0.2em, 0.4em, 0.4em)",
              color: "var(--gold-dim)",
            }}
          >
            Scroll to continue
          </p>
        </div>

        {/* Corner brackets — sm+ only */}
        {[
          { top: 24, left: 24, borderTop: true, borderLeft: true },
          { top: 24, right: 24, borderTop: true, borderRight: true },
          { bottom: 24, left: 24, borderBottom: true, borderLeft: true },
          { bottom: 24, right: 24, borderBottom: true, borderRight: true },
        ].map((corner, i) => (
          <div
            key={i}
            className="absolute pointer-events-none hidden sm:block"
            style={{
              ...(corner.top !== undefined ? { top: corner.top } : {}),
              ...(corner.bottom !== undefined ? { bottom: corner.bottom } : {}),
              ...(corner.left !== undefined ? { left: corner.left } : {}),
              ...(corner.right !== undefined ? { right: corner.right } : {}),
              width: 20,
              height: 20,
              borderTop: corner.borderTop
                ? "1px solid rgba(201,168,76,0.15)"
                : "none",
              borderBottom: corner.borderBottom
                ? "1px solid rgba(201,168,76,0.15)"
                : "none",
              borderLeft: corner.borderLeft
                ? "1px solid rgba(201,168,76,0.15)"
                : "none",
              borderRight: corner.borderRight
                ? "1px solid rgba(201,168,76,0.15)"
                : "none",
            }}
          />
        ))}

        {/* Side label — lg only */}
        <div
          className="absolute left-6 top-1/2 hidden lg:block"
          style={{
            transform: "translateY(-50%) rotate(-90deg)",
            fontSize: 9,
            letterSpacing: "0.3em",
            color: "var(--gold-dim)",
            opacity: 0.4,
            whiteSpace: "nowrap",
          }}
        >
          NEXUS CORP — SEQUENCE 002
        </div>
      </div>
    </section>
  );
}
