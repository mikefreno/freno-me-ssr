import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { RigidBody, BallCollider } from "@react-three/rapier";
import { Vector3 } from "three";
import { useControls } from "leva";
import { globeControls, cameraControls } from "./ThreeDebug";
import { Character } from "@/entities/Character";

export function PlayerRender({
  player,
}: {
  controlType: "pointerlock" | "joystick";
  joystickInput?: { x: number; y: number };
  player: Character;
}) {
  const [, get] = useKeyboardControls();

  const { camera } = useThree();

  const { cameraDistance, cameraHeight, cameraSmoothing } =
    useControls(cameraControls);

  const { gravityStrength } = useControls(globeControls);

  useFrame((_, delta) => {
    if (!player.rigidBodyRef.current || !player.meshGroupRef.current) return;
    const { forwardVector, upVector, playerPos } = player.update(
      delta,
      gravityStrength,
      get,
    );

    const cameraOffset = new Vector3();

    cameraOffset.copy(forwardVector).negate().multiplyScalar(cameraDistance);
    cameraOffset.addScaledVector(upVector, cameraHeight);

    const targetCameraPos = new Vector3().copy(playerPos).add(cameraOffset);

    camera.position.lerp(targetCameraPos, cameraSmoothing);
    camera.lookAt(playerPos);
    camera.up.copy(upVector);
  });

  return (
    <>
      <RigidBody
        lockRotations
        ref={player.rigidBodyRef}
        colliders={false}
        mass={player.mass}
        type="dynamic"
        position={player.position}
        onCollisionEnter={() => (player.isInContact = true)}
        onCollisionExit={() => (player.isInContact = false)}
      >
        <BallCollider args={[0.75]} />
      </RigidBody>

      <group ref={player.meshGroupRef}>
        <mesh>
          <capsuleGeometry args={[0.5, 1, 1, 4]} />
          <meshStandardMaterial color="red" />
        </mesh>
      </group>
    </>
  );
}
