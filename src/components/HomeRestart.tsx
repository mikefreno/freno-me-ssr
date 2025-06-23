"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PlanetRender, TeleporterRender } from "./ThreeJSMeshes";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import {
  KeyboardControls,
  OrbitControls,
  Plane,
  PointerLockControls,
} from "@react-three/drei";
import { useControls } from "leva";
import { cameraControls, globeControls, playerControls } from "./ThreeDebug";
import { Player } from "./Player";
import { useCallback, useEffect, useRef, useState } from "react";
import { Planet } from "@/entities/planet";
import { Vector3 } from "three";
import { Teleporter } from "@/entities/teleporter";

interface HomeRestartProps {
  user: {
    email?: string | undefined;
    display_name?: string | undefined;
    image?: string | undefined;
  } | null;
}

function isPointerLockAvailable() {
  return (
    "pointerLockElement" in document ||
    "mozPointerLockElement" in document ||
    "webkitPointerLockElement" in document
  );
}

export default function HomeRestart({ user }: HomeRestartProps) {
  const { cameraHeight } = useControls(playerControls);
  const { planetRadius } = useControls(globeControls);
  const playerRigidBodyRef = useRef<RapierRigidBody>(null);

  const { fov, positionZ } = useControls(cameraControls);
  const [locked, setLocked] = useState(false);
  const [usingOrbit, setUsingOrbit] = useState(true);
  const [supportsPointerLock, setSupportsPointerLock] = useState(true);
  const [joystickState, setJoystickState] = useState({ x: 0, y: 0 });
  const [planets] = useState([
    new Planet({ id: 0 }),
    new Planet({ id: 1, scalar: 2, position: new Vector3(20, 20, 20) }),
  ]);
  const [currentPlanet, setCurrentPlanet] = useState(planets[0]);
  const [teleporters] = useState([
    new Teleporter({
      planetA: planets[0],
      planetB: planets[1],
      positionA: new Vector3(planets[0].position.x + 0.5, planets[0].position.y + (planetRadius * planets[0].scalar) + 0.5, planets[0].position.z),
      positionB: new Vector3(planets[1].position.x, planets[1].position.y + (planetRadius * planets[1].scalar) + 0.5, planets[1].position.z),
      linkColor: new Vector3()
    }),
  ])
  const [teleportLocked, setTeleportLocked] = useState(false);

  useEffect(() => {
    setSupportsPointerLock(isPointerLockAvailable());
  }, []);

  const handleJoystickMove = useCallback((x: number, y: number) => {
    setJoystickState({ x, y });
  }, []);

  const handleJoystickEnd = useCallback(() => {
    setJoystickState({ x: 0, y: 0 });
  }, []);



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

  const teleporterHandler = ({ targetPlanet, targetPosition }: { targetPlanet: Planet, targetPosition: Vector3 }) => {
    if (!teleportLocked) {
      setCurrentPlanet(targetPlanet);
      setTeleportLocked(true);
      playerRigidBodyRef.current?.setTranslation(targetPosition, true);
    }
  }

  const teleportLeaveHandler = () => {
    setTeleportLocked(false)
  }

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
          <Physics gravity={[0, 0, 0]} debug>
            <Player
              locked={locked}
              controlType={supportsPointerLock ? "pointerlock" : "joystick"}
              joystickInput={joystickState}
              currentPlanet={currentPlanet}
              rigidBodyRef={playerRigidBodyRef}
            />
            {planets.map((planet) => (
              <PlanetRender key={planet.id} planet={planet} />
            ))}
            {teleporters.map((teleporter) => (
              <TeleporterRender
                key={teleporter.planetA.id}
                teleporter={teleporter}
                collisionLeaveHandler={teleportLeaveHandler}
                collisionAHandler={() => teleporterHandler({ targetPlanet: teleporter.planetB, targetPosition: teleporter.positionB })}
                collisionBHandler={() => teleporterHandler({ targetPlanet: teleporter.planetA, targetPosition: teleporter.positionA })} />
            ))}
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
