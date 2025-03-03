import { RigidBody, CylinderCollider } from "@react-three/rapier";
import { useTexture } from "@react-three/drei";
import { RepeatWrapping, SRGBColorSpace } from "three";
import { useControls } from "leva";
import { globeControls } from "./ThreeDebug";

export const Planet = () => {
  const { planetRadius, segments, displacementScale, displacementBias } =
    useControls(globeControls);

  const [aoMap, armMap, colorMap, displacementMap, normalMap] = useTexture([
    "/textures/rocky_terrain/rocky_terrain_02_ao_1k.jpg",
    "/textures/rocky_terrain/rocky_terrain_02_arm_1k.jpg",
    "/textures/rocky_terrain/rocky_terrain_02_diff_1k.jpg",
    "/textures/rocky_terrain/rocky_terrain_02_disp_1k.png",
    "/textures/rocky_terrain/rocky_terrain_02_nor_gl_1k.jpg",
  ]);

  colorMap.colorSpace = SRGBColorSpace;

  return (
    <RigidBody type="fixed">
      <mesh receiveShadow name="planet" rotation={[1, 1, 0]}>
        <sphereGeometry args={[planetRadius, segments, segments]} />
        <meshStandardMaterial
          aoMap={aoMap}
          roughnessMap={armMap}
          metalnessMap={armMap}
          alphaMap={armMap}
          transparent
          map={colorMap}
          displacementMap={displacementMap}
          normalMap={normalMap}
          displacementScale={displacementScale}
          displacementBias={displacementBias}
        />
      </mesh>
      <CylinderCollider args={[planetRadius, planetRadius]} />
      <ambientLight position={[0, 2, 4]} intensity={10} />
    </RigidBody>
  );
};

//export const Portal = () => {
//return <MeshPortalMaterial></MeshPortalMaterial>;
//};
