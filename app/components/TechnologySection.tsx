"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const technologies = [
  {
    numeral: "I",
    name: "Neural Mesh",
    subtitle: "Cognitive Enhancement",
    description:
      "A sub-dermal lattice of bio-synthetic neurons integrated directly into the prefrontal cortex. Thought becomes computation. Computation becomes thought.",
    stats: [
      { label: "Processing Speed", value: "847×" },
      { label: "Memory Retention", value: "99.7%" },
      { label: "Latency", value: "0.003ms" },
      { label: "Neural Sync", value: "100%" },
    ],
    tag: "PHASE I — ACTIVE",
  },
  {
    numeral: "II",
    name: "Genome Architecture",
    subtitle: "Biological Reengineering",
    description:
      "Precision editing of the human genome at the epigenetic level. We do not treat disease. We eliminate the conditions that allow it to exist.",
    stats: [
      { label: "Edit Accuracy", value: "99.99%" },
      { label: "Cellular Repair", value: "12×" },
      { label: "Lifespan Delta", value: "+340%" },
      { label: "Error Rate", value: "0.0001%" },
    ],
    tag: "PHASE II — TRIALS",
  },
  {
    numeral: "III",
    name: "Temporal Cognition",
    subtitle: "Time Perception Expansion",
    description:
      "Neural oscillation modulation that expands subjective time perception. One second becomes ten. Decisions that took hours take moments.",
    stats: [
      { label: "Time Dilation", value: "10:1" },
      { label: "Reaction Time", value: "0.8ms" },
      { label: "Focus Duration", value: "∞" },
      { label: "Clarity Index", value: "9.97" },
    ],
    tag: "PHASE III — CLASSIFIED",
  },
];

export default function TechnologySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const finalTextRef = useRef<HTMLParagraphElement>(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);

  // Desktop refs
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const topBorderRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numeralRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const nameRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const statsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Mobile refs
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // ── Read once on mount, never re-run on resize ──
    const mobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      gsap.set(gridRef.current, { autoAlpha: 0 });
      gsap.set(scanLineRef.current, {
        scaleY: 0,
        transformOrigin: "top center",
      });
      gsap.set(finalTextRef.current, { autoAlpha: 0, y: 20 });
      gsap.set(bottomLineRef.current, { scaleX: 0, transformOrigin: "center" });

      if (mobile) {
        // ── MOBILE: one card at a time, separate absolute cards ──
        gsap.set(mobileCardRefs.current, { autoAlpha: 0, y: 40 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            end: "+=500%",
            scrub: false,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.from(".tech-scene-label", {
          autoAlpha: 0,
          y: -10,
          duration: 0.4,
          ease: "power2.out",
        });
        tl.to(
          gridRef.current,
          { autoAlpha: 1, duration: 0.8, ease: "power2.out" },
          "+=0.2",
        );

        technologies.forEach((_, i) => {
          // Scan line sweep
          tl.to(
            scanLineRef.current,
            { scaleY: 1, duration: 0.25, ease: "power2.in" },
            i === 0 ? "+=0.1" : "+=0.15",
          )
            .to(scanLineRef.current, {
              x: "100vw",
              duration: 0.4,
              ease: "power2.out",
            })
            .set(scanLineRef.current, { x: 0, scaleY: 0 });

          // Card in
          tl.to(
            mobileCardRefs.current[i],
            { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out" },
            "-=0.05",
          );

          // Hold
          tl.to({}, { duration: 1.4 });

          // Card out — except last
          if (i < technologies.length - 1) {
            tl.to(mobileCardRefs.current[i], {
              autoAlpha: 0,
              y: -30,
              duration: 0.4,
              ease: "power3.in",
            });
          }
        });

        // Last card out then final text
        tl.to(
          mobileCardRefs.current[technologies.length - 1],
          { autoAlpha: 0, y: -30, duration: 0.4, ease: "power3.in" },
          "+=0.3",
        );
        tl.to(
          finalTextRef.current,
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "+=0.1",
        ).to(
          bottomLineRef.current,
          { scaleX: 1, duration: 0.8, ease: "power3.inOut" },
          "-=0.4",
        );
        tl.to({}, { duration: 1.5 });
      } else {
        // ── DESKTOP: all 3 cards ──
        gsap.set(cardRefs.current, { autoAlpha: 0, x: 80 });
        gsap.set(topBorderRefs.current, {
          scaleX: 0,
          transformOrigin: "left center",
        });
        gsap.set(numeralRefs.current, { autoAlpha: 0, y: 20 });
        gsap.set(nameRefs.current, { autoAlpha: 0, y: 30 });
        gsap.set(descRefs.current, { autoAlpha: 0, y: 15 });
        gsap.set(statsRefs.current, { autoAlpha: 0, y: 10 });
        gsap.set(tagRefs.current, { autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top top",
            end: "+=500%",
            scrub: false,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.from(".tech-scene-label", {
          autoAlpha: 0,
          y: -10,
          duration: 0.4,
          ease: "power2.out",
        });
        tl.to(
          gridRef.current,
          { autoAlpha: 1, duration: 1, ease: "power2.out" },
          "+=0.2",
        );

        technologies.forEach((_, i) => {
          const label = `card${i}`;
          tl.to(
            scanLineRef.current,
            { scaleY: 1, duration: 0.3, ease: "power2.in" },
            i === 0 ? "+=0.1" : "+=0.2",
          )
            .to(scanLineRef.current, {
              x: "100vw",
              duration: 0.5,
              ease: "power2.out",
            })
            .set(scanLineRef.current, { x: 0, scaleY: 0 });

          tl.to(
            cardRefs.current[i],
            { autoAlpha: 1, x: 0, duration: 0.7, ease: "expo.out" },
            label,
          );
          tl.to(
            topBorderRefs.current[i],
            { scaleX: 1, duration: 0.6, ease: "power3.inOut" },
            `${label}+=0.1`,
          );
          tl.to(
            numeralRefs.current[i],
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" },
            `${label}+=0.2`,
          );
          tl.to(
            nameRefs.current[i],
            { autoAlpha: 1, y: 0, duration: 0.7, ease: "expo.out" },
            `${label}+=0.3`,
          );
          tl.to(
            descRefs.current[i],
            { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" },
            `${label}+=0.5`,
          );
          tl.to(
            statsRefs.current[i],
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" },
            `${label}+=0.6`,
          );
          tl.to(
            tagRefs.current[i],
            { autoAlpha: 1, duration: 0.4, ease: "power2.out" },
            `${label}+=0.7`,
          );
          tl.to({}, { duration: 1.0 });
        });

        tl.to(
          finalTextRef.current,
          { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "+=0.3",
        ).to(
          bottomLineRef.current,
          { scaleX: 1, duration: 0.8, ease: "power3.inOut" },
          "-=0.4",
        );
        tl.to({}, { duration: 1.5 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []); // ← empty deps — runs once only, no re-runs on resize

  return (
    <section ref={sectionRef} style={{ background: "var(--black)" }}>
      <div
        ref={wrapperRef}
        className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: "var(--black)" }}
      >
        {/* Grid */}
        <div
          ref={gridRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, var(--black) 100%)",
          }}
        />

        {/* Scan line */}
        <div
          ref={scanLineRef}
          className="absolute top-0 bottom-0 pointer-events-none z-20"
          style={{
            width: 1,
            background:
              "linear-gradient(to bottom, transparent, var(--gold), transparent)",
            boxShadow: "0 0 12px 2px rgba(201,168,76,0.4)",
            left: 0,
          }}
        />

        {/* Scene label */}
        <div
          className="tech-scene-label absolute top-8 sm:top-10 left-1/2 z-30 flex items-center gap-2"
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
              letterSpacing: "0.35em",
              color: "var(--gold-dim)",
              whiteSpace: "nowrap",
            }}
          >
            The Technology
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

        {/* ── MOBILE: absolute stacked cards, one visible at a time ── */}
        <div className="md:hidden absolute inset-0 flex items-center justify-center z-30">
          {technologies.map((tech, i) => (
            <div
              key={i}
              ref={(el) => {
                mobileCardRefs.current[i] = el;
              }}
              className="absolute flex flex-col"
              style={{
                width: "clamp(300px, 90vw, 480px)",
                maxHeight: "75vh",
                overflowY: "auto",
                padding: "22px 18px 18px",
                border: "1px solid rgba(201,168,76,0.12)",
                background: "rgba(10,10,10,0.95)",
              }}
            >
              {/* Top gold border */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background:
                    "linear-gradient(90deg, var(--gold), rgba(201,168,76,0.3))",
                }}
              />

              {/* Numeral + tag */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="font-serif"
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.3em",
                    color: "var(--gold-dim)",
                  }}
                >
                  {tech.numeral}
                </span>
                <span
                  className="font-sans uppercase"
                  style={{
                    fontSize: 7,
                    letterSpacing: "0.2em",
                    color: i === 2 ? "rgba(201,168,76,0.4)" : "var(--gold)",
                  }}
                >
                  {tech.tag}
                </span>
              </div>

              {/* Name */}
              <h3
                className="font-serif"
                style={{
                  fontSize: "clamp(26px, 6vw, 36px)",
                  fontWeight: 300,
                  color: "var(--cream)",
                  lineHeight: 1.1,
                  marginBottom: 4,
                }}
              >
                {tech.name}
              </h3>

              {/* Subtitle */}
              <span
                className="font-sans uppercase"
                style={{
                  fontSize: 8,
                  letterSpacing: "0.25em",
                  color: "var(--gold)",
                  marginBottom: 12,
                  display: "block",
                }}
              >
                {tech.subtitle}
              </span>

              <div
                style={{
                  height: 1,
                  background: "rgba(201,168,76,0.1)",
                  marginBottom: 12,
                }}
              />

              {/* Description */}
              <p
                className="font-sans"
                style={{
                  fontSize: "clamp(12px, 3vw, 13px)",
                  lineHeight: 1.7,
                  color: "rgba(192,184,154,0.7)",
                  marginBottom: 14,
                  fontWeight: 300,
                }}
              >
                {tech.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                {tech.stats.map((stat, j) => (
                  <div
                    key={j}
                    style={{
                      padding: "8px 10px",
                      background: "rgba(201,168,76,0.04)",
                      border: "1px solid rgba(201,168,76,0.1)",
                    }}
                  >
                    <span
                      className="font-serif block"
                      style={{
                        fontSize: 17,
                        color: "var(--gold)",
                        lineHeight: 1,
                        marginBottom: 3,
                      }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="font-sans uppercase block"
                      style={{
                        fontSize: 7,
                        letterSpacing: "0.15em",
                        color: "rgba(192,184,154,0.4)",
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── DESKTOP: 3 cards grid ── */}
        <div className="hidden md:grid relative z-30 w-full max-w-6xl px-8 grid-cols-3 gap-6">
          {technologies.map((tech, i) => (
            <div
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="relative flex flex-col"
              style={{ padding: "28px 24px 24px" }}
            >
              <div
                ref={(el) => {
                  topBorderRefs.current[i] = el;
                }}
                className="absolute top-0 left-0 right-0"
                style={{
                  height: 1,
                  background:
                    "linear-gradient(90deg, var(--gold), rgba(201,168,76,0.3))",
                }}
              />
              <div
                className="absolute top-0 left-0 bottom-0"
                style={{
                  width: 1,
                  background:
                    "linear-gradient(to bottom, var(--gold-dim), transparent)",
                  opacity: 0.3,
                }}
              />

              <span
                ref={(el) => {
                  numeralRefs.current[i] = el;
                }}
                className="font-serif"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  color: "var(--gold-dim)",
                  marginBottom: 16,
                }}
              >
                {tech.numeral}
              </span>
              <h3
                ref={(el) => {
                  nameRefs.current[i] = el;
                }}
                className="font-serif"
                style={{
                  fontSize: "clamp(22px, 2.5vw, 34px)",
                  fontWeight: 300,
                  color: "var(--cream)",
                  lineHeight: 1.1,
                  marginBottom: 6,
                }}
              >
                {tech.name}
              </h3>
              <span
                className="font-sans uppercase"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.3em",
                  color: "var(--gold)",
                  marginBottom: 16,
                }}
              >
                {tech.subtitle}
              </span>
              <div
                className="my-4"
                style={{ height: 1, background: "rgba(201,168,76,0.1)" }}
              />
              <p
                ref={(el) => {
                  descRefs.current[i] = el;
                }}
                className="font-sans"
                style={{
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "rgba(192,184,154,0.7)",
                  marginBottom: 24,
                  fontWeight: 300,
                }}
              >
                {tech.description}
              </p>

              <div
                ref={(el) => {
                  statsRefs.current[i] = el;
                }}
                className="grid grid-cols-2 gap-2 mt-auto"
              >
                {tech.stats.map((stat, j) => (
                  <div
                    key={j}
                    style={{
                      padding: "8px 10px",
                      background: "rgba(201,168,76,0.04)",
                      border: "1px solid rgba(201,168,76,0.1)",
                    }}
                  >
                    <span
                      className="font-serif block"
                      style={{
                        fontSize: 16,
                        color: "var(--gold)",
                        lineHeight: 1,
                        marginBottom: 3,
                      }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="font-sans uppercase block"
                      style={{
                        fontSize: 8,
                        letterSpacing: "0.2em",
                        color: "rgba(192,184,154,0.4)",
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              <span
                ref={(el) => {
                  tagRefs.current[i] = el;
                }}
                className="font-sans uppercase mt-4 inline-block"
                style={{
                  fontSize: 8,
                  letterSpacing: "0.25em",
                  color: i === 2 ? "rgba(201,168,76,0.4)" : "var(--gold)",
                  borderTop: "1px solid rgba(201,168,76,0.15)",
                  paddingTop: 10,
                }}
              >
                {tech.tag}
              </span>
            </div>
          ))}
        </div>

        {/* Final text */}
        <div
          className="absolute bottom-10 sm:bottom-16 left-1/2 z-30 flex flex-col items-center gap-3"
          style={{ transform: "translateX(-50%)" }}
        >
          <p
            ref={finalTextRef}
            className="font-serif italic text-center"
            style={{
              fontSize: "clamp(14px, 2vw, 24px)",
              fontWeight: 300,
              color: "var(--cream-dim)",
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
            }}
          >
            Three systems.{" "}
            <span style={{ color: "var(--gold)" }}>One organism.</span>
          </p>
          <div
            ref={bottomLineRef}
            style={{
              width: "clamp(60px, 10vw, 140px)",
              height: 1,
              background:
                "linear-gradient(90deg, transparent, var(--gold), transparent)",
            }}
          />
        </div>

        {/* Corner brackets */}
        {[
          { top: 24, left: 24, borderTop: true, borderLeft: true },
          { top: 24, right: 24, borderTop: true, borderRight: true },
          { bottom: 24, left: 24, borderBottom: true, borderLeft: true },
          { bottom: 24, right: 24, borderBottom: true, borderRight: true },
        ].map((corner, i) => (
          <div
            key={i}
            className="absolute pointer-events-none hidden sm:block z-30"
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

        <div
          className="hidden lg:block absolute left-6 top-1/2 z-30"
          style={{
            transform: "translateY(-50%) rotate(-90deg)",
            fontSize: 9,
            letterSpacing: "0.3em",
            color: "var(--gold-dim)",
            opacity: 0.4,
            whiteSpace: "nowrap",
          }}
        >
          NEXUS CORP — SEQUENCE 003
        </div>
      </div>
    </section>
  );
}
