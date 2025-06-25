import { RefObject, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { RapierRigidBody, RigidBody, BallCollider } from "@react-three/rapier";
import { Vector3, Group, Mesh } from "three";
import { Character } from "@/entities/character";

export function PlayerRender({
  locked,
  controlType,
  joystickInput,
  player,
  currentPlanet,
  rigidBodyRef
}: {
  locked: boolean;
  controlType: "pointerlock" | "joystick";
  joystickInput?: { x: number; y: number };
  player: Character;
  currentPlanet: { position: Vector3, rigidBody: RapierRigidBody };
  rigidBodyRef: RefObject<RapierRigidBody | null>
}) {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const [, get] = useKeyboardControls();
  const [isInContact, setIsInContact] = useState(false);

  // Store player's facing angle
  const playerFacingAngle = useRef(0);

  // Get camera from three.js
  const { camera } = useThree();

  useFrame((state, delta) => {
    if (!rigidBodyRef.current || !groupRef.current) return;

    // 1. Get player position and calculate up vector
    const playerPos = new Vector3().copy(
      rigidBodyRef.current.translation() as any,
    );
    const upVector = new Vector3()
      .subVectors(playerPos, currentPlanet.position)
      .normalize();

    // 2. Apply gravity
    const gravityForce = upVector
      .clone()
      .negate()
      .multiplyScalar(10 * delta);
    rigidBodyRef.current.applyImpulse(gravityForce, true);

    // 3. Handle inputs
    const { forward, backward, right, left, jump } = get();

    let moveForward = 0;
    let turnAmount = 0;

    if (forward) {
      moveForward += 1;
    }
    if (backward) {
      moveForward -= 1;
    }
    if (right) {
      turnAmount += 1;
    }
    if (left) {
      turnAmount -= 1;
    }

    // Update character's facing direction
    const rotationSpeed = 5; // Adjust the rotation speed as needed
    playerFacingAngle.current += turnAmount * rotationSpeed * delta;

    // Update character's position and facing direction
    player.attachRigidBody(rigidBodyRef.current);
    player.attachPlanetRigidBody(currentPlanet.rigidBody);
    player.updatePosition();
    player.updateFacing();

    if (forward) {
      player.moveForward();
    }
    if (backward) {
      player.moveBackward();
    }
    if (right) {
      player.moveRight();
    }
    if (left) {
      player.moveLeft();
    }

    // Handle jump
    if (jump && !isInContact) {
      player.isJumping = true;
      player.jump();
    }

    // Update mesh position and rotation
    groupRef.current.position.copy(player.position);
    groupRef.current.quaternion.copy(player.facing);

    // Check for collision with the planet
    const playerVelocity = rigidBodyRef.current.linvel();
    if (playerVelocity.dot(upVector) > 0) {
      setIsInContact(true);
    } else {
      setIsInContact(false);
    }
  });

  return (
    <>
      {/* Physics body - invisible */}
      <RigidBody
        lockRotations
        ref={rigidBodyRef}
        colliders={false}
        mass={50}
        type="dynamic"
        position={[0, currentPlanet.position.y + 1.5, 0]}
        onCollisionEnter={() => setIsInContact(true)}
        onCollisionExit={() => setIsInContact(false)}
      >
        <BallCollider args={[0.75]} />
      </RigidBody>

      {/* Visual representation - follows physics body */}
      <group ref={groupRef}>
        <mesh ref={meshRef} position={[player.position.x, player.position.y + 0.25, player.position.z]}>
          <capsuleGeometry args={[0.5, 1, 1, 4]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </group>
    </>
  );
}
