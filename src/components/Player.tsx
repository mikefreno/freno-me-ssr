import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { RapierRigidBody, RigidBody, BallCollider } from "@react-three/rapier";
import { Vector3, Quaternion, Group, Mesh } from "three";
import { useControls } from "leva";
import { playerControls, globeControls } from "./ThreeDebug";
import { Planet } from "@/entities/planet";

export function Player({
  locked,
  controlType,
  joystickInput,
  currentPlanet,
}: {
  locked: boolean;
  controlType: "pointerlock" | "joystick";
  joystickInput?: { x: number; y: number };
  currentPlanet: Planet;
}) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const [, get] = useKeyboardControls();
  const [isInContact, setIsInContact] = useState(false);

  // Store player's facing angle
  const playerFacingAngle = useRef(0);

  // Get camera from three.js
  const { camera } = useThree();

  // Add camera controls to your debug panel
  const { cameraDistance, cameraHeight, cameraSmoothing } = useControls(
    "Camera Controls",
    {
      cameraDistance: { value: 5, min: 1, max: 20 },
      cameraHeight: { value: 2, min: 0, max: 10 },
      cameraSmoothing: { value: 0.1, min: 0.01, max: 1 },
    },
  );

  const { jumpForce, joystickSensitivity, rotationSpeed, movementSpeed } =
    useControls(playerControls);
  const { gravityStrength, planetRadius } = useControls(globeControls);

  useFrame((state, delta) => {
    if (!rigidBodyRef.current || !groupRef.current) return;

    if (
      controlType === "pointerlock" &&
      !locked &&
      process.env.NODE_ENV === "production"
    ) {
      return;
    }

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
      .multiplyScalar(gravityStrength * delta);
    rigidBodyRef.current.applyImpulse(gravityForce, true);

    // 3. Handle inputs
    const { forward, backward, right, left, jump } = get();

    let moveForward = 0;
    let turnAmount = 0;

    if (controlType === "pointerlock") {
      moveForward = Number(forward) - Number(backward);
      turnAmount = Number(right) - Number(left);
    } else if (controlType === "joystick" && joystickInput) {
      moveForward = -joystickInput.y * joystickSensitivity;
      turnAmount = joystickInput.x * joystickSensitivity;
    }

    playerFacingAngle.current -= turnAmount * delta * rotationSpeed;

    // 5. Calculate player's local coordinate system using quaternions
    // Create a quaternion that rotates from world up (0,1,0) to the player's up direction
    const alignToSurfaceQuat = new Quaternion();
    alignToSurfaceQuat.setFromUnitVectors(new Vector3(0, 1, 0), upVector);

    // Create a quaternion for the player's rotation around their local up axis
    const playerRotationQuat = new Quaternion();
    playerRotationQuat.setFromAxisAngle(
      new Vector3(0, 1, 0),
      playerFacingAngle.current,
    );

    // Combine the quaternions: first align to surface, then apply player rotation
    const combinedQuat = new Quaternion();
    combinedQuat.multiplyQuaternions(alignToSurfaceQuat, playerRotationQuat);

    // Extract the local coordinate axes from the combined quaternion
    const forwardVector = new Vector3(0, 0, 1).applyQuaternion(combinedQuat);

    const moveVector = forwardVector
      .clone()
      .multiplyScalar(moveForward * movementSpeed * delta);

    // Get current velocity
    const velocity = rigidBodyRef.current.linvel();
    const currentVel = new Vector3(velocity.x, velocity.y, velocity.z);

    // Project current velocity onto the planet surface plane
    const upComponent = upVector
      .clone()
      .multiplyScalar(currentVel.dot(upVector));
    const tangentVelocity = new Vector3().subVectors(currentVel, upComponent);

    // Calculate new velocity with damping
    const dampingFactor = 0.95;
    const newTangentVel = tangentVelocity
      .multiplyScalar(dampingFactor)
      .add(moveVector);

    // Apply jump if grounded
    if (isInContact && jump) {
      upComponent.addScaledVector(upVector, jumpForce);
    }

    // Combine for final velocity
    const newVelocity = new Vector3().add(newTangentVel).add(upComponent);

    // Apply the velocity
    rigidBodyRef.current.wakeUp();
    rigidBodyRef.current.setLinvel(newVelocity, true);

    // 7. Update group orientation using the combined quaternion
    groupRef.current.quaternion.copy(combinedQuat);

    // 8. Position the group at the rigid body's position
    groupRef.current.position.copy(playerPos);

    // 9. Update camera position to follow player
    // Calculate desired camera position
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
      {/* Physics body - invisible */}
      <RigidBody
        lockRotations
        ref={rigidBodyRef}
        colliders={false}
        mass={50}
        type="dynamic"
        position={[0, planetRadius + 2, 0]}
        onCollisionEnter={() => setIsInContact(true)}
        onCollisionExit={() => setIsInContact(false)}
      >
        <BallCollider args={[0.75]} />
      </RigidBody>

      {/* Visual representation - follows physics body */}
      <group ref={groupRef}>
        <mesh ref={meshRef} position={[0, 1.0, 0]}>
          <capsuleGeometry args={[0.5, 2, 1, 4]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </group>
    </>
  );
}
