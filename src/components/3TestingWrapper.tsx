import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ReactNode } from "react";

export default function TestingWrapper({ children }: { children: ReactNode }) {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <ambientLight intensity={1.5} />
      <OrbitControls />
      {children}
    </Canvas>
  );
}
