import { RigidBody, BallCollider } from "@react-three/rapier";
import {  useTexture } from "@react-three/drei";
import { DoubleSide, SRGBColorSpace } from "three";
import { useControls } from "leva";
import { globeControls } from "./ThreeDebug";
import { Planet } from "@/entities/planet";
import { Teleporter } from "@/entities/teleporter";

interface PlanetRenderProps {
  planet: Planet;
}

export const PlanetRender = ({ planet }: PlanetRenderProps) => {
  const { planetRadius, segments, displacementScale, displacementBias } =
    useControls(globeControls);

  const [aoMap, armMap, colorMap, displacementMap, normalMap] = useTexture(
    planet.getTextureSet(),
  );

  colorMap.colorSpace = SRGBColorSpace;

  return (
    <RigidBody type="fixed" position={planet.position} colliders={false}>
      <mesh receiveShadow name="planet" rotation={[1, 1, 0]}>
        <sphereGeometry
          args={[planetRadius * planet.scalar, segments, segments]}
        />
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
      <BallCollider args={[planetRadius * planet.scalar]} />
      <ambientLight position={[0, 2, 4]} intensity={10} />
    </RigidBody>
  );
};
interface TeleporterRenderProps {
  teleporter: Teleporter;
  collisionLeaveHandler: ()=>void;
  collisionAHandler: () => void
  collisionBHandler: () => void
}

export const TeleporterRender = ({ teleporter,collisionLeaveHandler, collisionAHandler, collisionBHandler }: TeleporterRenderProps) => {
  return (
    <>
      <RigidBody onCollisionEnter={collisionAHandler} onCollisionExit={collisionLeaveHandler} position={teleporter.positionA} rotation={teleporter.rotationA}>
        <mesh>
          <planeGeometry args={[1, 2]}/>
          <meshBasicMaterial side={DoubleSide} color={[teleporter.linkColor.x, teleporter.linkColor.y, teleporter.linkColor.z]}/>
          {/* <MeshPortalMaterial resolution={0} blur={0} side={DoubleSide}/> */}
        </mesh>
      </RigidBody>
      <RigidBody onCollisionEnter={collisionBHandler} onCollisionExit={collisionLeaveHandler} position={teleporter.positionB} rotation={teleporter.rotationB}>
        <mesh>
          <planeGeometry args={[1, 2]}/>
          <meshBasicMaterial side={DoubleSide} color={[teleporter.linkColor.x, teleporter.linkColor.y, teleporter.linkColor.z]}/>
          {/* <MeshPortalMaterial resolution={0} blur={0} side={DoubleSide}/> */}
        </mesh>
      </RigidBody>
    </>
  )
};
