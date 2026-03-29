"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const nexusLetters = ["N", "E", "X", "U", "S"];
const letterOrigins = [
  { x: "-40vw", y: "-40vh" },
  { x: "40vw", y: "-40vh" },
  { x: "0vw", y: "50vh" },
  { x: "-40vw", y: "40vh" },
  { x: "40vw", y: "40vh" },
];

export default function ConvergenceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const evolveRef = useRef<HTMLDivElement>(null);
  const orRef = useRef<HTMLDivElement>(null);
  const remainRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const ekgRef = useRef<HTMLCanvasElement>(null);

  const [counter, setCounter] = useState(0);

  // ── EKG canvas ──
  useEffect(() => {
    const canvas = ekgRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = (canvas.width = window.innerWidth);
    const H = (canvas.height = 60);
    const CY = H / 2;

    let progress = 0;
    let running = false;
    let raf: number;

    const points: number[] = [];
    for (let x = 0; x < W; x++) {
      const t = x / W;
      if (t < 0.3) points.push(CY);
      else if (t < 0.35) points.push(CY - ((t - 0.3) / 0.05) * (H * 0.3));
      else if (t < 0.38)
        points.push(CY - H * 0.3 + ((t - 0.35) / 0.03) * H * 0.7);
      else if (t < 0.42)
        points.push(CY + H * 0.4 - ((t - 0.38) / 0.04) * H * 0.8);
      else if (t < 0.46)
        points.push(CY - H * 0.4 + ((t - 0.42) / 0.04) * H * 0.5);
      else if (t < 0.5)
        points.push(CY + H * 0.1 - ((t - 0.46) / 0.04) * H * 0.1);
      else points.push(CY);
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      if (!running) return;
      const end = Math.floor(progress * W);

      ctx.beginPath();
      ctx.moveTo(0, points[0]);
      for (let x = 1; x <= end && x < W; x++) ctx.lineTo(x, points[x]);
      ctx.strokeStyle = "rgba(201,168,76,0.8)";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "rgba(201,168,76,0.6)";
      ctx.shadowBlur = 8;
      ctx.stroke();

      if (end < W) {
        ctx.beginPath();
        ctx.arc(end, points[end] ?? CY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(232,201,106,1)";
        ctx.shadowBlur = 12;
        ctx.fill();
      }

      progress += 0.008;
      if (progress <= 1) raf = requestAnimationFrame(draw);
    };

    (window as unknown as Record<string, unknown>).__nexusStartEKG = () => {
      running = true;
      progress = 0;
      draw();
    };

    return () => cancelAnimationFrame(raf);
  }, []);

  // ── GSAP timeline ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      letterRefs.current.forEach((el, i) => {
        gsap.set(el, {
          x: letterOrigins[i].x,
          y: letterOrigins[i].y,
          autoAlpha: 0,
          scale: 2,
        });
      });
      gsap.set(
        [
          taglineRef.current,
          evolveRef.current,
          orRef.current,
          remainRef.current,
        ],
        { autoAlpha: 0, y: 30 },
      );
      gsap.set(countdownRef.current, { autoAlpha: 0 });
      gsap.set(dimRef.current, { autoAlpha: 0 });
      gsap.set(ekgRef.current, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=700%",
          scrub: false,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Scene label
      tl.from(".conv-label", {
        autoAlpha: 0,
        y: -10,
        duration: 0.5,
        ease: "power2.out",
      });

      // EKG
      tl.to(ekgRef.current, { autoAlpha: 1, duration: 0.3 }, "+=0.4").call(
        () => {
          const start = (window as unknown as Record<string, unknown>)
            .__nexusStartEKG;
          if (typeof start === "function") (start as () => void)();
        },
      );
      tl.to({}, { duration: 1.4 });
      tl.to(ekgRef.current, { autoAlpha: 0, duration: 0.4 }, "+=0.2");

      // Letters converge from corners
      letterRefs.current.forEach((el, i) => {
        tl.to(
          el,
          {
            x: 0,
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 1.0,
            ease: "expo.out",
          },
          i === 0 ? "converge" : "converge+=0.06",
        );
      });

      tl.to({}, { duration: 0.8 });

      // Tagline
      tl.to(
        taglineRef.current,
        { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out" },
        "-=0.3",
      );

      // Counter
      tl.to(
        countdownRef.current,
        { autoAlpha: 1, duration: 0.6, ease: "power2.out" },
        "+=0.4",
      );
      tl.call(() => {
        let n = 0;
        const iv = setInterval(() => {
          n += Math.floor(Math.random() * 3) + 1;
          setCounter(n);
          if (n >= 9999) clearInterval(iv);
        }, 40);
      });

      tl.to({}, { duration: 2 });

      // Final words
      tl.to(
        evolveRef.current,
        { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out" },
        "+=0.3",
      );
      tl.to(
        orRef.current,
        { autoAlpha: 1, y: 0, duration: 0.8, ease: "expo.out" },
        "+=0.5",
      );
      tl.to(
        remainRef.current,
        { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out" },
        "+=0.5",
      );

      // Dim to black
      tl.to(
        dimRef.current,
        { autoAlpha: 0.6, duration: 2.5, ease: "power2.inOut" },
        "+=1.5",
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
        {/* Dim overlay */}
        <div
          ref={dimRef}
          className="absolute inset-0 pointer-events-none"
          style={{ background: "var(--black)", zIndex: 30, opacity: 0 }}
        />

        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)",
          }}
        />

        {/* EKG canvas — centered vertically */}
        <canvas
          ref={ekgRef}
          className="absolute pointer-events-none"
          style={{
            bottom: "calc(50% - 30px)",
            left: 0,
            width: "100%",
            height: 60,
            zIndex: 5,
          }}
        />

        {/* Scene label — always one line */}
        <div
          className="conv-label absolute top-8 sm:top-10 left-1/2 flex items-center gap-2 z-10"
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
            The Convergence
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

        {/* NEXUS letters converging */}
        <div
          ref={logoRef}
          className="relative z-10 flex items-center"
          style={{ letterSpacing: "clamp(0.05em, 0.15em, 0.15em)" }}
        >
          {nexusLetters.map((letter, i) => (
            <span
              key={i}
              ref={(el) => {
                letterRefs.current[i] = el;
              }}
              className="font-serif gold-gradient"
              style={{
                fontSize: "clamp(56px, 15vw, 180px)",
                fontWeight: 300,
                lineHeight: 1,
                display: "inline-block",
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="font-serif italic relative z-10 text-center px-6"
          style={{
            marginTop: "clamp(12px, 3vw, 28px)",
            fontSize: "clamp(14px, 2.5vw, 28px)",
            fontWeight: 300,
            color: "var(--cream-dim)",
            letterSpacing: "0.05em",
            maxWidth: "min(600px, 90vw)",
          }}
        >
          The upgrade has already{" "}
          <span style={{ color: "var(--gold)" }}>begun.</span>
        </p>

        {/* Counter */}
        <div
          ref={countdownRef}
          className="relative z-10 flex flex-col items-center"
          style={{ marginTop: "clamp(16px, 3vw, 40px)" }}
        >
          <span
            className="font-sans uppercase text-center px-4"
            style={{
              fontSize: "clamp(7px, 1vw, 8px)",
              letterSpacing: "0.3em",
              color: "var(--gold-dim)",
              marginBottom: 6,
            }}
          >
            Seconds remaining as a limited human
          </span>
          <div className="flex items-center gap-2">
            <div
              style={{
                width: "clamp(20px, 4vw, 40px)",
                height: 1,
                background: "rgba(201,168,76,0.2)",
              }}
            />
            <span
              className="font-serif"
              style={{
                fontSize: "clamp(20px, 4vw, 40px)",
                color: "var(--gold)",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "0.1em",
              }}
            >
              {String(counter).padStart(5, "0")}
            </span>
            <div
              style={{
                width: "clamp(20px, 4vw, 40px)",
                height: 1,
                background: "rgba(201,168,76,0.2)",
              }}
            />
          </div>
        </div>

        {/* Final three words */}
        <div
          className="absolute left-1/2 flex flex-col items-center z-10"
          style={{
            bottom: "clamp(60px, 10vh, 100px)",
            transform: "translateX(-50%)",
            gap: "clamp(2px, 0.5vw, 6px)",
          }}
        >
          <div
            ref={evolveRef}
            className="font-serif italic text-center"
            style={{
              fontSize: "clamp(32px, 7vw, 80px)",
              fontWeight: 300,
              color: "var(--gold)",
              letterSpacing: "0.06em",
              lineHeight: 1.1,
            }}
          >
            Evolve.
          </div>
          <div
            ref={orRef}
            className="font-sans uppercase text-center"
            style={{
              fontSize: "clamp(9px, 1.2vw, 14px)",
              color: "var(--cream-dim)",
              letterSpacing: "0.5em",
            }}
          >
            or
          </div>
          <div
            ref={remainRef}
            className="font-serif text-center"
            style={{
              fontSize: "clamp(13px, 2vw, 24px)",
              fontWeight: 300,
              color: "rgba(192,184,154,0.3)",
              letterSpacing: "0.12em",
            }}
          >
            remain.
          </div>
        </div>

        {/* Footer */}
        <div
          className="absolute bottom-4 left-1/2 flex items-center gap-3 z-10"
          style={{ transform: "translateX(-50%)" }}
        >
          <div
            style={{
              width: "clamp(20px, 4vw, 32px)",
              height: 1,
              background: "rgba(201,168,76,0.15)",
            }}
          />
          <span
            className="font-sans uppercase"
            style={{
              fontSize: "clamp(6px, 1vw, 8px)",
              letterSpacing: "0.3em",
              color: "rgba(201,168,76,0.25)",
              whiteSpace: "nowrap",
            }}
          >
            © NEXUS Corp 2047 — Classified
          </span>
          <div
            style={{
              width: "clamp(20px, 4vw, 32px)",
              height: 1,
              background: "rgba(201,168,76,0.15)",
            }}
          />
        </div>

        {/* Corner brackets — sm+ */}
        {[
          { top: 24, left: 24, borderTop: true, borderLeft: true },
          { top: 24, right: 24, borderTop: true, borderRight: true },
          { bottom: 24, left: 24, borderBottom: true, borderLeft: true },
          { bottom: 24, right: 24, borderBottom: true, borderRight: true },
        ].map((corner, i) => (
          <div
            key={i}
            className="absolute pointer-events-none hidden sm:block z-10"
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
          className="hidden lg:block absolute left-6 top-1/2 z-10"
          style={{
            transform: "translateY(-50%) rotate(-90deg)",
            fontSize: 9,
            letterSpacing: "0.3em",
            color: "var(--gold-dim)",
            opacity: 0.4,
            whiteSpace: "nowrap",
          }}
        >
          NEXUS CORP — SEQUENCE 006
        </div>
      </div>
    </section>
  );
}
