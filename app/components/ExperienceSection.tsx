"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const words = [
  { text: "You think", gold: false, size: "clamp(28px, 4vw, 56px)" },
  { text: "faster.", gold: true, size: "clamp(48px, 7vw, 96px)" },
  { text: "You see", gold: false, size: "clamp(28px, 4vw, 56px)" },
  { text: "everything.", gold: true, size: "clamp(48px, 7vw, 96px)" },
  { text: "You become", gold: false, size: "clamp(28px, 4vw, 56px)" },
  { text: "inevitable.", gold: true, size: "clamp(56px, 9vw, 120px)" },
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

  // Canvas ring animation
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
    const MAX_RINGS = 12;

    // Speed rings
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

      // Spawn new ring periodically
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
        ctx.strokeStyle = `rgba(201,168,76, ${ring.alpha * 0.6})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Lerp speed
      speed += (targetSpeed - speed) * 0.05;

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    // Expose speed setter globally for GSAP
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state
      gsap.set(wordsRefs.current, { autoAlpha: 0, y: 30, scale: 0.95 });
      gsap.set(welcomeRef.current, { autoAlpha: 0, scale: 0.9 });
      gsap.set(burstRef.current, { autoAlpha: 0, scale: 0 });
      gsap.set(wordsContainerRef.current, { autoAlpha: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=600%",
          scrub: false,
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
        {
          autoAlpha: 0,
          scale: 0,
          duration: 0.8,
          ease: "back.out(2)",
        },
        "+=0.3",
      );

      tl.to(centerDotRef.current, {
        scale: 1.6,
        duration: 0.6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 2, // repeat 2 times
      });

      // Words appear one by one
      words.forEach((_, i) => {
        // Speed up rings
        tl.call(() => {
          const setter = (window as unknown as Record<string, unknown>)
            .__nexusSetRingSpeed;
          if (typeof setter === "function") {
            (setter as (s: number) => void)(0.4 + i * 0.5);
          }
        });

        // Hide previous words
        if (i > 0) {
          tl.to(wordsRefs.current[i - 1], {
            autoAlpha: 0,
            y: -20,
            scale: 0.95,
            duration: 0.4,
            ease: "power2.in",
          });
        }

        // Hide center fot after first word
        if (i === 0) {
          tl.to(
            centerDotRef.current,
            {
              autoAlpha: 0,
              scale: 0,
              duration: 0.3,
              ease: "power2.in",
            },
            "<",
          );
        }

        // Show current word
        tl.to(
          wordsRefs.current[i],
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "expo.out",
          },
          "-=0.1",
        );

        // Hold
        tl.to({}, { duration: i % 2 === 1 ? 1.4 : 0.8 });
      });

      // Max speed before burst
      tl.call(() => {
        const setter = (window as unknown as Record<string, unknown>)
          .__nexusSetRingSpeed;
        if (typeof setter === "function") {
          (setter as (s: number) => void)(6);
        }
      });

      tl.to({}, { duration: 0.6 });

      // Burst of light
      tl.to(wordsRefs.current[words.length - 1], {
        autoAlpha: 0,
        scale: 1.3,
        duration: 0.4,
        ease: "power3.in",
      });

      tl.to(
        burstRef.current,
        {
          autoAlpha: 1,
          scale: 4,
          duration: 0.5,
          ease: "expo.out",
        },
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
        if (typeof setter === "function") {
          (setter as (s: number) => void)(0.1);
        }
      });

      // Welcome
      tl.to(
        welcomeRef.current,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1.2,
          ease: "expo.out",
        },
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
        {/* ── Canvas rings ── */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        />

        {/* ── Radial vignette ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, transparent 20%, rgba(10,10,10,0.85) 100%)",
            zIndex: 2,
          }}
        />

        {/* ── Scene label ── */}
        <div
          className="exp-scene-label absolute top-10 left-1/2 flex items-center gap-3 z-10"
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
            The Experience
          </span>
          <div className="gold-line" />
        </div>

        {/* ── Center breathing dot ── */}
        <div
          ref={centerDotRef}
          className="absolute rounded-full"
          style={{
            width: 8,
            height: 8,
            background: "var(--gold-dim)",
            boxShadow:
              "0 0 30px 10px rgba(201,168,76,0.5), 0 0 80px 30px rgba(201,168,76,0.2)",
            zIndex: 10,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* ── Burst flash ── */}
        <div
          ref={burstRef}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 80,
            height: 80,
            background:
              "radial-gradient(circle, rgba(232,201,106,0.8) 0%, rgba(201,168,76,0.3) 40%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        />

        {/* ── Words container ── */}
        <div
          ref={wordsContainerRef}
          className="absolute inset-0 flex items-center justify-center z-10"
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
                letterSpacing: w.gold ? "0.04em" : "0.08em",
                lineHeight: 1,
                textShadow: w.gold ? "0 0 40px rgba(201,168,76,0.4)" : "none",
                maxWidth: "80vw",
                textAlign: "center",
              }}
            >
              {w.text}
            </span>
          ))}
        </div>

        {/* ── Welcome ── */}
        <div
          ref={welcomeRef}
          className="absolute inset-0 flex flex-col items-center justify-center z-10"
        >
          <p
            className="font-serif italic"
            style={{
              fontSize: "clamp(48px, 8vw, 110px)",
              fontWeight: 300,
              color: "var(--cream)",
              letterSpacing: "0.1em",
            }}
          >
            Welcome.
          </p>
          <div
            className="mt-6"
            style={{
              width: "clamp(60px, 8vw, 120px)",
              height: 1,
              background:
                "linear-gradient(90deg, transparent, var(--gold), transparent)",
            }}
          />
          <span
            className="font-sans uppercase mt-4"
            style={{
              fontSize: 9,
              letterSpacing: "0.4em",
              color: "var(--gold-dim)",
            }}
          >
            To the next iteration
          </span>
        </div>

        {[
          { top: 32, left: 32, borderTop: true, borderLeft: true },
          { top: 32, right: 32, borderTop: true, borderRight: true },
          { bottom: 32, left: 32, borderBottom: true, borderLeft: true },
          { bottom: 32, right: 32, borderBottom: true, borderRight: true },
        ].map((c, i) => (
          <div
            key={i}
            className="absolute pointer-events-none z-20"
            style={{
              ...(c.top !== undefined ? { top: c.top } : {}),
              ...(c.bottom !== undefined ? { bottom: c.bottom } : {}),
              ...(c.left !== undefined ? { left: c.left } : {}),
              ...(c.right !== undefined ? { right: c.right } : {}),
              width: 24,
              height: 24,
              borderTop: c.borderTop
                ? "1px solid rgba(201,168,76,0.15)"
                : "none",
              borderBottom: c.borderBottom
                ? "1px solid rgba(201,168,76,0.15)"
                : "none",
              borderLeft: c.borderLeft
                ? "1px solid rgba(201,168,76,0.15)"
                : "none",
              borderRight: c.borderRight
                ? "1px solid rgba(201,168,76,0.15)"
                : "none",
            }}
          ></div>
        ))}

        <div
          className="absolute left-8 top-1/2 z-20"
          style={{
            transform: "translateY(-50%) rotate(-90deg)",
            fontSize: 9,
            letterSpacing: "0.3em",
            color: "var(--gold-dim)",
            opacity: 0.4,
            whiteSpace: "nowrap",
          }}
        >
          NEXUS CORP — SEQUENCE 004
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
