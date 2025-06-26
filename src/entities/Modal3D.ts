import { Vector3 } from "three";

interface Modal3DProps {
  id: number;
  text: string;
  fontSize?: number;
  width?: number;
  height?: number;
  position: Vector3;
}

export class Modal3D {
  id: number;
  text: string;
  fontSize: number;
  width: number;
  height: number;
  depth: number;
  position: Vector3;

  constructor({ id, text, fontSize, width, height, position }: Modal3DProps) {
    this.id = id;
    this.text = text;
    this.fontSize = fontSize ?? 14;
    this.width = width ?? 2;
    this.height = height ?? 3;
    this.depth = 0.5;
    this.position = position;
  }
}
