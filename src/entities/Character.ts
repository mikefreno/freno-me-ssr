import { RapierRigidBody } from "@react-three/rapier";
import { RefObject } from "react";
import { Vector3, Quaternion, Object3DEventMap, Group } from "three";
import { Planet } from "@/entities/Planet";

interface CharacterProps {
  movementSpeed: number;
  rotationSpeed: number;
  jumpForce: number;
  rigidBodyRef: RefObject<RapierRigidBody | null>;
  meshGroupRef: RefObject<Group<Object3DEventMap> | null>;
  currentPlanet: Planet;
}

export class Character {
  movementSpeed: number;
  rotationSpeed: number;
  jumpForce: number;
  isJumping = false;
  facingRotation = 0;
  rigidBodyRef: RefObject<RapierRigidBody | null>;
  currentPlanet: Planet;
  // Responsible for the visual representation, to be righted according to the physics body
  meshGroupRef: RefObject<Group<Object3DEventMap> | null>;
  isInContact: boolean = false;

  constructor({
    movementSpeed,
    rotationSpeed,
    jumpForce,
    rigidBodyRef,
    meshGroupRef,
    currentPlanet,
  }: CharacterProps) {
    this.movementSpeed = movementSpeed;
    this.rotationSpeed = rotationSpeed;
    this.jumpForce = jumpForce;
    this.rigidBodyRef = rigidBodyRef;
    this.meshGroupRef = meshGroupRef;
    this.currentPlanet = currentPlanet;
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
    const playerPos = new Vector3().copy(
      this.rigidBodyRef.current.translation(),
    );

    const upVector = new Vector3()
      .subVectors(playerPos, this.currentPlanet.position)
      .normalize();

    const gravityForce = upVector
      .clone()
      .negate()
      .multiplyScalar(gravityStrength * delta);
    this.rigidBodyRef.current.applyImpulse(gravityForce, true);

    // 3. Handle inputs
    const { forward, backward, right, left, jump } = get();

    // ---- for now, only worrying about keyboard controls ----
    const moveForward = Number(forward) - Number(backward);
    const turnAmount = Number(right) - Number(left);
    //} else if (controlType === "joystick" && joystickInput) {
    //moveForward = -joystickInput.y * joystickSensitivity;
    //turnAmount = joystickInput.x * joystickSensitivity;
    //}

    //const currentRotation = this.rigidBodyRef.current.rotation()
    //this.rigidBodyRef.current.setRotation()
    this.facingRotation -= turnAmount * delta * this.rotationSpeed;

    // 5. Calculate player's local coordinate system using quaternions
    // Create a quaternion that rotates from world up (0,1,0) to the player's up direction
    const alignToSurfaceQuat = new Quaternion();
    alignToSurfaceQuat.setFromUnitVectors(new Vector3(0, 1, 0), upVector);

    // Create a quaternion for the player's rotation around their local up axis
    const playerRotationQuat = new Quaternion();
    playerRotationQuat.setFromAxisAngle(
      new Vector3(0, 1, 0),
      this.facingRotation,
    );

    // Combine the quaternions: first align to surface, then apply player rotation
    const combinedQuat = new Quaternion();
    combinedQuat.multiplyQuaternions(alignToSurfaceQuat, playerRotationQuat);

    // Extract the local coordinate axes from the combined quaternion
    const forwardVector = new Vector3(0, 0, 1).applyQuaternion(combinedQuat);

    // Project forward vector onto tangent plane (orthogonal to upVector)
    const moveVector = forwardVector.clone().projectOnPlane(upVector);
    moveVector
      .normalize()
      .multiplyScalar(moveForward * this.movementSpeed * delta);

    // Get current velocity
    const velocity = this.rigidBodyRef.current.linvel();
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
    if (this.isInContact && jump) {
      upComponent.addScaledVector(upVector, this.jumpForce);
    }

    // Combine for final velocity
    const newVelocity = new Vector3().add(newTangentVel).add(upComponent);

    // Apply the velocity
    this.rigidBodyRef.current.setLinvel(newVelocity, true);

    // 7. Update group orientation using the combined quaternion
    this.meshGroupRef.current.quaternion.copy(combinedQuat);

    // 8. Position the group at the rigid body's position
    this.meshGroupRef.current.position.copy(playerPos);

    return {
      forwardVector,
      upVector,
      playerPos,
    };
  }

  attachRigidBody(rigidBodyRef: RefObject<RapierRigidBody | null>) {
    this.rigidBodyRef = rigidBodyRef;
  }

  setPlanet(currentPlanet: Planet) {
    this.currentPlanet = currentPlanet;
  }
}
