"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, RapierRigidBody } from "@react-three/rapier";
import {
  KeyboardControls,
  OrbitControls,
  PointerLockControls,
} from "@react-three/drei";
import { useControls } from "leva";
import { globeControls, playerControls } from "@/components/ThreeDebug";
import { useCallback, useEffect, useRef, useState } from "react";
import { Planet } from "@/entities/Planet";
import { Euler, Vector3 } from "three";
import { Teleporter } from "@/entities/Teleporter";
import { PlayerRender } from "@/components/PlayerRender";
import { Character } from "@/entities/Character";
import { PlanetRender } from "@/components/PlanetRender";
import { TeleporterRender } from "@/components/TeleporterRender";

function isPointerLockAvailable() {
  return (
    "pointerLockElement" in document ||
    "mozPointerLockElement" in document ||
    "webkitPointerLockElement" in document
  );
}

export default function Home() {
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

  return (
    <>
      <KeyboardControls map={controlsMapping}>
        <Canvas
          style={{
            position: "fixed",
            height: "100%",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <ambientLight intensity={1.0} />
          <Physics gravity={[0, 0, 0]} debug>
            <CanvasAndPhysicsInterior
              supportsPointerLock={supportsPointerLock}
              joystickState={joystickState}
            />
          </Physics>
          <axesHelper scale={10} />
        </Canvas>
      </KeyboardControls>
    </>
  );
}

const CanvasAndPhysicsInterior = ({
  supportsPointerLock,
  joystickState,
}: {
  supportsPointerLock: boolean;
  joystickState: { x: number; y: number };
}) => {
  const { planetRadius } = useControls(globeControls);
  const playerRigidBodyRef = useRef<RapierRigidBody>(null);
  const planet0RigidBodyRef = useRef<RapierRigidBody>(null);
  const planet1RigidBodyRef = useRef<RapierRigidBody>(null);
  const planet2RigidBodyRef = useRef<RapierRigidBody>(null);
  const [planets] = useState([
    new Planet({ id: 0, RigidBodyRef: planet0RigidBodyRef }),
    new Planet({
      id: 1,
      RigidBodyRef: planet1RigidBodyRef,
      scalar: 2,
      position: new Vector3(20, 10, 20),
    }),
    new Planet({
      id: 2,
      RigidBodyRef: planet2RigidBodyRef,
      scalar: 1.5,
      position: new Vector3(-20, 10, 20),
    }),
  ]);
  const [currentPlanet, setCurrentPlanet] = useState(planets[0]);
  const [teleporters] = useState([
    new Teleporter({
      planetA: planets[0],
      planetB: planets[1],
      positionA: new Vector3(
        planets[0].position.x - 2.0,
        planets[0].position.y + planetRadius * planets[0].scalar + 0.75,
        planets[0].position.z + 2.0,
      ),
      rotationA: new Euler(0.3, -0.3, 0.2),
      positionB: new Vector3(
        planets[1].position.x,
        planets[1].position.y + planetRadius * planets[1].scalar + 0.5,
        planets[1].position.z,
      ),
      linkColor: new Vector3(1, 0, 0),
    }),
    new Teleporter({
      planetA: planets[0],
      planetB: planets[2],
      positionA: new Vector3(
        planets[0].position.x + 2.0,
        planets[0].position.y + planetRadius * planets[0].scalar + 0.75,
        planets[0].position.z + 2.0,
      ),
      rotationA: new Euler(0.3, 0.3, -0.2),
      positionB: new Vector3(
        planets[2].position.x,
        planets[2].position.y + planetRadius * planets[2].scalar + 0.5,
        planets[2].position.z,
      ),
      linkColor: new Vector3(0, 1, 0),
    }),
  ]);
  const [teleportLocked, setTeleportLocked] = useState(false);

  const playerMeshGroupRef = useRef(null);
  const { jumpForce, joystickSensitivity, rotationSpeed, movementSpeed } =
    useControls(playerControls);
  const [player] = useState(
    new Character({
      movementSpeed,
      rotationSpeed,
      jumpForce,
      rigidBodyRef: playerRigidBodyRef,
      currentPlanet: currentPlanet,
      meshGroupRef: playerMeshGroupRef,
    }),
  );

  const teleporterHandler = ({
    targetPlanet,
    targetPosition,
  }: {
    targetPlanet: Planet;
    targetPosition: Vector3;
  }) => {
    if (!teleportLocked) {
      setTeleportLocked(true);
      playerRigidBodyRef.current?.setTranslation(targetPosition, true);
    }
  };

  const teleportLeaveHandler = () => {
    setTeleportLocked(false);
  };

  // nearest planet calculation
  useFrame(() => {
    if (!playerRigidBodyRef.current) return;

    const rigidBodyPos = playerRigidBodyRef.current.translation();
    const playerPosition = new Vector3(
      rigidBodyPos.x,
      rigidBodyPos.y,
      rigidBodyPos.z,
    );

    let minDistance = Infinity;
    let nearestPlanet: Planet | null = null;

    planets.forEach((planet) => {
      const distanceToPlayer =
        playerPosition.distanceTo(planet.position) -
        planetRadius * planet.scalar;
      if (distanceToPlayer < minDistance) {
        minDistance = distanceToPlayer;
        nearestPlanet = planet;
        planet.id;
      }
    });

    if (nearestPlanet && currentPlanet !== nearestPlanet) {
      setCurrentPlanet(nearestPlanet as Planet);
      player.setPlanet(nearestPlanet as Planet);
    }
  });

  return (
    <>
      <PlayerRender
        controlType={supportsPointerLock ? "pointerlock" : "joystick"}
        joystickInput={joystickState}
        player={player}
      />
      {planets.map((planet) => (
        <PlanetRender key={planet.id} planet={planet} />
      ))}
      {teleporters.map((teleporter) => (
        <TeleporterRender
          key={`${teleporter.planetA.id}-${teleporter.planetB.id}`}
          teleporter={teleporter}
          collisionLeaveHandler={teleportLeaveHandler}
          collisionAHandler={() =>
            teleporterHandler({
              targetPlanet: teleporter.planetB,
              targetPosition: teleporter.positionB,
            })
          }
          collisionBHandler={() =>
            teleporterHandler({
              targetPlanet: teleporter.planetA,
              targetPosition: teleporter.positionA,
            })
          }
        />
      ))}
    </>
  );
};

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
