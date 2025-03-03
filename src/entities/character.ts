import { Camera } from "@react-three/fiber";
import { type RapierRigidBody } from "@react-three/rapier";
import { Vector3 } from "three";

export class Character {
  position = new Vector3();
  facing = new Vector3();
  isJumping = false;
  rigidBody: RapierRigidBody | undefined;
  planetRigidBody: RapierRigidBody | undefined;
  camera: Camera | undefined;

  constructor() {}

  moveLeft() {}
  moveRight() {}
  moveForward() {}
  moveBack() {}
  jump() {}

  attachRigidBody(rigidBody: RapierRigidBody) {
    this.rigidBody = rigidBody;
  }
  attachPlanetRigidBody(planetRigidBody: RapierRigidBody) {
    this.planetRigidBody = planetRigidBody;
  }
  attachCamera(camera: Camera) {
    this.camera = camera;
  }
}
