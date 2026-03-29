"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const lines = [
  {
    text: "We do not believe",
    size: "clamp(36px, 6vw, 88px)",
    gold: false,
    italic: false,
    align: "left",
  },
  {
    text: "in limits.",
    size: "clamp(48px, 8vw, 110px)",
    gold: true,
    italic: true,
    align: "left",
  },
  {
    text: "We believe limits",
    size: "clamp(16px, 2.2vw, 32px)",
    gold: false,
    italic: false,
    align: "right",
  },
  {
    text: "believe in us.",
    size: "clamp(16px, 2.2vw, 32px)",
    gold: false,
    italic: true,
    align: "right",
  },
  {
    text: "Every ceiling is someone else's floor.",
    size: "clamp(12px, 1.4vw, 20px)",
    gold: false,
    italic: false,
    align: "center",
  },
  {
    text: "We built the elevator.",
    size: "clamp(30px, 5vw, 72px)",
    gold: true,
    italic: true,
    align: "center",
  },
  {
    text: "NEXUS is not a product.",
    size: "clamp(22px, 3.5vw, 52px)",
    gold: false,
    italic: false,
    align: "left",
  },
  {
    text: "NEXUS is a decision.",
    size: "clamp(36px, 6vw, 88px)",
    gold: true,
    italic: true,
    align: "left",
  },
];

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dividerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[][]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hide all words initially
      lineRefs.current.forEach((line) => {
        if (!line) return;
        const words = line.querySelectorAll(".manifesto-word");
        gsap.set(words, { y: "110%", autoAlpha: 0 });
      });
      gsap.set(dividerRef.current, {
        scaleX: 0,
        transformOrigin: "center",
        autoAlpha: 0,
      });
      gsap.set(logoRef.current, { autoAlpha: 0, y: 40 });

      // Scene label
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

      // Each line reveals on scroll
      lineRefs.current.forEach((line) => {
        if (!line) return;
        const words = line.querySelectorAll(".manifesto-word");
        gsap.to(words, {
          y: "0%",
          autoAlpha: 1,
          duration: 1,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: {
            trigger: line,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });

      // Divider
      gsap.to(dividerRef.current, {
        scaleX: 1,
        autoAlpha: 1,
        duration: 1.2,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: dividerRef.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      });

      // Logo
      gsap.to(logoRef.current, {
        autoAlpha: 1,
        y: 0,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: logoRef.current,
          start: "top 92%",
          toggleActions: "play none none none",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split line into animated word spans
  const splitWords = (text: string, lineIdx: number) => {
    return text.split(" ").map((word, wi) => (
      <span
        key={wi}
        className="inline-block overflow-hidden"
        style={{ marginRight: "0.25em" }}
      >
        <span
          ref={(el) => {
            if (!wordRefs.current[lineIdx]) wordRefs.current[lineIdx] = [];
            wordRefs.current[lineIdx][wi] = el;
          }}
          className="manifesto-word inline-block"
        >
          {word}
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
        paddingBottom: "clamp(80px, 12vw, 160px)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(201,168,76,0.03) 0%, transparent 70%)",
        }}
      />

      {/* ── Scene label — always one line ── */}
      <div
        className="manifesto-label flex items-center gap-2"
        style={{
          paddingTop: "clamp(60px, 10vw, 120px)",
          paddingLeft: "clamp(20px, 8vw, 120px)",
          marginBottom: "clamp(40px, 8vw, 96px)",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            width: "clamp(20px, 4vw, 60px)",
            height: 1,
            background: "linear-gradient(90deg, transparent, var(--gold-dim))",
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
          The Manifesto
        </span>
        <div
          style={{
            width: "clamp(20px, 4vw, 60px)",
            height: 1,
            background: "linear-gradient(90deg, var(--gold-dim), transparent)",
          }}
        />
      </div>

      {/* ── Lines ── */}
      <div
        className="relative flex flex-col"
        style={{
          gap: "clamp(24px, 5vw, 64px)",
          paddingBottom: "clamp(40px, 6vw, 80px)",
        }}
      >
        {lines.map((line, i) => (
          <div key={i}>
            {/* Gold divider before line 4 */}
            {i === 4 && (
              <div
                ref={dividerRef}
                style={{
                  margin: "clamp(16px, 4vw, 40px) auto clamp(24px, 5vw, 56px)",
                  width: "clamp(40px, 8vw, 120px)",
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, var(--gold), transparent)",
                }}
              />
            )}

            <div
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              style={{
                paddingLeft:
                  line.align === "left" ? "clamp(20px, 8vw, 120px)" : 0,
                paddingRight:
                  line.align === "right" ? "clamp(20px, 8vw, 120px)" : 0,
                textAlign: line.align as "left" | "right" | "center",
              }}
            >
              {/* Article label above first line of each block */}
              {(i === 0 || i === 6) && (
                <div
                  className="font-sans uppercase"
                  style={{
                    fontSize: "clamp(7px, 1vw, 9px)",
                    letterSpacing: "0.3em",
                    color: "var(--gold-dim)",
                    opacity: 0.6,
                    marginBottom: "clamp(6px, 1vw, 12px)",
                    paddingLeft: line.align === "left" ? 0 : undefined,
                  }}
                >
                  {i === 0 ? "Article I" : "Article II"}
                </div>
              )}

              <p
                className={`font-serif ${line.italic ? "italic" : ""}`}
                style={{
                  fontSize: line.size,
                  fontWeight: 300,
                  color: line.gold ? "var(--gold)" : "var(--cream)",
                  lineHeight: 1.05,
                  letterSpacing: line.gold ? "0.02em" : "0.01em",
                }}
              >
                {splitWords(line.text, i)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom NEXUS logo ── */}
      <div
        ref={logoRef}
        className="flex flex-col items-center gap-3 sm:gap-4"
        style={{ marginTop: "clamp(24px, 5vw, 60px)" }}
      >
        <div
          style={{
            width: "clamp(40px, 8vw, 120px)",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, var(--gold), transparent)",
          }}
        />

        <h2
          className="font-serif gold-gradient"
          style={{
            fontSize: "clamp(28px, 6vw, 64px)",
            fontWeight: 300,
            letterSpacing: "0.3em",
          }}
        >
          NEXUS
        </h2>

        <p
          className="font-sans uppercase text-center px-4"
          style={{
            fontSize: "clamp(7px, 1.2vw, 9px)",
            letterSpacing: "clamp(0.2em, 0.4em, 0.4em)",
            color: "var(--gold-dim)",
          }}
        >
          Engineering · Evolution · Eternity
        </p>

        <div
          style={{
            width: "clamp(40px, 8vw, 120px)",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, var(--gold), transparent)",
          }}
        />
      </div>

      {/* Side label — lg only */}
      <div
        className="hidden lg:block absolute left-6 top-1/2"
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
}
