"use client";
import { Player } from "@/components/Player";
import { globeControls, playerControls } from "@/components/ThreeDebug";
import { Planet } from "@/components/ThreeJSMeshes";
import { VirtualJoystick } from "@/components/VirtualJoystick";
import {
  KeyboardControls,
  PointerLockControls,
  OrbitControls,
  Sky,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { useControls } from "leva";
import { Suspense, useState, useEffect, useCallback } from "react";

function isPointerLockAvailable() {
  return (
    "pointerLockElement" in document ||
    "mozPointerLockElement" in document ||
    "webkitPointerLockElement" in document
  );
}

export default function Home() {
  const [locked, setLocked] = useState(false);
  const [supportsPointerLock, setSupportsPointerLock] = useState(true);
  const [joystickState, setJoystickState] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setSupportsPointerLock(isPointerLockAvailable());
  }, []);

  const handleJoystickMove = useCallback((x: number, y: number) => {
    setJoystickState({ x, y });
  }, []);

  const handleJoystickEnd = useCallback(() => {
    setJoystickState({ x: 0, y: 0 });
  }, []);

  const { cameraHeight } = useControls(playerControls);
  const { planetRadius } = useControls(globeControls);

  const Controls = () => {
    const { camera } = useThree();

    return supportsPointerLock ? (
      <PointerLockControls
        makeDefault
        //@ts-ignore
        args={[camera]}
        onLock={() => setLocked(true)}
        onUnlock={() => setLocked(false)}
      />
    ) : (
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    );
  };

  return (
    <>
      {!supportsPointerLock && (
        <VirtualJoystick
          onMove={handleJoystickMove}
          onEnd={handleJoystickEnd}
        />
      )}
      <KeyboardControls map={controlsMapping}>
        <Canvas
          style={{ height: "100dvh", width: "100dvw", overflow: "hidden" }}
          camera={{
            fov: 75,
            near: 0.1,
            far: 1000,
            position: [0, planetRadius + cameraHeight, 0],
            rotation: [0, 0, 0],
            up: [0, 1, 0],
          }}
        >
          <Suspense>
            <Controls />
            <Physics gravity={[0, 0, 0]}>
              <Player
                locked={locked}
                controlType={supportsPointerLock ? "pointerlock" : "joystick"}
                joystickInput={joystickState}
              />
              <Planet />
            </Physics>
            <Sky
              turbidity={0}
              rayleigh={0.15}
              mieCoefficient={0.005}
              mieDirectionalG={0.4}
              sunPosition={[-0.629, 0.743, 0.228]}
              distance={450000}
              inclination={0.1}
            />
            <axesHelper scale={10} />
          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
}

export enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  jump = "jump",
}

const controlsMapping = [
  { name: Controls.forward, keys: ["ArrowUp", "w", "W"] },
  { name: Controls.backward, keys: ["ArrowDown", "s", "S"] },
  { name: Controls.left, keys: ["ArrowLeft", "a", "A"] },
  { name: Controls.right, keys: ["ArrowRight", "d", "D"] },
  { name: Controls.jump, keys: ["Space"] },
];
