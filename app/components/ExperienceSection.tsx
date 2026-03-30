"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const words = [
  { text: "You think", gold: false, size: "clamp(32px, 6vw, 72px)" },
  { text: "faster.", gold: true, size: "clamp(52px, 10vw, 120px)" },
  { text: "You see", gold: false, size: "clamp(32px, 6vw, 72px)" },
  { text: "everything.", gold: true, size: "clamp(52px, 10vw, 120px)" },
  { text: "You become", gold: false, size: "clamp(32px, 6vw, 72px)" },
  { text: "inevitable.", gold: true, size: "clamp(60px, 12vw, 140px)" },
];

const ExperienceSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const centerDotRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const wordsRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // ── Canvas rings ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animFrame: number;
    let speed = 0.4;
    let targetSpeed = 0.4;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const rings: { r: number; alpha: number; speed: number }[] = [];
    const MAX_RINGS = 10;

    for (let i = 0; i < MAX_RINGS; i++) {
      rings.push({
        r: (i / MAX_RINGS) * Math.min(width, height) * 0.5,
        alpha: 0,
        speed: 0.4,
      });
    }

    let tick = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      tick += speed;

      if (tick % (60 / speed) < 1) {
        const weakest = rings.reduce((a, b) => (a.alpha < b.alpha ? a : b));
        weakest.r = 0;
        weakest.alpha = 0.7;
        weakest.speed = speed;
      }

      rings.forEach((ring) => {
        ring.r += ring.speed * 1.2;
        ring.alpha -= 0.004 * ring.speed;
        if (ring.alpha < 0) ring.alpha = 0;
        if (ring.r > Math.max(width, height)) {
          ring.r = 0;
          ring.alpha = 0;
        }

        ctx.beginPath();
        ctx.arc(cx, cy, ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(201,168,76,${ring.alpha * 0.6})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      speed += (targetSpeed - speed) * 0.05;
      animFrame = requestAnimationFrame(draw);
    };

    draw();

    (window as unknown as Record<string, unknown>).__nexusSetRingSpeed = (
      s: number,
    ) => {
      targetSpeed = s;
    };

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── GSAP timeline ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(wordsRefs.current, { autoAlpha: 0, y: 30, scale: 0.95 });
      gsap.set(welcomeRef.current, { autoAlpha: 0, scale: 0.95 });
      gsap.set(burstRef.current, { autoAlpha: 0, scale: 0 });
      gsap.set(wordsContainerRef.current, { autoAlpha: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=600%",
          scrub: 2,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Scene label
      tl.from(".exp-scene-label", {
        autoAlpha: 0,
        y: -10,
        duration: 0.5,
        ease: "power2.out",
      });

      // Center dot breathes
      tl.from(
        centerDotRef.current,
        { autoAlpha: 0, scale: 0, duration: 0.8, ease: "back.out(2)" },
        "+=0.3",
      );
      tl.to(centerDotRef.current, {
        scale: 1.6,
        duration: 0.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 2,
      });

      // Words sequence
      words.forEach((_, i) => {
        tl.call(() => {
          const setter = (window as unknown as Record<string, unknown>)
            .__nexusSetRingSpeed;
          if (typeof setter === "function")
            (setter as (s: number) => void)(0.4 + i * 0.5);
        });

        if (i > 0) {
          tl.to(wordsRefs.current[i - 1], {
            autoAlpha: 0,
            y: -20,
            scale: 0.95,
            duration: 0.4,
            ease: "power2.in",
          });
        }

        if (i === 0) {
          tl.to(
            centerDotRef.current,
            { autoAlpha: 0, scale: 0, duration: 0.3, ease: "power2.in" },
            "<",
          );
        }

        tl.to(
          wordsRefs.current[i],
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: "expo.out" },
          "-=0.1",
        );
        tl.to({}, { duration: i % 2 === 1 ? 1.4 : 0.8 });
      });

      // Max speed then burst
      tl.call(() => {
        const setter = (window as unknown as Record<string, unknown>)
          .__nexusSetRingSpeed;
        if (typeof setter === "function") (setter as (s: number) => void)(6);
      });
      tl.to({}, { duration: 0.6 });

      tl.to(wordsRefs.current[words.length - 1], {
        autoAlpha: 0,
        scale: 1.3,
        duration: 0.4,
        ease: "power3.in",
      });
      tl.to(
        burstRef.current,
        { autoAlpha: 1, scale: 4, duration: 0.5, ease: "expo.out" },
        "-=0.2",
      ).to(burstRef.current, {
        autoAlpha: 0,
        scale: 8,
        duration: 0.6,
        ease: "power2.in",
      });

      // Rings slow down
      tl.call(() => {
        const setter = (window as unknown as Record<string, unknown>)
          .__nexusSetRingSpeed;
        if (typeof setter === "function") (setter as (s: number) => void)(0.1);
      });

      // Welcome
      tl.to(
        welcomeRef.current,
        { autoAlpha: 1, scale: 1, duration: 1.2, ease: "expo.out" },
        "+=0.3",
      );
      tl.to({}, { duration: 2 });
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
        {/* Canvas rings */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        />

        {/* Radial vignette — stronger on mobile so text pops */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 55% at 50% 50%, transparent 15%, rgba(10,10,10,0.88) 100%)",
            zIndex: 2,
          }}
        />

        {/* Scene label — always one line */}
        <div
          className="exp-scene-label absolute top-8 sm:top-10 left-1/2 flex items-center gap-2 z-10"
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
            The Experience
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

        {/* Center breathing dot */}
        <div
          ref={centerDotRef}
          className="absolute rounded-full"
          style={{
            width: "clamp(6px, 1.5vw, 10px)",
            height: "clamp(6px, 1.5vw, 10px)",
            background: "var(--gold-light)",
            boxShadow:
              "0 0 30px 10px rgba(201,168,76,0.5), 0 0 80px 30px rgba(201,168,76,0.2)",
            zIndex: 10,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Burst */}
        <div
          ref={burstRef}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: "clamp(60px, 12vw, 100px)",
            height: "clamp(60px, 12vw, 100px)",
            background:
              "radial-gradient(circle, rgba(232,201,106,0.8) 0%, rgba(201,168,76,0.3) 40%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        />

        {/* Words container */}
        <div
          ref={wordsContainerRef}
          className="absolute inset-0 flex items-center justify-center px-4"
          style={{ zIndex: 10 }}
        >
          {words.map((w, i) => (
            <span
              key={i}
              ref={(el) => {
                wordsRefs.current[i] = el;
              }}
              className={`absolute font-serif text-center ${w.gold ? "italic" : ""}`}
              style={{
                fontSize: w.size,
                fontWeight: 300,
                color: w.gold ? "var(--gold)" : "var(--cream)",
                letterSpacing: w.gold ? "0.03em" : "0.06em",
                lineHeight: 1,
                textShadow: w.gold ? "0 0 60px rgba(201,168,76,0.5)" : "none",
                maxWidth: "90vw",
                textAlign: "center",
                padding: "0 16px",
              }}
            >
              {w.text}
            </span>
          ))}
        </div>

        {/* Welcome */}
        <div
          ref={welcomeRef}
          className="absolute inset-0 flex flex-col items-center justify-center px-4"
          style={{ zIndex: 10 }}
        >
          <p
            className="font-serif italic text-center"
            style={{
              fontSize: "clamp(44px, 12vw, 120px)",
              fontWeight: 300,
              color: "var(--cream)",
              letterSpacing: "0.08em",
            }}
          >
            Welcome.
          </p>
          <div
            style={{
              marginTop: "clamp(16px, 3vw, 28px)",
              width: "clamp(60px, 12vw, 140px)",
              height: 1,
              background:
                "linear-gradient(90deg, transparent, var(--gold), transparent)",
            }}
          />
          <span
            className="font-sans uppercase text-center"
            style={{
              marginTop: "clamp(10px, 2vw, 18px)",
              fontSize: "clamp(8px, 1.5vw, 10px)",
              letterSpacing: "clamp(0.2em, 0.4em, 0.4em)",
              color: "var(--gold-dim)",
              whiteSpace: "nowrap",
            }}
          >
            To the next iteration
          </span>
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
              zIndex: 20,
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
          className="hidden lg:block absolute left-6 top-1/2"
          style={{
            transform: "translateY(-50%) rotate(-90deg)",
            fontSize: 9,
            letterSpacing: "0.3em",
            color: "var(--gold-dim)",
            opacity: 0.4,
            whiteSpace: "nowrap",
            zIndex: 20,
          }}
        >
          NEXUS CORP — SEQUENCE 004
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
