"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

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

const TechnologySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const finalTextRef = useRef<HTMLParagraphElement>(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);

  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const topBorderRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numeralRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const nameRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const statsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(cardsRef.current, { autoAlpha: 0, x: 80 });
      gsap.set(topBorderRefs.current, {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(numeralRefs.current, { autoAlpha: 0, y: 20 });
      gsap.set(nameRefs.current, { autoAlpha: 0, y: 30 });
      gsap.set(descRefs.current, { autoAlpha: 0, y: 15 });
      gsap.set(statsRefs.current, { autoAlpha: 0, y: 10 });
      gsap.set(tagRefs.current, { autoAlpha: 0 });
      gsap.set(gridRef.current, { autoAlpha: 0 });
      gsap.set(scanLineRef.current, {
        scaleY: 0,
        transformOrigin: "top center",
      });
      gsap.set(finalTextRef.current, { autoAlpha: 0, y: 20 });
      gsap.set(bottomLineRef.current, { scaleX: 0, transformOrigin: "center" });

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

      // Scene label
      tl.from(".tech-scene-label", {
        autoAlpha: 0,
        y: -10,
        duration: 0.4,
        ease: "power2.out",
      });

      // Grid pulses in
      tl.to(
        gridRef.current,
        {
          autoAlpha: 1,
          duration: 1,
          ease: "power2.out",
        },
        "+=0.2",
      );

      // Loop cards
      technologies.forEach((_, i) => {
        const label = `card-${i}`;

        // Scan line sweeps
        tl.to(
          scanLineRef.current,
          {
            scaleY: 1,
            duration: 0.3,
            ease: "power2.in",
          },
          i === 0 ? "+=0.1" : "+=0.2",
        )
          .to(scanLineRef.current, {
            x: "100vw",
            duration: 0.5,
            ease: "power2.out",
          })
          .set(scanLineRef.current, { x: 0, scaleY: 0 });

        // Card slides in
        tl.to(
          cardsRef.current[i],
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.7,
            ease: "expo.out",
          },
          label,
        );

        // Top border draws
        tl.to(
          topBorderRefs.current[i],
          {
            scaleX: 1,
            duration: 0.6,
            ease: "power3.inOut",
          },
          `${label}+=0.1`,
        );

        // Numeral
        tl.to(
          numeralRefs.current[i],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          },
          `${label}+=0.2`,
        );

        // Name
        tl.to(
          nameRefs.current[i],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "expo.out",
          },
          `${label}+=0.3`,
        );

        // Description
        tl.to(
          descRefs.current[i],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
          },
          `${label}+=0.5`,
        );

        // Stats
        tl.to(
          statsRefs.current[i],
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          },
          `${label}+=0.6`,
        );

        // Tag
        tl.to(
          tagRefs.current[i],
          {
            autoAlpha: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          `${label}+=0.7`,
        );

        // Hold
        tl.to({}, { duration: 1.0 });
      });

      // Final line
      tl.to(
        finalTextRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "+=0.3",
      ).to(
        bottomLineRef.current,
        {
          scaleX: 1,
          duration: 0.8,
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
        style={{
          background: "var(--black)",
        }}
        className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* ── Blueprint grid background ── */}
        <div
          ref={gridRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
            linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* ── Radial vignette ── */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, var(--black) 100%)",
          }}
        />

        {/* ── Scan line ── */}
        <div
          ref={scanLineRef}
          className="absolute top-0 bottom-0 pointer-events-none z-10"
          style={{
            width: 1,
            background:
              "linear-gradient(to bottom, transparent, var(--gold), transparent)",
            boxShadow: "0 0 12px 2px rgba(201,168,76,0.4)",
            left: 0,
          }}
        />

        {/* ── Scene label ── */}
        <div
          className="tech-scene-label absolute top-10 left-1/2 flex items-center gap-3 z-30"
          style={{ transform: "translateX(-50%)" }}
        >
          <div className="gold-line" />
          <span
            className="font-sans uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.4em",
              color: "var(--gold-dim)",
            }}
          >
            The technology
          </span>
          <div className="gold-line" />
        </div>

        {/* ── Cards container ── */}
        <div className="relative z-30 w-full max-w-6xl grid grid-cols-3 gap-6">
          {technologies.map((tech, i) => (
            <div
              key={i}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="relative flex flex-col"
              style={{ padding: "28px 24px 24px" }}
            >
              {/* Top border that draws in */}
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

              {/* Left border accent */}
              <div
                className="absolute top-0 left-0 bottom-0"
                style={{
                  width: 1,
                  background:
                    "linear-gradient(to bottom, var(--gold), transparent)",
                  opacity: 0.3,
                }}
              />

              {/* Roman numeral */}
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

              {/* Tech name */}
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

              {/* Subtitle */}
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

              {/* Thin separator */}
              <div
                className="my-4"
                style={{
                  height: 1,
                  background: "rgba(201,168,76,0.1)",
                }}
              />

              {/* Description */}
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

              {/* Stats grid */}
              <div
                ref={(el) => {
                  statsRefs.current[i] = el;
                }}
                className="grid grid-cols-2 gap-2 mt-auto"
              >
                {tech.stats.map((stat, j) => (
                  <div
                    key={j}
                    className="flex flex-col"
                    style={{
                      padding: "8px 10px",
                      background: "rgba(201,168,76,0.04)",
                      border: "1px solid rgba(201,168,76,0.1)",
                    }}
                  >
                    <span
                      className="font-serif"
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
                      className="font-sans uppercase"
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

              {/* Status tag */}
              <span
                ref={(el) => {
                  tagRefs.current[i] = el;
                }}
                className="font-sans uppercase mt-4 inline-block"
                style={{
                  fontSize: 9,
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

        {/* ── Final text ── */}
        <div
          className="absolute bottom-16 left-1/2 z-30 flex flex-col items-center gap-4"
          style={{ transform: "translateX(-50%)" }}
        >
          <p
            ref={finalTextRef}
            className="font-serif italic text-center"
            style={{
              fontSize: "clamp(16px, 2vw, 24px)",
              fontWeight: 300,
              color: "var(--cream-dim)",
              letterSpacing: "0.05em",
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

        {/* ── Corner brackets ── */}
        {[
          { top: 32, left: 32, borderTop: true, borderLeft: true },
          { top: 32, right: 32, borderTop: true, borderRight: true },
          { bottom: 32, left: 32, borderBottom: true, borderLeft: true },
          { bottom: 32, right: 32, borderBottom: true, borderRight: true },
        ].map((corner, i) => (
          <div
            key={i}
            className="absolute pointer-events-none z-30"
            style={{
              ...(corner.top !== undefined ? { top: corner.top } : {}),
              ...(corner.bottom !== undefined ? { bottom: corner.bottom } : {}),
              ...(corner.left !== undefined ? { left: corner.left } : {}),
              ...(corner.right !== undefined ? { right: corner.right } : {}),
              width: 24,
              height: 24,
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

        {/* ── Side label ── */}
        <div
          className="absolute left-8 top-1/2 z-30"
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
};

export default TechnologySection;
