import { Base, Subtraction, Geometry } from "@react-three/csg";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { extend } from "@react-three/fiber";
import { Modal3D } from "@/entities/Modal3d";

extend({ RoundedBoxGeometry });

export default function Modal3DRender({ modal }: { modal: Modal3D }) {
  const extrusion = {
    height: modal.height * 0.9,
    width: modal.width * 0.9,
    depth: modal.depth,
  };
  return (
    <group position={modal.position}>
      <mesh>
        <meshStandardMaterial />
        <Geometry>
          <Base>
            {/*@ts-ignore*/}
            <roundedBoxGeometry
              args={[modal.width, modal.height, modal.depth]}
            />
          </Base>
          <Subtraction>
            <boxGeometry
              args={[extrusion.width, extrusion.height, extrusion.depth]}
            />
          </Subtraction>
        </Geometry>
      </mesh>
      <mesh>
        <boxGeometry
          args={[extrusion.width, extrusion.height, extrusion.depth / 2]}
        />
        <meshStandardMaterial color="red" />
      </mesh>
    </group>
  );
}
