import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function F1Model() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 0.4, 1]} />
        <meshStandardMaterial color="#e10600" metalness={0.6} roughness={0.3} />
      </mesh>

            <mesh position={[1.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.3, 1.2, 8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.2} />
      </mesh>

      <mesh position={[2.2, -0.3, 0]}>
        <boxGeometry args={[0.6, 0.05, 1.4]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.4} />
      </mesh>

      <mesh position={[-1.6, 0.5, 0]}>
        <boxGeometry args={[0.5, 0.05, 1.6]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[-1.6, 0.25, 0]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.3} />
      </mesh>

      <mesh position={[0.3, 0.35, 0]}>
        <sphereGeometry args={[0.4, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.1} />
      </mesh>

      <mesh position={[1.4, -0.3, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>
      <mesh position={[1.4, -0.3, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>

      <mesh position={[-1.2, -0.3, 0.75]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.35, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>
      <mesh position={[-1.2, -0.3, -0.75]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.35, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>

      <mesh position={[0, 0.21, 0]}>
        <boxGeometry args={[2.8, 0.02, 0.15]} />
        <meshStandardMaterial color="#ffd700" metalness={0.3} roughness={0.4} />
      </mesh>
    </group>
  );
}
