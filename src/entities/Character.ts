import { RapierRigidBody } from "@react-three/rapier";
import { RefObject } from "react";
import { Vector3, Quaternion, Object3DEventMap, Group } from "three";
import { Planet } from "@/entities/Planet";

type KeyboardControlsState<T extends string = string> = {
  [K in T]: boolean;
};

interface CharacterProps {
  movementSpeed: number;
  rotationSpeed: number;
  jumpForce: number;
  rigidBodyRef: RefObject<RapierRigidBody | null>;
  meshGroupRef: RefObject<Group<Object3DEventMap> | null>;
  startingPlanet: Planet;
}

export class Character {
  movementSpeed: number;
  rotationSpeed: number;
  jumpForce: number;
  isJumping = false;
  facingRotation = 0;
  position: Vector3;
  rigidBodyRef: RefObject<RapierRigidBody | null>;
  currentPlanet: Planet;
  // Responsible for the visual representation, to be righted according to the physics body
  meshGroupRef: RefObject<Group<Object3DEventMap> | null>;
  isInContact: boolean = true;
  mass = 50;

  constructor({
    movementSpeed,
    rotationSpeed,
    jumpForce,
    rigidBodyRef,
    meshGroupRef,
    startingPlanet,
  }: CharacterProps) {
    this.movementSpeed = movementSpeed;
    this.rotationSpeed = rotationSpeed;
    this.jumpForce = jumpForce;
    this.rigidBodyRef = rigidBodyRef;
    this.meshGroupRef = meshGroupRef;
    this.currentPlanet = startingPlanet;
    this.position = new Vector3(
      startingPlanet.position.x,
      startingPlanet.position.y + 1.0,
      startingPlanet.position.z,
    );
  }

  update(
    delta: number,
    gravityStrength: number,
    get: () => KeyboardControlsState<string>,
  ) {
    if (!this.rigidBodyRef.current || !this.meshGroupRef.current)
      return {
        forwardVector: new Vector3(),
        upVector: new Vector3(),
        playerPos: new Vector3(),
      };

    const upVector = new Vector3()
      .subVectors(this.position, this.currentPlanet.position)
      .normalize();

    const gravityForce = upVector
      .clone()
      .negate()
      .multiplyScalar(gravityStrength * delta);
    this.rigidBodyRef.current.applyImpulse(gravityForce, true);

    const { forward, backward, right, left, jump } = get();

    // ---- for now, only worrying about keyboard controls ----
    const moveForward = Number(forward) - Number(backward);
    const turnAmount = Number(right) - Number(left);
    //} else if (controlType === "joystick" && joystickInput) {
    //moveForward = -joystickInput.y * joystickSensitivity;
    //turnAmount = joystickInput.x * joystickSensitivity;
    //}

    this.facingRotation -= turnAmount * delta * this.rotationSpeed;

    const alignToSurfaceQuat = new Quaternion();
    alignToSurfaceQuat.setFromUnitVectors(new Vector3(0, 1, 0), upVector);

    const playerRotationQuat = new Quaternion();
    playerRotationQuat.setFromAxisAngle(
      new Vector3(0, 1, 0),
      this.facingRotation,
    );

    const combinedQuat = new Quaternion();
    combinedQuat.multiplyQuaternions(alignToSurfaceQuat, playerRotationQuat);

    const forwardVector = new Vector3(0, 0, 1).applyQuaternion(combinedQuat);

    const moveVector = forwardVector.clone().projectOnPlane(upVector);
    moveVector
      .normalize()
      .multiplyScalar(moveForward * this.movementSpeed * delta);

    const velocity = this.rigidBodyRef.current.linvel();
    const currentVel = new Vector3(velocity.x, velocity.y, velocity.z);

    const upComponent = upVector
      .clone()
      .multiplyScalar(currentVel.dot(upVector));
    const tangentVelocity = new Vector3().subVectors(currentVel, upComponent);

    const dampingFactor = 0.95;
    const newTangentVel = tangentVelocity
      .multiplyScalar(dampingFactor)
      .add(moveVector);

    if (this.isInContact && jump) {
      upComponent.addScaledVector(upVector, this.jumpForce);
    }

    const newVelocity = new Vector3().add(newTangentVel).add(upComponent);

    this.rigidBodyRef.current.setLinvel(newVelocity, true);
    const simplePosition = this.rigidBodyRef.current.translation();

    this.position = new Vector3(
      simplePosition.x,
      simplePosition.y,
      simplePosition.z,
    );

    this.meshGroupRef.current.quaternion.copy(combinedQuat);

    this.meshGroupRef.current.position.copy(this.position);

    return {
      forwardVector,
      upVector,
      playerPos: this.position,
    };
  }

  attachRigidBody(rigidBodyRef: RefObject<RapierRigidBody | null>) {
    this.rigidBodyRef = rigidBodyRef;
  }

  setPlanet(currentPlanet: Planet) {
    this.currentPlanet = currentPlanet;
  }
}
