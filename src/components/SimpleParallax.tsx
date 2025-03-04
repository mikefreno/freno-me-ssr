"use client";
import React from "react";
import {
  useEffect,
  useState,
  useRef,
  type ReactNode,
  useMemo,
  useCallback,
} from "react";
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

const ParallaxLayer = React.memo(
  ({
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
    const layerDepthFactor = useMemo(
      () => layer / (Object.keys(caveParallax.imageSet).length - 1),
      [layer, caveParallax.imageSet],
    );

    const layerVerticalOffset = useMemo(
      () => verticalOffsetPixels * layerDepthFactor,
      [verticalOffsetPixels, layerDepthFactor],
    );

    const speed = useMemo(() => (120 - layer * 10) * 1000, [layer]);

    const targetX = useMemo(
      () => direction * -caveParallax.size.width * imagesNeeded,
      [direction, caveParallax.size.width, imagesNeeded],
    );

    const springConfig = useMemo(
      () => ({
        from: { x: 0 },
        to: { x: targetX },
        config: { duration: speed, easing: (t: number) => t },
        loop: true,
        reset: true,
      }),
      [targetX, speed],
    );

    const [springProps, api] = useSpring(() => springConfig);

    useEffect(() => {
      api.start({
        from: { x: springProps.x.get() },
        to: { x: targetX },
        config: { duration: speed, easing: (t) => t },
        loop: true,
        reset: true,
      });
    }, [api, speed, targetX]);

    const containerStyle = useMemo(
      () => ({
        width: caveParallax.size.width * imagesNeeded * 3,
        height: caveParallax.size.height,
        left: (dimensions.width - scaledWidth) / 2,
        top: (dimensions.height - scaledHeight) / 2 + layerVerticalOffset,
        transformOrigin: "center center",
        willChange: "transform", // Add will-change for performance hint
      }),
      [
        caveParallax.size.width,
        caveParallax.size.height,
        imagesNeeded,
        dimensions.width,
        dimensions.height,
        scaledWidth,
        scaledHeight,
        layerVerticalOffset,
      ],
    );

    const transformFn = useCallback(
      (x: number) => `translateX(${x}px) scale(${scale})`,
      [scale],
    );

    const imageGroups = useMemo(() => {
      return [-1, 0, 1].map((groupOffset) => (
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
      ));
    }, [
      caveParallax.size.width,
      caveParallax.size.height,
      caveParallax.imageSet,
      imagesNeeded,
      layer,
    ]);

    return (
      <animated.div
        className="absolute"
        style={{
          ...containerStyle,
          transform: springProps.x.to(transformFn),
        }}
      >
        {imageGroups}
      </animated.div>
    );
  },
);
ParallaxLayer.displayName = "ParallaxLayer";

const SimpleParallax = React.memo(({ children }: { children: ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [direction, setDirection] = useState(1); // 1 for right to left, -1 for left to right

  const caveParallax = useMemo<ParallaxBackground>(
    () => ({
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
    }),
    [],
  );

  const layerCount = useMemo(
    () => Object.keys(caveParallax.imageSet).length - 1,
    [caveParallax.imageSet],
  );

  const imagesNeeded = 3;

  // Debounced resize handler to prevent excessive updates
  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 100);
    };

    updateDimensions();
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [updateDimensions]);

  // Direction change interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      setDirection((prev) => prev * -1);
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const { scale, scaledWidth, scaledHeight, verticalOffsetPixels } =
    useMemo(() => {
      if (dimensions.width === 0) {
        return {
          scale: 0,
          scaledWidth: 0,
          scaledHeight: 0,
          verticalOffsetPixels: 0,
        };
      }

      const scaleHeight = dimensions.height / caveParallax.size.height;
      const scaleWidth = dimensions.width / caveParallax.size.width;
      const scale = Math.max(scaleHeight, scaleWidth) * 1.1; // Add 10% extra to avoid any gaps

      return {
        scale,
        scaledWidth: caveParallax.size.width * scale,
        scaledHeight: caveParallax.size.height * scale,
        verticalOffsetPixels: caveParallax.verticalOffset * dimensions.height,
      };
    }, [dimensions, caveParallax]);

  const parallaxLayers = useMemo(() => {
    if (dimensions.width === 0) return null;

    return Array.from({ length: layerCount }).map((_, i) => {
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
    });
  }, [
    dimensions,
    layerCount,
    caveParallax,
    scale,
    scaledWidth,
    scaledHeight,
    verticalOffsetPixels,
    imagesNeeded,
    direction,
  ]);

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
        {parallaxLayers}
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
});
SimpleParallax.displayName = "SimpleParallax";

export default SimpleParallax;
