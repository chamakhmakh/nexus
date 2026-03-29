"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particleRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);

  const [floatingParticles, setFloatingParticles] = useState<
    { id: number; top: string; left: string; size: number; opacity: number }[]
  >([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFloatingParticles(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        top: `${10 + Math.random() * 80}%`,
        left: `${5 + Math.random() * 90}%`,
        size: Math.random() > 0.7 ? 3 : Math.random() > 0.4 ? 2 : 1,
        opacity: 0.15 + Math.random() * 0.5,
      })),
    );
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      gsap.set(
        [
          particleRef.current,
          ringRef.current,
          ring2Ref.current,
          subtitleRef.current,
          scrollIndicatorRef.current,
          lineRef.current,
          taglineRef.current,
        ],
        { autoAlpha: 0 },
      );
      gsap.set(ringRef.current, { scale: 0 });
      gsap.set(ring2Ref.current, { scale: 0 });
      gsap.set(lettersRef.current, { y: 80, autoAlpha: 0 });
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(taglineRef.current, { y: 20, autoAlpha: 0 });
      gsap.set(subtitleRef.current, { y: 10, autoAlpha: 0 });

      const particles = particlesRef.current?.querySelectorAll(".particle");
      if (particles) gsap.set(particles, { autoAlpha: 0, scale: 0 });

      tl.to(particleRef.current, {
        autoAlpha: 1,
        duration: 0.6,
        ease: "power2.in",
      })
        .to(particleRef.current, {
          scale: 1.8,
          duration: 0.4,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
        })
        .to(
          ringRef.current,
          { autoAlpha: 1, scale: 1, duration: 0.7, ease: "expo.out" },
          "-=0.2",
        )
        .to(
          ring2Ref.current,
          { autoAlpha: 0.4, scale: 1, duration: 0.9, ease: "expo.out" },
          "-=0.5",
        )
        .to(
          particleRef.current,
          { scale: 3, autoAlpha: 0, duration: 0.3, ease: "power3.in" },
          "+=0.2",
        )
        .to(
          [ringRef.current, ring2Ref.current],
          {
            scale: 2.5,
            autoAlpha: 0,
            duration: 0.5,
            ease: "power3.in",
            stagger: 0.05,
          },
          "<",
        )
        .to(
          particles || [],
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.8,
            stagger: { each: 0.04, from: "random" },
            ease: "back.out(2)",
          },
          "-=0.2",
        )
        .to(
          lettersRef.current,
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.1,
            stagger: 0.08,
            ease: "expo.out",
          },
          "-=0.3",
        )
        .to(
          lineRef.current,
          { scaleX: 1, autoAlpha: 1, duration: 0.8, ease: "power3.inOut" },
          "-=0.4",
        )
        .to(
          taglineRef.current,
          { y: 0, autoAlpha: 1, duration: 0.9, ease: "power3.out" },
          "-=0.4",
        )
        .to(
          subtitleRef.current,
          { y: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" },
          "-=0.5",
        )
        .to(
          scrollIndicatorRef.current,
          { autoAlpha: 1, duration: 1, ease: "power2.out" },
          "+=0.2",
        );

      if (particles) {
        particles.forEach((p) => {
          gsap.to(p, {
            y: `random(-30, 30)`,
            x: `random(-20, 20)`,
            duration: `random(3, 6)`,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: `random(0, 3)`,
          });
        });
      }

      gsap.to(".scroll-dot", {
        y: 12,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(noiseRef.current, {
        opacity: 0.025,
        duration: 0.08,
        repeat: -1,
        yoyo: true,
        ease: "none",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const nexusLetters = ["N", "E", "X", "U", "S"];

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--black)" }}
    >
      {/* Film grain */}
      <div
        ref={noiseRef}
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,168,76,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Floating particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {floatingParticles.map((p) => (
          <div
            key={p.id}
            className="particle absolute rounded-full"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              background: `rgba(201,168,76,${p.opacity})`,
              boxShadow: `0 0 ${p.size * 3}px rgba(201,168,76,${p.opacity * 0.5})`,
            }}
          />
        ))}
      </div>

      {/* Core particle */}
      <div
        ref={particleRef}
        className="absolute rounded-full"
        style={{
          width: 6,
          height: 6,
          background: "var(--gold-light)",
          boxShadow:
            "0 0 20px 6px rgba(201,168,76,0.8), 0 0 60px 20px rgba(201,168,76,0.3)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Ring 1 — scales with viewport */}
      <div
        ref={ringRef}
        className="absolute rounded-full"
        style={{
          width: "clamp(140px, 35vw, 260px)",
          height: "clamp(140px, 35vw, 260px)",
          border: "1px solid rgba(201,168,76,0.7)",
          boxShadow:
            "0 0 20px rgba(201,168,76,0.2), inset 0 0 20px rgba(201,168,76,0.05)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Ring 2 */}
      <div
        ref={ring2Ref}
        className="absolute rounded-full"
        style={{
          width: "clamp(240px, 55vw, 400px)",
          height: "clamp(240px, 55vw, 400px)",
          border: "1px solid rgba(201,168,76,0.25)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-20 flex flex-col items-center text-center w-full px-5">
        {/* Eyebrow */}
        <div
          ref={subtitleRef}
          className="mb-6 md:mb-10 flex items-center gap-3"
        >
          <div
            className="gold-line"
            style={{ width: "clamp(20px, 4vw, 60px)" }}
          />
          <span
            className="font-sans uppercase font-medium text-gold"
            style={{
              fontSize: "clamp(9px, 2vw, 11px)",
              letterSpacing: "clamp(0.2em, 0.35em, 0.35em)",
              whiteSpace: "nowrap",
            }}
          >
            Est. 2047 — Geneva, Switzerland
          </span>
          <div
            className="gold-line"
            style={{ width: "clamp(20px, 4vw, 60px)" }}
          />
        </div>

        {/* NEXUS — the hero title, always BIG */}
        <h1
          className="font-serif flex select-none"
          style={{
            fontSize: "clamp(80px, 20vw, 200px)",
            fontWeight: 300,
            lineHeight: 1,
            letterSpacing: "clamp(0.08em, 0.15em, 0.15em)",
          }}
        >
          {nexusLetters.map((letter, i) => (
            <span
              key={i}
              ref={(el) => {
                lettersRef.current[i] = el;
              }}
              className="inline-block gold-gradient"
            >
              {letter}
            </span>
          ))}
        </h1>

        {/* Gold divider line */}
        <div
          ref={lineRef}
          style={{
            marginTop: "clamp(16px, 4vw, 36px)",
            marginBottom: "clamp(16px, 4vw, 36px)",
            width: "clamp(100px, 22vw, 300px)",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, var(--gold), transparent)",
          }}
        />

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="font-serif italic"
          style={{
            fontSize: "clamp(16px, 3.5vw, 32px)",
            fontWeight: 300,
            color: "var(--cream)",
            letterSpacing: "0.04em",
            maxWidth: "clamp(260px, 70vw, 640px)",
            lineHeight: 1.4,
          }}
        >
          The next chapter of mankind begins here.
        </p>

        {/* Sub-tagline */}
        <p
          className="font-sans uppercase"
          style={{
            marginTop: "clamp(10px, 2vw, 20px)",
            color: "var(--gold-dim)",
            letterSpacing: "clamp(0.15em, 0.25em, 0.25em)",
            fontSize: "clamp(9px, 1.5vw, 11px)",
          }}
        >
          Engineering &nbsp;·&nbsp; Evolution &nbsp;·&nbsp; Eternity
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 flex flex-col items-center gap-3"
        style={{ transform: "translateX(-50%)" }}
      >
        <span
          style={{
            fontSize: 9,
            color: "var(--gold-dim)",
            letterSpacing: "0.3em",
            fontFamily: "var(--font-sans)",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
        <div
          className="relative rounded-full flex justify-center pt-2"
          style={{
            width: 22,
            height: 36,
            border: "1px solid rgba(201,168,76,0.3)",
          }}
        >
          <div
            className="scroll-dot rounded-full"
            style={{
              width: 3,
              height: 3,
              background: "var(--gold)",
              boxShadow: "0 0 6px rgba(201,168,76,0.8)",
            }}
          />
        </div>
      </div>

      {/* Corner brackets — hidden on small mobile */}
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
              ? "1px solid rgba(201,168,76,0.25)"
              : "none",
            borderBottom: corner.borderBottom
              ? "1px solid rgba(201,168,76,0.25)"
              : "none",
            borderLeft: corner.borderLeft
              ? "1px solid rgba(201,168,76,0.25)"
              : "none",
            borderRight: corner.borderRight
              ? "1px solid rgba(201,168,76,0.25)"
              : "none",
          }}
        />
      ))}

      {/* Side labels — desktop only */}
      <div
        className="absolute left-6 top-1/2 hidden lg:block"
        style={{
          transform: "translateY(-50%) rotate(-90deg)",
          fontSize: 9,
          letterSpacing: "0.3em",
          color: "var(--gold-dim)",
          opacity: 0.5,
          whiteSpace: "nowrap",
          fontFamily: "var(--font-sans)",
        }}
      >
        NEXUS CORP — CLASSIFIED
      </div>
      <div
        className="absolute right-6 top-1/2 hidden lg:block"
        style={{
          transform: "translateY(-50%) rotate(90deg)",
          fontSize: 9,
          letterSpacing: "0.3em",
          color: "var(--gold-dim)",
          opacity: 0.5,
          whiteSpace: "nowrap",
          fontFamily: "var(--font-sans)",
        }}
      >
        SEQUENCE 001 — INIT
      </div>
    </section>
  );
};

export default HeroSection;
