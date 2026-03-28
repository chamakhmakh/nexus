"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const lines = [
  {
    text: "We do not believe",
    size: "clamp(40px, 6vw, 88px)",
    gold: false,
    weight: 300,
    italic: false,
    align: "left",
  },
  {
    text: "in limits.",
    size: "clamp(48px, 7.5vw, 110px)",
    gold: true,
    weight: 300,
    italic: true,
    align: "left",
  },
  {
    text: "We believe limits",
    size: "clamp(18px, 2.2vw, 32px)",
    gold: false,
    weight: 300,
    italic: false,
    align: "right",
  },
  {
    text: "believe in us.",
    size: "clamp(18px, 2.2vw, 32px)",
    gold: false,
    weight: 300,
    italic: true,
    align: "right",
  },
  {
    text: "Every ceiling is someone else's floor.",
    size: "clamp(14px, 1.4vw, 20px)",
    gold: false,
    weight: 300,
    italic: false,
    align: "center",
  },
  {
    text: "We built the elevator.",
    size: "clamp(36px, 5vw, 72px)",
    gold: true,
    weight: 300,
    italic: true,
    align: "center",
  },
  {
    text: "NEXUS is not a product.",
    size: "clamp(28px, 3.5vw, 52px)",
    gold: false,
    weight: 300,
    italic: false,
    align: "left",
  },
  {
    text: "NEXUS is a decision.",
    size: "clamp(40px, 6vw, 88px)",
    gold: true,
    weight: 300,
    italic: true,
    align: "left",
  },
];

const ManifestoSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(HTMLDivElement | null)[]>([]);
  const dividerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[][]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state
      linesRef.current.forEach((l) => {
        if (!l) return;
        const words = l.querySelectorAll(".manifesto-word");
        gsap.set(words, { y: "110%", autoAlpha: 0 });
      });

      gsap.set(dividerRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
        autoAlpha: 0,
      });

      gsap.set(logoRef.current, {
        autoAlpha: 0,
        y: 40,
      });

      // Sceme label
      gsap.from(".manifesto-label", {
        autoAlpha: 0,
        y: -10,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Animation each line on scroll
      linesRef.current.forEach((l) => {
        if (!l) return;
        const words = l.querySelectorAll(".manifesto-word");

        gsap.to(words, {
          y: "0%",
          autoAlpha: 1,
          duration: 1,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: {
            trigger: l,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });

      // Divider line
      gsap.to(dividerRef.current, {
        scaleX: 1,
        autoAlpha: 1,
        duration: 1.2,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: dividerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Logo reveal
      gsap.to(logoRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: logoRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const splitWords = (text: string, lineIdx: number) => {
    return text.split(" ").map((w, wi) => (
      <span
        key={wi}
        className="inline-block overflow-hidden"
        style={{
          marginRight: "0.25em",
        }}
      >
        <span
          ref={(el) => {
            if (!wordRefs.current[lineIdx]) wordRefs.current[lineIdx] = [];
            wordRefs.current[lineIdx][wi] = el;
          }}
          className="manifesto-word inline-block"
        >
          {w}
        </span>
      </span>
    ));
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{
        background: "var(--black)",
        paddingBottom: "160px",
      }}
    >
      {/* ── Ambient glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(201,168,76,0.03) 0%, transparent 70%)",
        }}
      />

      {/* ── Scene label ── */}
      <div
        className="monifesto-label flex items-center gap-3 mb-24"
        style={{
          paddingTop: "120px",
          paddingLeft: "clamp(32px, 8vw, 120px)",
        }}
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
          The manifestto
        </span>
        <div className="gold-line" />
      </div>

      {/* ── Lines ── */}
      <div
        className="relative flex flex-col"
        style={{
          gap: "clamp()32px, 5vw, 64px",
          paddingBottom: "90px",
        }}
      >
        {lines.map((l, i) => {
          const isGoldDivider = i === 4; // after line index 3, before 4

          return (
            <div key={i}>
              {/* Gold divider between line 3 and 4 */}
              {i === 4 && (
                <div
                  ref={dividerRef}
                  className="mx-auto mb-16"
                  style={{
                    width: "clamp(60px, 8vw, 120px)",
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent, var(--gold), transparent)",
                  }}
                />
              )}

              <div
                ref={(el) => {
                  linesRef.current[i] = el;
                }}
                className="relative"
                style={{
                  paddingLeft:
                    l.align === "right"
                      ? 0
                      : l.align === "center"
                        ? 0
                        : "clamp(32px, 8vw, 120px)",
                  paddingRight:
                    l.align === "right"
                      ? "clamp(32px, 8vw, 120px)"
                      : l.align === "center"
                        ? 0
                        : 0,
                  textAlign: l.align as "left" | "right" | "center",
                }}
              >
                {/* Small label above big lines */}
                {(i === 0 || i === 6) && (
                  <div
                    className="font-sans uppercase mb-3"
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.35em",
                      color: "var(--gold-dim)",
                      opacity: 0.6,
                    }}
                  >
                    {i === 0 ? "Article I" : "Article II"}
                  </div>
                )}

                <p
                  className={`font-serif leading-none ${l.italic ? "italic" : ""}`}
                  style={{
                    fontSize: l.size,
                    fontWeight: l.weight,
                    color: l.gold ? "var(--gold)" : "var(--cream)",
                    lineHeight: 1.05,
                    letterSpacing: l.gold ? "0.02em" : "0.01em",
                  }}
                >
                  {splitWords(l.text, i)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom NEXUS logo ── */}
      <div
        ref={logoRef}
        className="flex flex-col items-center gap-4 mt-16"
        style={{
          paddingBottom: "40px",
        }}
      >
        <div
          style={{
            width: "clamp(60px, 8vw, 120px)",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, var(--gold), transparent)",
          }}
        />
        <h2
          className="font-serif gold-gradient"
          style={{
            fontSize: "clamp(32px, 5vw, 64px)",
            fontWeight: 300,
            letterSpacing: "0.3em",
          }}
        >
          NEXUS
        </h2>

        <p
          className="font-sans uppercase"
          style={{
            fontSize: 9,
            letterSpacing: "0.4em",
            color: "var(--gold-dim)",
          }}
        >
          Engineering · Evolution · Eternity
        </p>

        <div
          style={{
            width: "clamp(60px, 8vw, 120px)",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, var(--gold), transparent)",
          }}
        />
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
        NEXUS CORP — SEQUENCE 005
      </div>
    </section>
  );
};

export default ManifestoSection;
