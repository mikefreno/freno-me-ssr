"use client";
import React, { useEffect, useState, useRef, type ReactNode } from "react";
import Image from "next/image";

type ParallaxBackground = {
  imageSet: { [key: number]: string };
  size: { width: number; height: number };
  verticalOffset: number;
};

const SimpleParallax = ({ children }: { children: ReactNode }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

  const imagesNeeded = 5;

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

  // Calculate scale to fill screen completely
  const scaleHeight = dimensions.height / caveParallax.size.height;
  const scaleWidth = dimensions.width / caveParallax.size.width;
  const scale = Math.max(scaleHeight, scaleWidth) * 1.1; // Add 10% extra to avoid any gaps

  const scaledWidth = caveParallax.size.width * scale;
  const scaledHeight = caveParallax.size.height * scale;

  const verticalOffsetPixels = caveParallax.verticalOffset * dimensions.height;

  const renderLayers = () => {
    const layers = [];

    for (let i = layerCount; i >= 1; i--) {
      const animationDuration = 120 - i * 10;

      const layerDepthFactor = i / layerCount;
      const layerVerticalOffset = verticalOffsetPixels * layerDepthFactor;

      layers.push(
        <div
          key={i}
          className="absolute"
          style={{
            width: caveParallax.size.width * imagesNeeded * 3,
            height: caveParallax.size.height,
            left: (dimensions.width - scaledWidth) / 2,
            top: (dimensions.height - scaledHeight) / 2 + layerVerticalOffset,
            transformOrigin: "center center",
            transform: `scale(${scale})`,
            animation: `slide-${i} ${animationDuration}s linear infinite`,
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
                    src={caveParallax.imageSet[i]}
                    alt={`Parallax layer ${i}`}
                    width={caveParallax.size.width}
                    height={caveParallax.size.height}
                    style={{ objectFit: "cover" }}
                    priority={i > layerCount - 3}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>,
      );
    }

    return layers;
  };

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
        {dimensions.width > 0 && renderLayers()}
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

        @keyframes slide-1 {
          0% {
            transform: translateX(0) scale(${scale});
          }
          100% {
            transform: translateX(-${caveParallax.size.width * imagesNeeded}px)
              scale(${scale});
          }
        }
        @keyframes slide-2 {
          0% {
            transform: translateX(0) scale(${scale});
          }
          100% {
            transform: translateX(-${caveParallax.size.width * imagesNeeded}px)
              scale(${scale});
          }
        }
        @keyframes slide-3 {
          0% {
            transform: translateX(0) scale(${scale});
          }
          100% {
            transform: translateX(-${caveParallax.size.width * imagesNeeded}px)
              scale(${scale});
          }
        }
        @keyframes slide-4 {
          0% {
            transform: translateX(0) scale(${scale});
          }
          100% {
            transform: translateX(-${caveParallax.size.width * imagesNeeded}px)
              scale(${scale});
          }
        }
        @keyframes slide-5 {
          0% {
            transform: translateX(0) scale(${scale});
          }
          100% {
            transform: translateX(-${caveParallax.size.width * imagesNeeded}px)
              scale(${scale});
          }
        }
        @keyframes slide-6 {
          0% {
            transform: translateX(0) scale(${scale});
          }
          100% {
            transform: translateX(-${caveParallax.size.width * imagesNeeded}px)
              scale(${scale});
          }
        }
        @keyframes slide-7 {
          0% {
            transform: translateX(0) scale(${scale});
          }
          100% {
            transform: translateX(-${caveParallax.size.width * imagesNeeded}px)
              scale(${scale});
          }
        }
      `}</style>
    </div>
  );
};

export default SimpleParallax;
