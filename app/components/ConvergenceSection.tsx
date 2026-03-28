"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const nexusLetters = ["N", "E", "X", "U", "S"];

const letterOrigins = [
  { x: "-40vw", y: "-40vh" }, // N — top left
  { x: "40vw", y: "-40vh" }, // E — top right
  { x: "0vw", y: "50vh" }, // X — bottom center
  { x: "-40vw", y: "40vh" }, // U — bottom left
  { x: "40vw", y: "40vh" }, // S — bottom right
];

const ConvergenceSection = () => {
  const [counter, setCounter] = useState(0);

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

  // EKG canvas
  useEffect(() => {
    const canvas = ekgRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = 80;

    let progress = 0;
    let running = false;
    let raf: number;

    const points: number[] = [];
    const W = canvas.width;
    const H = canvas.height;
    const CY = H / 2;

    // Build EKG path values
    for (let x = 0; x < W; x++) {
      const t = x / W;
      if (t < 0.3)
        points.push(CY); // flatline
      else if (t < 0.35)
        points.push(CY - ((t - 0.3) / 0.05) * (H * 0.35)); // small dip up
      else if (t < 0.38)
        points.push(CY - H * 0.35 + ((t - 0.35) / 0.03) * H * 0.8); // spike down
      else if (t < 0.42)
        points.push(CY + H * 0.45 - ((t - 0.38) / 0.04) * H * 0.9); // spike up big
      else if (t < 0.46)
        points.push(CY - H * 0.45 + ((t - 0.42) / 0.04) * H * 0.6); // return
      else if (t < 0.5)
        points.push(CY + H * 0.15 - ((t - 0.46) / 0.04) * H * 0.15); // small bump
      else points.push(CY); // flatline again
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      if (!running) return;

      const end = Math.floor(progress * W);

      ctx.beginPath();
      ctx.moveTo(0, points[0]);
      for (let x = 1; x <= end && x < W; x++) {
        ctx.lineTo(x, points[x]);
      }

      ctx.strokeStyle = `rgba(201,168,76,0.8)`;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "rgba(201,168,76,0.6)";
      ctx.shadowBlur = 8;
      ctx.stroke();

      // Leading dot
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

    // Expose start fn
    (window as unknown as Record<string, unknown>).__nexusStartEKG = () => {
      running = true;
      progress = 0;
      draw();
    };

    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  // Main GSAP timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial stats
      gsap.set(
        letterRefs.current.map(() => letterRefs.current),
        {
          autoAlpha: 0,
        },
      );

      letterRefs.current.forEach((el, i) => {
        gsap.set(el, {
          x: letterOrigins[i].x,
          y: letterOrigins[i].y,
          autoAlpha: 0,
          scale: 2,
        });
      });

      gsap.set(taglineRef.current, { autoAlpha: 0, y: 20 });
      gsap.set(countdownRef.current, { autoAlpha: 0 });
      gsap.set(evolveRef.current, { autoAlpha: 0, y: 30 });
      gsap.set(orRef.current, { autoAlpha: 0, y: 30 });
      gsap.set(remainRef.current, { autoAlpha: 0, y: 30 });
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

      // EKG line draws
      tl.to(ekgRef.current, { autoAlpha: 1, duration: 0.3 }, "+=0.4").call(
        () => {
          const start = (window as unknown as Record<string, unknown>)
            .__nexusStartEKG;
          if (typeof start === "function") (start as () => void)();
        },
      );

      tl.to({}, { duration: 1.4 });

      // Letters converge from corners
      tl.to(ekgRef.current, { autoAlpha: 0, duration: 0.4 }, "+=0.2");

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

      // Gold shimmer on letters after converge
      tl.to({}, { duration: 0.8 });

      // Tagline
      tl.to(
        taglineRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
        },
        "-=0.3",
      );

      // Countdown appears
      tl.to(
        countdownRef.current,
        {
          autoAlpha: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        "+=0.4",
      );

      // Start counter
      tl.call(() => {
        let n = 0;
        const iv = setInterval(() => {
          n += Math.floor(Math.random() * 3) + 1;
          setCounter(n);
          if (n >= 9999) clearInterval(iv);
        }, 40);
      });

      tl.to({}, { duration: 2 });

      // Fianl three words stagger in
      tl.to(
        evolveRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
        },
        "+=0.3",
      );

      tl.to(
        orRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
        },
        "+=0.5",
      );

      tl.to(
        remainRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
        },
        "+=0.5",
      );

      // Dim overlay fades in - like end credits
      tl.to(
        dimRef.current,
        {
          autoAlpha: 0.6,
          duration: 2.5,
          ease: "power2.inOut",
        },
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
        style={{
          background: "var(--black)",
        }}
      >
        {/* ── Dim overlay (end credits) ── */}
        <div
          ref={dimRef}
          className="absolute inset-0 pointer-events-none opacity-0 z-30"
          style={{
            background: "var(--black)",
          }}
        />

        {/* ── Ambient glow ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%)",
          }}
        />

        {/* ── EKG canvas ── */}
        <canvas
          ref={ekgRef}
          className="absolute pointer-events-none"
          style={{
            bottom: "calc(50% - 40px)",
            left: 0,
            width: "100%",
            height: 50,
            zIndex: 5,
          }}
        />

        {/* ── Scene label ── */}
        <div
          className="conv-label absolute top-10 left-1/2 flex items-center gap-3 z-10"
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
            The Convergence
          </span>
          <div className="gold-line" />
        </div>

        {/* ── NEXUS logo — letters converge ── */}
        <div
          ref={logoRef}
          className="relative z-10 flex items-center"
          style={{
            letterSpacing: "0.15em",
          }}
        >
          {nexusLetters.map((l, i) => (
            <span
              key={i}
              ref={(el) => {
                letterRefs.current[i] = el;
              }}
              className="font-serif gold-gradient inline-block"
              style={{
                fontSize: "clamp(64px, 13vw, 160px)",
                fontWeight: 300,
                lineHeight: 1,
              }}
            >
              {l}
            </span>
          ))}
        </div>

        {/* ── Tagline ── */}
        <p
          ref={taglineRef}
          className="font-serif italic relative z-10 mt-6 text-center"
          style={{
            fontSize: "clamp(16px, 2vw, 26px)",
            fontWeight: 300,
            color: "var(--cream-dim)",
            letterSpacing: "0.06em",
            maxWidth: 600,
          }}
        >
          The upgrade has already{" "}
          <span
            style={{
              color: "var(--gold)",
            }}
          >
            begun.
          </span>
        </p>

        {/* ── Counter ── */}
        <div
          ref={countdownRef}
          className="relative z-10 flex flex-col items-center mt-10"
          style={{
            fontSize: 8,
            letterSpacing: "0.4em",
            color: "var(--gold-dim)",
            marginBottom: 6,
          }}
        >
          <span>Seconds remaining as a limited human</span>
          <div className="flex items-center gap-2">
            <div
              style={{
                width: 40,
                height: 1,
                background: "rgba(201,168,76,0.2)",
              }}
            />
            <span
              className="font-serif"
              style={{
                fontSize: "clamp(20px, 3vw, 36px)",
                color: "var(--gold)",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "0.1em",
              }}
            >
              {String(counter).padStart(5, "0")}
            </span>
            <div
              style={{
                width: 40,
                height: 1,
                background: "rgba(201,168,76,0.2)",
              }}
            />
          </div>
        </div>

        {/* ── Final three words ── */}
        <div
          className="absolute bottom-20 left-1/2 flex flex-col items-center gap-1 z-10"
          style={{
            transform: "translateX(-50%)",
          }}
        >
          <div
            ref={evolveRef}
            className="font-serif italic text-center"
            style={{
              fontSize: "clamp(32px, 5vw, 68px)",
              fontWeight: 300,
              color: "var(--gold)",
              letterSpacing: "0.08em",
              lineHeight: 1.1,
            }}
          >
            Evolve.
          </div>
          <div
            ref={orRef}
            className="font-sans uppercase text-center"
            style={{
              fontSize: "clamp(10px, 1.2vw, 14px)",
              fontWeight: 300,
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
              fontSize: "clamp(14px, 1.8vw, 22px)",
              fontWeight: 300,
              color: "rgba(192,184,154,0.3)",
              letterSpacing: "0.12em",
            }}
          >
            remain
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          className="absolute bottom-6 left-1/2 flex flex-col items-center gap-2 z-10"
          style={{
            transform: "translateX(-50%)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              style={{
                width: 32,
                height: 1,
                background: "rgba(201,168,76,0.15)",
              }}
            />
            <span
              className="font-sans uppercase"
              style={{
                fontSize: 8,
                letterSpacing: "0.35em",
                color: "rgba(201,168,76,0.25)",
              }}
            >
              © NEXUS Corp 2047 — Classified
            </span>
            <div
              style={{
                width: 32,
                height: 1,
                background: "rgba(201,168,76,0.15)",
              }}
            />
          </div>
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
            className="absolute pointer-events-none z-10"
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
          className="absolute left-8 top-1/2 z-10"
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
};

export default ConvergenceSection;
