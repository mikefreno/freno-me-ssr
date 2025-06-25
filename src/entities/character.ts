import { RapierRigidBody } from "@react-three/rapier";
import { Ref, RefObject } from "react";
import { Vector3, Quaternion } from "three";

interface CharacterProps{
  rigidBody: RefObject<RapierRigidBody | null>;
  currentPlanetRigidBody: RapierRigidBody
}

export class Character {
  position = new Vector3();
  facing = new Quaternion();
  isJumping = false;
  rigidBody: RefObject<RapierRigidBody | null>;
  currentPlanetRigidBody: RapierRigidBody | undefined;

  constructor({rigidBody, currentPlanetRigidBody}: CharacterProps) {
    this.rigidBody = rigidBody
    this.currentPlanetRigidBody = currentPlanetRigidBody
  }

  updatePosition() {
    if (this.rigidBody.current) {
      this.position.copy(this.rigidBody.current.translation());
      const upVector = new Vector3().subVectors(this.position, this.currentPlanetRigidBody?.translation()).normalize();
      this.facing.setFromUnitVectors(new Vector3(0, 1, 0), upVector);
    }
  }

  updateFacing() {
    if (this.rigidBody.current) {
      // Update facing direction based on rigid body's rotation
      const forward = new Vector3(0, 0, -1).applyQuaternion(this.facing);
      this.facing.setFromUnitVectors(new Vector3(0, 1, 0), forward.cross(upVector));
    }
  }

  jump() {
    if (this.rigidBody && !this.isJumping) {
      const upVector = new Vector3().subVectors(this.position, this.planetRigidBody?.translation()).normalize();
      const jumpForce = new Vector3(0, 10, 0).applyQuaternion(upVector);
      this.rigidBody.applyImpulse(jumpForce, true);
      this.isJumping = false;
    }
  }

  moveLeft() {
    if (this.rigidBody) {
      const leftDirection = new Vector3(-1, 0, 0).applyQuaternion(this.facing);
      const force = leftDirection.multiplyScalar(5); // Adjust the multiplier as needed
      this.rigidBody.applyForce(force, true);
    }
  }

  moveRight() {
    if (this.rigidBody) {
      const rightDirection = new Vector3(1, 0, 0).applyQuaternion(this.facing);
      const force = rightDirection.multiplyScalar(5); // Adjust the multiplier as needed
      this.rigidBody.applyForce(force, true);
    }
  }

  moveForward() {
    if (this.rigidBody) {
      const forwardDirection = new Vector3(0, 0, -1).applyQuaternion(this.facing);
      const force = forwardDirection.multiplyScalar(5); // Adjust the multiplier as needed
      this.rigidBody.applyForce(force, true);
    }
  }

  moveBack() {
    if (this.rigidBody) {
      const backwardDirection = new Vector3(0, 0, 1).applyQuaternion(this.facing);
      const force = backwardDirection.multiplyScalar(5); // Adjust the multiplier as needed
      this.rigidBody.applyForce(force, true);
    }
  }

  attachRigidBody(rigidBody: RapierRigidBody) {
    this.rigidBody = rigidBody;
  }

  attachPlanetRigidBody(planetRigidBody: RapierRigidBody) {
    this.currentPlanetRigidBody = planetRigidBody;
  }
}
