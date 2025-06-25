import { Vector3, Quaternion, Euler } from "three";
import { Planet } from "./planet";

interface TeleporterProps {
  planetA: Planet;
  planetB: Planet;
  positionA: Vector3;
  rotationA?: Euler;
  positionB: Vector3;
  rotationB?: Euler;
  linkColor: Vector3;
}

export class Teleporter {
  planetA: Planet;
  planetB: Planet;

  positionA: Vector3;
  rotationA: Euler;
  positionB: Vector3;
  rotationB: Euler;

  linkColor: Vector3;

  constructor({ planetA, planetB, positionA, rotationA, positionB, rotationB, linkColor }: TeleporterProps) {
    this.planetA = planetA;
    this.planetB = planetB;
    this.positionA = positionA;
    this.rotationA = rotationA ?? new Euler();
    this.positionB = positionB;
    this.rotationB = rotationB ?? new Euler();
    this.linkColor = linkColor
  }
}
