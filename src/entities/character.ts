import { RapierRigidBody } from "@react-three/rapier";
import { RefObject } from "react";
import { Vector3, Quaternion } from "three";

interface CharacterProps {
  rigidBodyRef: RefObject<RapierRigidBody | null>;
  currentPlanetRigidBodyRef: RefObject<RapierRigidBody | null>;
}

export class Character {
  position = new Vector3();
  facing = new Quaternion();
  isJumping = false;
  rigidBody: RefObject<RapierRigidBody | null>;
  currentPlanetRigidBody: RefObject<RapierRigidBody | null>;

  constructor({ rigidBodyRef, currentPlanetRigidBodyRef }: CharacterProps) {
    this.rigidBody = rigidBodyRef;
    this.currentPlanetRigidBody = currentPlanetRigidBodyRef;
  }

  updatePosition(upVector: Vector3) {
    if (this.rigidBody.current && this.currentPlanetRigidBody.current) {
      this.position.copy(this.rigidBody.current.translation());

      this.facing.setFromUnitVectors(new Vector3(0, 1, 0), upVector);
    }
  }

  updateFacing(upVector: Vector3) {
    if (this.rigidBody.current) {
      // Update facing direction based on rigid body's rotation
      const forward = new Vector3(0, 0, -1).applyQuaternion(this.facing);
      this.facing.setFromUnitVectors(
        new Vector3(0, 1, 0),
        forward.cross(upVector),
      );
    }
  }

  jump(upVector: Vector3) {
    if (
      this.rigidBody.current &&
      this.currentPlanetRigidBody.current &&
      !this.isJumping
    ) {
      const jumpForce = upVector.multiplyScalar(5);
      this.rigidBody.current.applyImpulse(jumpForce, true);
      this.isJumping = false;
    }
  }

  moveLeft() {
    if (this.rigidBody.current) {
      const leftDirection = new Vector3(-1, 0, 0).applyQuaternion(this.facing);
      const force = leftDirection.multiplyScalar(5); // Adjust the multiplier as needed
      this.rigidBody.current.applyImpulse(force, true);
    }
  }

  moveRight() {
    if (this.rigidBody.current) {
      const rightDirection = new Vector3(1, 0, 0).applyQuaternion(this.facing);
      const force = rightDirection.multiplyScalar(5); // Adjust the multiplier as needed
      this.rigidBody.current.applyImpulse(force, true);
    }
  }

  moveForward() {
    if (this.rigidBody.current) {
      const forwardDirection = new Vector3(0, 0, -1).applyQuaternion(
        this.facing,
      );
      const force = forwardDirection.multiplyScalar(5); // Adjust the multiplier as needed
      this.rigidBody.current.applyImpulse(force, true);
    }
  }

  moveBackward() {
    if (this.rigidBody.current) {
      const backwardDirection = new Vector3(0, 0, 1).applyQuaternion(
        this.facing,
      );
      const force = backwardDirection.multiplyScalar(5); // Adjust the multiplier as needed
      this.rigidBody.current.applyImpulse(force, true);
    }
  }

  attachRigidBody(rigidBodyRef: RefObject<RapierRigidBody | null>) {
    this.rigidBody = rigidBodyRef;
  }

  attachPlanetRigidBody(planetRigidBodyRef: RefObject<RapierRigidBody | null>) {
    this.currentPlanetRigidBody = planetRigidBodyRef;
  }
}
