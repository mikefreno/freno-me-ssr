import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Planet } from "./ThreeJSMeshes";
import { Physics } from "@react-three/rapier";
import {
  KeyboardControls,
  OrbitControls,
  PointerLockControls,
} from "@react-three/drei";
import { useControls } from "leva";
import { cameraControls, globeControls, playerControls } from "./ThreeDebug";
import { Player } from "./Player";
import { useCallback, useEffect, useState } from "react";

function isPointerLockAvailable() {
  return (
    "pointerLockElement" in document ||
    "mozPointerLockElement" in document ||
    "webkitPointerLockElement" in document
  );
}

export default function HomeRestart() {
  const { fov, positionZ } = useControls(cameraControls);
  const [locked, setLocked] = useState(false);
  const [usingOrbit, setUsingOrbit] = useState(true);
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

    if (process.env.NODE_ENV !== "production" && usingOrbit) {
      return <OrbitControls />;
    }

    return supportsPointerLock ? (
      <PointerLockControls
        makeDefault
        //@ts-ignore
        args={[camera]}
        onLock={() => setLocked(true)}
        onUnlock={() => setLocked(false)}
      />
    ) : (
      <>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </>
    );
  };
  return (
    <>
      {process.env.NODE_ENV !== "production" && (
        <button
          className="fixed z-50 bg-blue-400 text-white rounded px-4 py-1 m-2"
          onClick={() => setUsingOrbit(!usingOrbit)}
        >
          Control Toggle
        </button>
      )}
      <KeyboardControls map={controlsMapping}>
        <Canvas
          style={{
            position: "fixed",
            height: "100%",
            width: "100%",
            overflow: "hidden",
          }}
          camera={{
            fov,
            position: [0, 0, positionZ],
          }}
        >
          <ambientLight intensity={1.0} />
          <Controls />
          <Physics gravity={[0, 0, 0]}>
            <Player
              locked={locked}
              controlType={supportsPointerLock ? "pointerlock" : "joystick"}
              joystickInput={joystickState}
            />
            <Planet />
          </Physics>
          <axesHelper scale={10} />
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
