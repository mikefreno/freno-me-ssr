"use client";
import React, { useEffect, useState, useRef, type ReactNode } from "react";
import Image from "next/image";
import { useSpring, animated } from "@react-spring/web";

type ParallaxBackground = {
  imageSet: { [key: number]: string };
  size: { width: number; height: number };
  verticalOffset: number;
};

type ParallaxLayerProps = {
  layer: number;
  caveParallax: ParallaxBackground;
  dimensions: { width: number; height: number };
  scale: number;
  scaledWidth: number;
  scaledHeight: number;
  verticalOffsetPixels: number;
  imagesNeeded: number;
  direction: number;
};

const ParallaxLayer = ({
  layer,
  caveParallax,
  dimensions,
  scale,
  scaledWidth,
  scaledHeight,
  verticalOffsetPixels,
  imagesNeeded,
  direction,
}: ParallaxLayerProps) => {
  const layerDepthFactor =
    layer / (Object.keys(caveParallax.imageSet).length - 1);
  const layerVerticalOffset = verticalOffsetPixels * layerDepthFactor;

  const speed = (120 - layer * 10) * 1000;

  const [springProps, api] = useSpring(() => ({
    from: { x: 0 },
    to: { x: direction * -caveParallax.size.width * imagesNeeded },
    config: { duration: speed },
    loop: true,
  }));

  useEffect(() => {
    api.start({
      from: { x: springProps.x.get() },
      to: { x: direction * -caveParallax.size.width * imagesNeeded },
      config: { duration: speed },
      loop: true,
    });
  }, [
    direction,
    api,
    speed,
    springProps.x,
    imagesNeeded,
    caveParallax.size.width,
  ]);

  return (
    <animated.div
      className="absolute"
      style={{
        width: caveParallax.size.width * imagesNeeded * 3,
        height: caveParallax.size.height,
        left: (dimensions.width - scaledWidth) / 2,
        top: (dimensions.height - scaledHeight) / 2 + layerVerticalOffset,
        transformOrigin: "center center",
        transform: springProps.x.to(
          (x) => `translateX(${x}px) scale(${scale})`,
        ),
      }}
    >
      {[-1, 0, 1].map((groupOffset) => (
        <div
          key={`group-${groupOffset}`}
          className="absolute"
          style={{
            left: groupOffset * caveParallax.size.width * imagesNeeded,
            width: caveParallax.size.width * imagesNeeded,
            height: caveParallax.size.height,
          }}
        >
          {Array.from({ length: imagesNeeded }).map((_, index) => (
            <div
              key={index}
              className="absolute"
              style={{
                width: caveParallax.size.width,
                height: caveParallax.size.height,
                left: index * caveParallax.size.width,
              }}
            >
              <Image
                src={caveParallax.imageSet[layer]}
                alt={`Parallax layer ${layer}`}
                width={caveParallax.size.width}
                height={caveParallax.size.height}
                style={{ objectFit: "cover" }}
                priority={layer > Object.keys(caveParallax.imageSet).length - 3}
              />
            </div>
          ))}
        </div>
      ))}
    </animated.div>
  );
};

const SimpleParallax = ({ children }: { children: ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [direction, setDirection] = useState(1); // 1 for right to left, -1 for left to right

  const caveParallax: ParallaxBackground = {
    imageSet: {
      0: "/Cave/0.png",
      1: "/Cave/1.png",
      2: "/Cave/2.png",
      3: "/Cave/3.png",
      4: "/Cave/4.png",
      5: "/Cave/5.png",
      6: "/Cave/6.png",
      7: "/Cave/7.png",
    },
    size: { width: 384, height: 216 },
    verticalOffset: 0.4,
  };

  const layerCount = Object.keys(caveParallax.imageSet).length - 1;
  const imagesNeeded = 3;

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Toggle direction every 20 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDirection((prev) => prev * -1);
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Calculate scale to fill screen completely
  const scaleHeight = dimensions.height / caveParallax.size.height;
  const scaleWidth = dimensions.width / caveParallax.size.width;
  const scale = Math.max(scaleHeight, scaleWidth) * 1.1; // Add 10% extra to avoid any gaps

  const scaledWidth = caveParallax.size.width * scale;
  const scaledHeight = caveParallax.size.height * scale;

  const verticalOffsetPixels = caveParallax.verticalOffset * dimensions.height;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen overflow-hidden"
    >
      <div className="absolute inset-0 bg-black"></div>
      <div
        className="absolute inset-0"
        style={{
          marginTop: verticalOffsetPixels,
        }}
      >
        {dimensions.width > 0 &&
          Array.from({ length: layerCount }).map((_, i) => {
            const layerIndex = layerCount - i;
            return (
              <ParallaxLayer
                key={layerIndex}
                layer={layerIndex}
                caveParallax={caveParallax}
                dimensions={dimensions}
                scale={scale}
                scaledWidth={scaledWidth}
                scaledHeight={scaledHeight}
                verticalOffsetPixels={verticalOffsetPixels}
                imagesNeeded={imagesNeeded}
                direction={direction}
              />
            );
          })}
      </div>
      <div className="relative z-10 h-full w-full">{children}</div>
      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default SimpleParallax;
