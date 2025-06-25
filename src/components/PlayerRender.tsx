import { RefObject, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { RapierRigidBody, RigidBody, BallCollider } from "@react-three/rapier";
import { Vector3, Quaternion, Group, Mesh, Object3DEventMap } from "three";
import { useControls } from "leva";
import { playerControls, globeControls, cameraControls } from "./ThreeDebug";
import { Planet } from "@/entities/Planet";
import { Character } from "@/entities/Character";

export function PlayerRender({
  controlType,
  joystickInput,
  player,
  groupRef,
}: {
  controlType: "pointerlock" | "joystick";
  joystickInput?: { x: number; y: number };
  player: Character;
  groupRef: RefObject<Group<Object3DEventMap> | null>;
}) {
  const [, get] = useKeyboardControls();
  const [isInContact, setIsInContact] = useState(false);

  // Store player's facing angle
  const playerFacingAngle = useRef(0);

  // Get camera from three.js
  const { camera } = useThree();

  // Add camera controls to your debug panel
  const { cameraDistance, cameraHeight, cameraSmoothing } =
    useControls(cameraControls);

  const { gravityStrength, planetRadius } = useControls(globeControls);

  useFrame((state, delta) => {
    if (!player.rigidBodyRef.current || !player.meshGroupRef.current) return;
    const { forwardVector, upVector, playerPos } = player.update(
      delta,
      gravityStrength,
      get,
    );

    const cameraOffset = new Vector3();

    // Position camera behind player and slightly above
    cameraOffset.copy(forwardVector).negate().multiplyScalar(cameraDistance);
    cameraOffset.addScaledVector(upVector, cameraHeight);

    const targetCameraPos = new Vector3().copy(playerPos).add(cameraOffset);

    // Smoothly interpolate camera position
    camera.position.lerp(targetCameraPos, cameraSmoothing);

    // Make camera look at player
    camera.lookAt(playerPos);

    // Ensure camera up vector aligns with player's up vector for proper orientation
    camera.up.copy(upVector);
  });

  return (
    <>
      <RigidBody
        lockRotations
        ref={player.rigidBodyRef}
        colliders={false}
        mass={50}
        type="dynamic"
        position={[0, planetRadius + 2, 0]}
        onCollisionEnter={() => (player.isInContact = true)}
        onCollisionExit={() => (player.isInContact = false)}
      >
        <BallCollider args={[0.75]} />
      </RigidBody>

      <group ref={groupRef}>
        <mesh position={[0, 0.25, 0]}>
          <capsuleGeometry args={[0.5, 1, 1, 4]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </group>
    </>
  );
}
