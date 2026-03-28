"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

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

const ProblemSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const statementRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const highlightRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const subRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const finalRef = useRef<HTMLDivElement>(null);
  const finalLineRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // we going to hide everything at the start
      gsap.set(cardRefs.current, { autoAlpha: 0, y: 40 });
      gsap.set(numberRefs.current, { textContent: "0" }); // textContent is a hack to trigger a reflow
      gsap.set(finalRef.current, { autoAlpha: 0, y: 30 });
      gsap.set(finalLineRef.current, { scaleX: 0, transformOrigin: "center" });
      gsap.set(flashRef.current, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=400%",
          scrub: false,
          pin: true,
          anticipatePin: 1,
          onLeave: () => {
            gsap.to(wrapperRef.current, { autoAlpha: 0, duration: 0.4 });
          },
          onEnterBack: () => {
            gsap.to(wrapperRef.current, { autoAlpha: 1, duration: 0.3 });
          },
        },
      });

      // Intro label
      tl.from(".scene-label", {
        autoAlpha: 0,
        y: -10,
        duration: 0.5,
        ease: "power2.out",
      });

      // Loop through each stat
      stats.forEach((stat, i) => {
        // Flash in
        tl.to(flashRef.current, {
          autoAlpha: 1,
          duration: 0.08,
          ease: "none",
        }).to(flashRef.current, {
          autoAlpha: 0,
          duration: 0.12,
          ease: "none",
        });

        // Cards appears
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
        const target = parseFloat(stat.number.replace(",", "")); // remove commas
        const isDecimal = stat.number.includes("."); // check for decimal
        const isLarge = target > 100; // check for large number

        tl.to(
          numberRefs.current[i],
          {
            textContent: target,
            duration: isLarge ? 1.2 : 0.8,
            ease: "power2.out",
            snap: { textContent: isDecimal ? 0.001 : 1 },
            onUpdate: function () {
              const el = numberRefs.current[i];
              if (!el) return;

              const val = parseFloat(el.textContent || "0");
              if (isLarge) {
                el.textContent = Math.round(val).toLocaleString();
              } else if (isDecimal) {
                el.textContent = val.toFixed(3);
              } else {
                el.textContent = Math.round(val).toString();
              }
            },
          },
          "<",
        );

        // Statement fades in
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

        // Sub text
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

        // HOLD
        tl.to({}, { duration: 1.2 });

        // Card disappears (except last)
        if (i < stats.length - 1) {
          tl.to(cardRefs.current[i], {
            autoAlpha: 0,
            y: -30,
            duration: 0.5,
            ease: "power3.in",
          });
        }
      });

      // Final flash
      tl.to(
        flashRef.current,
        { autoAlpha: 1, duration: 0.1, ease: "none" },
        "+=0.2",
      ).to(flashRef.current, {
        autoAlpha: 0,
        duration: 0.15,
        ease: "none",
      });

      // Hide last stat
      tl.to(cardRefs.current, {
        autoAlpha: 0,
        y: -30,
        duration: 0.5,
        ease: "power3.in",
      });

      // Final reveal 'we decided ...'
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

      // Hold at the end
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
        {/* ── White flash overlay ── */}
        <div
          ref={flashRef}
          className="absolute inset-0 pointer-events-none z-50"
          style={{
            background: "var(--black)",
            opacity: 0,
          }}
        />

        {/* ── Scene label ── */}
        <div
          className="scene-label absolute top-10 left-1/2 flex items-center gap-3"
          style={{ transform: "translateX(-50%)" }}
        >
          <div className="gold-line" />
          <span
            className="font-sans uppercase text-gold"
            style={{
              fontSize: 10,
              letterSpacing: "0.4em",
              color: "var(--gold-dim)",
            }}
          >
            The Problem
          </span>
          <div className="gold-line" />
        </div>

        {/* ── Stat cards — stacked, shown one at a time ── */}
        {stats.map((stat, i) => (
          <div
            key={i}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
          >
            {/* Giant number */}
            <div
              className="flex items-end gap-3 mb-6"
              style={{ lineHeight: 1 }}
            >
              <span
                ref={(el) => {
                  numberRefs.current[i] = el;
                }}
                className="font-serif"
                style={{
                  fontSize: "clamp(80px, 16vw, 200px)",
                  fontWeight: 300,
                  color: "var(--cream)",
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                0
              </span>
              <span
                className="font-sans font-light pb-3"
                style={{
                  fontSize: "clamp(18px, 3vw, 36px)",
                  color: "var(--gold)",
                  letterSpacing: "0.2em",
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
                fontSize: "clamp(20px, 3vw, 38px)",
                fontWeight: 300,
                color: "rgba(245,240,232,0.5)",
                maxWidth: 700,
                lineHeight: 1.4,
                opacity: 0,
                transform: "translateY(20px)",
              }}
            >
              {stat.statement}{" "}
              <span
                ref={(el) => {
                  highlightRefs.current[i] = el;
                }}
                style={{
                  color: "var(--cream)",
                }}
              >
                {stat.highlight}
              </span>
            </p>

            {/* Sub text */}
            <p
              ref={(el) => {
                subRefs.current[i] = el;
              }}
              className="font-sans mt-6 uppercase"
              style={{
                fontSize: 11,
                letterSpacing: "0.3em",
                color: "var(--gold-dim)",
                opacity: 0,
                transform: "translateY(10px)",
              }}
            >
              {stat.sub}
            </p>

            {/* Thin decorative line under number */}
            <div
              className="asbolute"
              style={{
                bottom: "calc(50% - 160px)",
                left: "50%",
                transform: "translateX(-50%)",
                width: 1,
                height: 40,
                background:
                  "linear-gradient(to bottom, rgba(201,168,76,0.4), transparent)",
              }}
            />
          </div>
        ))}

        {/* ── Final line ── */}
        <div
          ref={finalRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-8"
          style={{
            opacity: 0,
          }}
        >
          <p
            className="font-serif"
            style={{
              fontSize: "clamp(36px, 6vw, 90px)",
              fontWeight: 300,
              color: "var(--cream)",
              letterSpacing: "0.4em",
              lineHeight: 1.2,
              maxWidth: 800,
            }}
          >
            We decided{" "}
            <span className="italic" style={{ color: "var(--gold)" }}>
              to fix that
            </span>
          </p>

          {/* Gold line under final text */}
          <div
            ref={finalLineRef}
            className="mt-8"
            style={{
              width: "clamp(80px, 12vw, 180px)",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, var(--gold), transparent)",
            }}
          />

          <p
            className="font-sans mt-6 uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.4em",
              color: "var(--gold)",
            }}
          >
            Scroll to continue
          </p>
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
            className="absolute pointer-events-none"
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

        <div
          className="absolute right-10 top-1/2 flex flex-col gap-3"
          style={{
            transform: "translateY(-50%)",
          }}
        >
          {stats.map((_, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: 4,
                height: 4,
                background: "rgba(201,168,76,0.3)",
                boxShadow: "0 0 6px rgba(201,168,76,0.2)",
              }}
            />
          ))}
        </div>

        {/* ── Side label ── */}
        <div
          className="absolute left-8 top-1/2"
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
};

export default ProblemSection;
