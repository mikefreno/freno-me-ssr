import { folder } from "leva";

export const playerControls = {
  "Player Controls": folder({
    jumpForce: {
      value: 1,
      min: 0,
      max: 2,
      step: 0.01,
    },
    rotationSpeed: {
      value: 2.0,
      min: 0,
      max: 4.0,
      step: 0.1,
    },
    rotationSmoothing: {
      value: 0.15,
      min: 0,
      max: 1,
      step: 0.01,
    },
    groundCheckDistance: {
      value: 1.5,
      min: 0,
      max: 5,
      step: 0.1,
    },
    cameraHeight: {
      value: 2,
      min: 0,
      max: 5,
      step: 0.1,
    },
    joystickSensitivity: {
      value: 1,
      min: 0.1,
      max: 5,
      step: 0.1,
    },
    movementSpeed: {
      value: 10,
      min: 0,
      max: 20,
      step: 0.1,
    },
    positionX: {
      value: 0,
      min: 0,
      max: 20,
      step: 1,
    },
    positionY: {
      value: 0,
      min: 0,
      max: 20,
      step: 1,
    },
    positionZ: {
      value: 0,
      min: 0,
      max: 20,
      step: 1,
    },
  }),
};

export const globeControls = {
  "Globe Controls": folder({
    planetRadius: {
      value: 7,
      min: 1,
      max: 25,
      step: 1,
    },
    gravityStrength: {
      value: 10,
      min: 1,
      max: 20,
      step: 1,
    },
    segments: {
      value: 256,
      min: 12,
      max: 512,
      step: 2,
    },
    displacementScale: {
      value: 0.28,
      min: 0,
      max: 10,
      step: 0.001,
    },
    displacementBias: {
      value: 0.37,
      min: 0,
      max: 10,
      step: 0.001,
    },
  }),
};

export const cameraControls = {
  "Camera Controls": folder({
    positionZ: {
      value: 50,
      min: 1,
      max: 300,
      step: 1,
    },
    fov: {
      value: 50,
      min: 10,
      max: 90,
      step: 1,
    },
  }),
};
