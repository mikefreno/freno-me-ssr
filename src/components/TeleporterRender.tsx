import { RigidBody } from "@react-three/rapier";
import { DoubleSide } from "three";
import { Teleporter } from "@/entities/teleporter";

interface TeleporterRenderProps {
  teleporter: Teleporter;
  collisionLeaveHandler: () => void;
  collisionAHandler: () => void;
  collisionBHandler: () => void;
}

export const TeleporterRender = ({
  teleporter,
  collisionLeaveHandler,
  collisionAHandler,
  collisionBHandler,
}: TeleporterRenderProps) => {
  return (
    <>
      <RigidBody
        onCollisionEnter={collisionAHandler}
        onCollisionExit={collisionLeaveHandler}
        position={teleporter.positionA}
        rotation={teleporter.rotationA}
      >
        <mesh>
          <planeGeometry args={[1, 2]} />
          <meshBasicMaterial
            side={DoubleSide}
            color={[
              teleporter.linkColor.x,
              teleporter.linkColor.y,
              teleporter.linkColor.z,
            ]}
          />
          {/* <MeshPortalMaterial resolution={0} blur={0} side={DoubleSide}/> */}
        </mesh>
      </RigidBody>
      <RigidBody
        onCollisionEnter={collisionBHandler}
        onCollisionExit={collisionLeaveHandler}
        position={teleporter.positionB}
        rotation={teleporter.rotationB}
      >
        <mesh>
          <planeGeometry args={[1, 2]} />
          <meshBasicMaterial
            side={DoubleSide}
            color={[
              teleporter.linkColor.x,
              teleporter.linkColor.y,
              teleporter.linkColor.z,
            ]}
          />
          {/* <MeshPortalMaterial resolution={0} blur={0} side={DoubleSide}/> */}
        </mesh>
      </RigidBody>
    </>
  );
};
