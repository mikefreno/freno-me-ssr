import { Vector3 } from "three";

export enum PlanetTextureType {
  ROCKY,
}

interface PlanetParams {
  id: number;
  position?: Vector3;
  scalar?: number;
  textureType?: PlanetTextureType;
}

export class Planet {
  id: number;
  position: Vector3;
  scalar: number;
  textureType: PlanetTextureType;

  constructor({ id, position, scalar, textureType }: PlanetParams) {
    this.id = id;
    this.position = position ?? new Vector3();
    this.scalar = scalar ?? 1.0;
    this.textureType = textureType ?? PlanetTextureType.ROCKY;
  }

  getTextureSet() {
    switch (this.textureType) {
      case PlanetTextureType.ROCKY:
        return [
          "/textures/rocky_terrain/rocky_terrain_02_ao_1k.jpg",
          "/textures/rocky_terrain/rocky_terrain_02_arm_1k.jpg",
          "/textures/rocky_terrain/rocky_terrain_02_diff_1k.jpg",
          "/textures/rocky_terrain/rocky_terrain_02_disp_1k.png",
          "/textures/rocky_terrain/rocky_terrain_02_nor_gl_1k.jpg",
        ];
      default:
        return [];
    }
  }
}
