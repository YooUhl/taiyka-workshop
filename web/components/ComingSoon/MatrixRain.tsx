"use client";

import { useEffect, useRef } from "react";

const MATRIX_CHARS =
  "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789@#$%&*+-/<>{}[]";

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const fontSize = 16;
    let width = 0;
    let height = 0;
    let cols = 0;
    let drops: number[] = [];

    function setup() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.font = `${fontSize}px ui-monospace, "JetBrains Mono", monospace`;
      ctx!.textBaseline = "top";
      cols = Math.ceil(width / fontSize);
      drops = new Array(cols).fill(0).map(() => -Math.floor(Math.random() * 80));
      ctx!.fillStyle = "#000000";
      ctx!.fillRect(0, 0, width, height);
    }

    function drawFrame() {
      ctx!.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx!.fillRect(0, 0, width, height);

      for (let i = 0; i < cols; i++) {
        const ch = MATRIX_CHARS.charAt(
          Math.floor(Math.random() * MATRIX_CHARS.length),
        );
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx!.shadowColor = "#00e5ff";
        ctx!.shadowBlur = 8;
        ctx!.fillStyle = "rgba(0, 229, 255, 0.95)";
        ctx!.fillText(ch, x, y);

        ctx!.shadowBlur = 0;
        ctx!.fillStyle = "rgba(0, 166, 255, 0.55)";
        ctx!.fillText(
          MATRIX_CHARS.charAt(Math.floor(Math.random() * MATRIX_CHARS.length)),
          x,
          y - fontSize,
        );

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const reduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    let rafId = 0;
    let lastTick = 0;
    const TARGET_MS = 60;

    function loop(now: number) {
      if (now - lastTick >= TARGET_MS) {
        drawFrame();
        lastTick = now;
      }
      rafId = requestAnimationFrame(loop);
    }

    function onResize() {
      setup();
    }

    setup();
    if (reduced) {
      drawFrame();
    } else {
      rafId = requestAnimationFrame(loop);
      window.addEventListener("resize", onResize);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.42 }}
    />
  );
}
