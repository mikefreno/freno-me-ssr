"use client";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
  useRapier,
} from "@react-three/rapier";
import { Quaternion, Vector3 } from "three";
import { useControls } from "leva";
import { globeControls, playerControls } from "./ThreeDebug";
import { Character } from "@/entities/character";

export function Player({
  locked,
  controlType,
  joystickInput,
}: {
  locked: boolean;
  controlType: "pointerlock" | "joystick";
  joystickInput?: { x: number; y: number };
}) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const [, get] = useKeyboardControls();
  const rapier = useRapier();
  const { camera, scene } = useThree();
  const planetQuaternion = useRef(new Quaternion());
  const [isInContact, setIsInContact] = useState(false);

  const {
    jumpForce,
    rotationSpeed,
    rotationSmoothing,
    groundCheckDistance,
    cameraHeight,
    joystickSensitivity,
  } = useControls(playerControls);

  const { planetRadius, gravityStrength } = useControls(globeControls);

  //useEffect(() => {
  //console.log({
  //"jump force: ": jumpForce,
  //"rotation speed: ": rotationSpeed,
  //"rotation smoothing: ": rotationSmoothing,
  //"gravity: ": gravityStrength,
  //"ground check distance: ": groundCheckDistance,
  //"camera height: ": cameraHeight,
  //"joystick sensitivity: ": joystickSensitivity,
  //});
  //}, [
  //jumpForce,
  //rotationSpeed,
  //rotationSmoothing,
  //gravityStrength,
  //groundCheckDistance,
  //joystickSensitivity,
  //]);

  useFrame((state) => {
    if (!rigidBodyRef.current) return;
    if (
      controlType === "pointerlock" &&
      !locked &&
      process.env.NODE_ENV == "production"
    ) {
      return;
    }

    // player controls logic
    let moveX = 0;
    let moveY = 0;
    let moveZ = 0;

    const { forward, backward, right, left, jump } = get();

    //console.log(
    //`forward: ${forward}, backward: ${backward}, right: ${right}, left: ${left}, jump: ${jump}`,
    //);

    if (controlType === "pointerlock") {
      moveZ = -(Number(forward) - Number(backward));
      moveX = -(Number(right) - Number(left));
    } else if (controlType === "joystick" && joystickInput) {
      moveX = -(joystickInput.x * joystickSensitivity);
      moveZ = joystickInput.y * joystickSensitivity;
    }
    if (!isInContact && jump) {
      moveY = jumpForce;
    }

    rigidBodyRef.current.addForce({ x: moveX, y: moveY, z: moveZ }, true);

    // gravity calculation
    const planetCenter = new Vector3(0, 0, 0);
    const playerCenter = rigidBodyRef.current.translation();
    const gravityDirection = new Vector3().subVectors(
      planetCenter,
      playerCenter,
    );
    const distance = gravityDirection.length();
    const forceVector = gravityDirection
      .normalize()
      .multiplyScalar(gravityStrength / (distance * distance));
    rigidBodyRef.current.addForce(forceVector, true);

    state.camera.lookAt(
      new Vector3(playerCenter.x, playerCenter.y, playerCenter.z),
    );
  });

  return (
    <RigidBody
      lockRotations
      ref={rigidBodyRef}
      colliders={false}
      mass={50}
      type="dynamic"
      position={[0, planetRadius + cameraHeight + 0.5, 0]}
      onCollisionEnter={() => setIsInContact(true)}
      onCollisionExit={() => setIsInContact(false)}
    >
      <CapsuleCollider args={[0.75, 0.5]} />
      <mesh>
        <capsuleGeometry args={[0.5, cameraHeight, 1, 4]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}
