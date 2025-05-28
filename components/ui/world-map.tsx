"use client";

import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import DottedMap from "dotted-map";
import { TextureLoader } from "three";

import { useTheme } from "next-themes";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

export default function WorldMap({
  dots = [],
  lineColor = "#0ea5e9",
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const map = new DottedMap({ height: 100, grid: "diagonal" });

  const { theme } = useTheme();

  const svgMap = map.getSVG({
    radius: 0.22,
    color: theme === "dark" ? "#FFFFFF40" : "#00000040",
    shape: "circle",
    backgroundColor: theme === "dark" ? "black" : "white",
  });

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  useEffect(() => {
    if (!svgRef.current) return;

    // Load the dotted texture
    const loader = new TextureLoader();
    loader.load("/img/dotted-globe.png", (texture) => {
      const svg = svgRef.current!;
      const g = svg.querySelector('g[class="world-map"]')!;
      const rect = g.querySelector("rect")!;
      const patternTransform = rect.getAttribute("transform")!;

      const pattern = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "pattern"
      );
      pattern.setAttribute("id", "dotted-pattern");
      pattern.setAttribute("patternUnits", "userSpaceOnUse");
      pattern.setAttribute("width", "10");
      pattern.setAttribute("height", "10");
      pattern.setAttribute("patternTransform", patternTransform);

      const rectPattern = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      rectPattern.setAttribute("x", "0");
      rectPattern.setAttribute("y", "0");
      rectPattern.setAttribute("width", "10");
      rectPattern.setAttribute("height", "10");
      rectPattern.setAttribute("fill", "url(#dotted-pattern)");

      pattern.appendChild(rectPattern);
      svg.appendChild(pattern);

      const linearGradient = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "linearGradient"
      );
      linearGradient.setAttribute("id", "dotted-gradient");
      linearGradient.setAttribute("x1", "0%");
      linearGradient.setAttribute("y1", "0%");
      linearGradient.setAttribute("x2", "100%");
      linearGradient.setAttribute("y2", "0%");

      const stop1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop"
      );
      stop1.setAttribute("offset", "0%");
      stop1.setAttribute("stop-color", "white");
      stop1.setAttribute("stop-opacity", "0");

      const stop2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop"
      );
      stop2.setAttribute("offset", "5%");
      stop2.setAttribute("stop-color", lineColor);
      stop2.setAttribute("stop-opacity", "1");

      const stop3 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop"
      );
      stop3.setAttribute("offset", "95%");
      stop3.setAttribute("stop-color", lineColor);
      stop3.setAttribute("stop-opacity", "1");

      const stop4 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "stop"
      );
      stop4.setAttribute("offset", "100%");
      stop4.setAttribute("stop-color", "white");
      stop4.setAttribute("stop-opacity", "0");

      linearGradient.appendChild(stop1);
      linearGradient.appendChild(stop2);
      linearGradient.appendChild(stop3);
      linearGradient.appendChild(stop4);

      svg.appendChild(linearGradient);

      const path = g.querySelector("path")!;
      path.setAttribute("fill", "url(#dotted-gradient)");
    });
  }, [lineColor]);

  return (
    <div className="w-full aspect-[2/1] dark:bg-black bg-white rounded-lg  relative font-sans">
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox="0 0 800 400"
        className="w-full h-full absolute inset-0 pointer-events-none select-none"
      >
        {dots.map((dot, i) => {
          const startPoint = projectPoint(dot.start.lat, dot.start.lng);
          const endPoint = projectPoint(dot.end.lat, dot.end.lng);
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint)}
                fill="none"
                stroke="url(#path-gradient)"
                strokeWidth="1"
                initial={{
                  pathLength: 0,
                }}
                animate={{
                  pathLength: 1,
                }}
                transition={{
                  duration: 1,
                  delay: 0.5 * i,
                  ease: "easeOut",
                }}
                key={`start-upper-${i}`}
              ></motion.path>
            </g>
          );
        })}

        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => (
          <g key={`points-group-${i}`}>
            <g key={`start-${i}`}>
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="2"
                fill={lineColor}
              />
              <circle
                cx={projectPoint(dot.start.lat, dot.start.lng).x}
                cy={projectPoint(dot.start.lat, dot.start.lng).y}
                r="2"
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="2"
                  to="8"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
            <g key={`end-${i}`}>
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="2"
                fill={lineColor}
              />
              <circle
                cx={projectPoint(dot.end.lat, dot.end.lng).x}
                cy={projectPoint(dot.end.lat, dot.end.lng).y}
                r="2"
                fill={lineColor}
                opacity="0.5"
              >
                <animate
                  attributeName="r"
                  from="2"
                  to="8"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  begin="0s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
