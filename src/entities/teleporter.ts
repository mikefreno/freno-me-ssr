import { Vector3, Quaternion } from "three";
import { Planet } from "./planet";

interface TeleporterProps {
  planetA: Planet;
  planetB: Planet;
  positionA: Vector3;
  quaternionA?: Quaternion;
  positionB: Vector3;
  quaternionB?: Quaternion;
  linkColor: Vector3;
}

export class Teleporter {
  planetA: Planet;
  planetB: Planet;

  positionA: Vector3;
  quaternionA: Quaternion;
  positionB: Vector3;
  quaternionB: Quaternion;

  linkColor: Vector3;

  constructor({ planetA, planetB, positionA, quaternionA, positionB, quaternionB, linkColor }: TeleporterProps) {
    this.planetA = planetA;
    this.planetB = planetB;
    this.positionA = positionA;
    this.quaternionA = quaternionA ?? new Quaternion();
    this.positionB = positionB;
    this.quaternionB = quaternionB ?? new Quaternion();
    this.linkColor = linkColor
  }
}
