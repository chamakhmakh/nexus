/* eslint-disable react-hooks/purity */
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particleRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);

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
        {
          autoAlpha: 0,
        },
      );
      gsap.set(ringRef.current, { scale: 0 });
      gsap.set(ring2Ref.current, { scale: 0 });
      gsap.set(lettersRef.current, { y: 80, autoAlpha: 0 });
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(taglineRef.current, { y: 20, autoAlpha: 0 });

      const particles = particlesRef.current?.querySelectorAll(".particle");
      if (particles) {
        gsap.set(particles, { autoAlpha: 0, scale: 0 });
      }

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
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.7,
            ease: "expo.out",
          },
          "-=0.2",
        )
        .to(
          ring2Ref.current,
          {
            autoAlpha: 0.4,
            scale: 1,
            duration: 0.9,
            ease: "expo.out",
          },
          "-=0.5",
        )
        .to(
          particleRef.current,
          {
            scale: 3,
            autoAlpha: 0,
            duration: 0.3,
            ease: "power3.in",
          },
          "-=0.3",
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
          {
            scaleX: 1,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power3.inOut",
          },
          "-=0.4",
        )
        .to(
          taglineRef.current,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .to(
          subtitleRef.current,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.5",
        )
        .to(
          scrollIndicatorRef.current,
          {
            autoAlpha: 1,
            duration: 1,
            ease: "power2.out",
          },
          "+=0.2",
        );

      if (particles) {
        particles.forEach((p) => {
          gsap.to(p, {
            y: `random(-30, 30)`,
            x: `random(-20, 20)`,
            duration: `random(3, 6)`,
            repeat: -1,
            yoy: true,
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

  const floatingParticles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    top: `${10 + Math.random() * 80}%`,
    left: `${5 + Math.random() * 90}%`,
    size: Math.random() > 0.7 ? 3 : Math.random() > 0.4 ? 2 : 1,
    opacity: 0.15 + Math.random() * 0.5,
  }));

  const nexusLetters = ["N", "E", "X", "U", "S"];

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: " var(--black)" }}
    >
      {/* ── Film grain overlay ── */}
      <div
        ref={noiseRef}
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* ── Radial gold ambient glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ── Floating background particles ── */}
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
              boxShadow: `0 0 ${p.size * 3}px rgba(201,168,76,${p.opacity} * 0.5)`,
            }}
          />
        ))}
      </div>

      {/* ── Core particle ── */}
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

      {/* ── Ring 1 ── */}
      <div
        ref={ringRef}
        className="absolute rounded-full"
        style={{
          width: 200,
          height: 200,
          border: "1px solid rgba(201,168,76,0.7)",
          boxShadow:
            "0 0 20px rgba(201,168,76,0.2), inset 0 0 20px rgba(201,168,76,0.05)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* ── Ring 2 (echo) ── */}
      <div
        ref={ring2Ref}
        className="absolute rounded-full"
        style={{
          width: 340,
          height: 340,
          border: "1px solid rgba(201,168,76,0.25)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* ── Main content ── */}
      <div className="relative z-20 flex flex-col items-center text-center px-6">
        {/* Eyebrow label */}
        <div
          ref={subtitleRef}
          className="mb-8 flex items-center gap-3"
          style={{ transform: "translateY(10px)" }}
        >
          <div className="gold-line" />
          <span className="text-gold tracking-[0.35em] uppercase text-xs font-sans font-medium">
            Est. 2047 — Geneva, Switzerland
          </span>
          <div className="gold-line" />
        </div>

        {/* NEXUS — main title */}
        <h1
          ref={logoRef}
          className="font-serif flex tracking-[0.15em] select-none"
          style={{
            fontSize: "clamp(72px, 14vw, 180px)",
            fontWeight: 300,
            lineHeight: 1,
            letterSpacing: "0.15em",
          }}
        >
          {nexusLetters.map((letter, i) => (
            <span
              key={i}
              ref={(el) => {
                lettersRef.current[i] = el;
              }}
              className="inline-block gold-gradient"
              style={{ display: "inline-block" }}
            >
              {letter}
            </span>
          ))}
        </h1>

        {/* Gold divider line */}
        <div
          ref={lineRef}
          className="my-8"
          style={{
            width: "clamp(120px, 20vw, 280px)",
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
            fontSize: "clamp(18px, 2.5vw, 28px)",
            fontWeight: 300,
            color: "var(--cream)",
            letterSpacing: "0.05em",
            maxWidth: 600,
          }}
        >
          The next chapter of mankind begins here.
        </p>

        {/* Sub-tagline */}
        <p
          className="font-sans mt-4 text-sm tracking-widest uppercase"
          style={{
            color: "var(--gold-dom)",
            letterSpacing: "0.25em",
            fontSize: 11,
          }}
        >
          Engineering &nbsp;·&nbsp; Evolution &nbsp;·&nbsp; Eternity
        </p>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 flex flex-col items-center gap-3"
        style={{ transform: "translate(-50%)" }}
      >
        <span
          className="font-sans text-gold-dim uppercase tracking-[0.3em]"
          style={{ fontSize: 9, color: "var(--gold-dim)" }}
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
              boxShadow: " 0 0 6px rgba(201,168,76,0.8)",
            }}
          />
        </div>
      </div>

      {/* ── Corner decorations ── */}
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
              ? "1px solid rgba(201,168,76,0.3)"
              : "none",
            borderBottom: corner.borderBottom
              ? "1px solid rgba(201,168,76,0.3)"
              : "none",
            borderLeft: corner.borderLeft
              ? "1px solid rgba(201,168,76,0.3)"
              : "none",
            borderRight: corner.borderRight
              ? "1px solid rgba(201,168,76,0.3)"
              : "none",
          }}
        />
      ))}

      {/* ── Side labels ── */}
      <div
        className="absolute left-8 top-1/2 font-sans text-gold-dim"
        style={{
          transform: "translateY(-50%) rotate(-90deg)",
          fontSize: 9,
          letterSpacing: "0.3em",
          color: "var(--gold-dim)",
          opacity: 0.5,
          whiteSpace: "nowrap",
        }}
      >
        NEXUS CORP — CLASSIFIED
      </div>
      <div
        className="absolute right-8 top-1/2 font-sans"
        style={{
          transform: "translateY(-50%) rotate(90deg)",
          fontSize: 9,
          letterSpacing: "0.3em",
          color: "var(--gold-dim)",
          opacity: 0.5,
          whiteSpace: "nowrap",
        }}
      >
        SEQUENCE 001 — INIT
      </div>
    </section>
  );
};

export default HeroSection;
