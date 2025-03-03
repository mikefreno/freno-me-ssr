import { useEffect, useRef } from "react";
import nipplejs, { JoystickManager, EventData } from "nipplejs";

interface VirtualJoystickProps {
  onMove: (x: number, y: number) => void;
  onEnd: () => void;
}

export function VirtualJoystick({ onMove, onEnd }: VirtualJoystickProps) {
  const joystickRef = useRef<JoystickManager | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    joystickRef.current = nipplejs.create({
      zone: containerRef.current,
      mode: "static",
      position: { left: "120px", bottom: "120px" },
      color: "white",
      size: 120,
    });

    //@ts-ignore
    joystickRef.current.on("move", (_, data: EventData) => {
      //@ts-ignore
      const forward = -(data.vector.y || 0);
      //@ts-ignore
      const right = data.vector.x || 0;
      onMove(right, forward);
    });

    joystickRef.current.on("end", () => {
      onEnd();
    });

    return () => {
      joystickRef.current?.destroy();
    };
  }, [onMove, onEnd]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        width: "240px",
        height: "240px",
        zIndex: 1000,
        touchAction: "none",
      }}
    />
  );
}
