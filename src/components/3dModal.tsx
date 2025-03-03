import { Base, Subtraction, Geometry, Addition } from "@react-three/csg";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { extend, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

extend({ RoundedBoxGeometry });

const TEST_BASE = {
  height: 2,
  width: 6,
  depth: 0.5,
};
const TEST_EXTRUSION = {
  height: TEST_BASE.height * 0.9,
  width: TEST_BASE.width * 0.9,
  depth: TEST_BASE.depth,
};

export default function Modal3d({ text = "Default Text" }) {
  return (
    <group>
      <mesh>
        <meshStandardMaterial />
        <Geometry>
          <Base>
            {/*@ts-ignore*/}
            <roundedBoxGeometry
              args={[TEST_BASE.height, TEST_BASE.width, TEST_BASE.depth]}
            />
          </Base>
          <Subtraction>
            <boxGeometry
              args={[
                TEST_EXTRUSION.height,
                TEST_EXTRUSION.width,
                TEST_EXTRUSION.depth,
              ]}
            />
          </Subtraction>
        </Geometry>
      </mesh>
      <mesh>
        <boxGeometry
          args={[
            TEST_EXTRUSION.height,
            TEST_EXTRUSION.width,
            TEST_EXTRUSION.depth / 2,
          ]}
        />
        <meshStandardMaterial color="red" />
      </mesh>
      <Html
        position={[0, 0, TEST_EXTRUSION.depth / 2 + 0.01]}
        transform
        sprite
        as="div"
        occlude
        style={{
          width: `${300}px`,
          height: `${400}px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          background: "transparent",
          overflow: "auto",
          padding: "10px",
          fontSize: "14px",
          textAlign: "center",
        }}
      >
        {text}
      </Html>
    </group>
  );
}
