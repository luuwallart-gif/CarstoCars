export default function F1Model() {
  return (
    <group>
      {/* Corps principal */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.5, 0.4, 1.2]} />
        <meshStandardMaterial color="#e10600" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Cockpit */}
      <mesh position={[0.3, 0.35, 0]}>
        <boxGeometry args={[1, 0.4, 0.8]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Aileron avant */}
      <mesh position={[1.8, -0.1, 0]}>
        <boxGeometry args={[0.5, 0.1, 1.6]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Aileron arrière */}
      <mesh position={[-1.7, 0.4, 0]}>
        <boxGeometry args={[0.3, 0.5, 1.4]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Support aileron arrière */}
      <mesh position={[-1.7, 0.15, 0]}>
        <boxGeometry args={[0.15, 0.3, 0.1]} />
        <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Roue avant gauche */}
      <mesh position={[1.3, -0.2, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>

      {/* Roue avant droite */}
      <mesh position={[1.3, -0.2, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>

      {/* Roue arrière gauche */}
      <mesh position={[-1.3, -0.2, 0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.35, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>

      {/* Roue arrière droite */}
      <mesh position={[-1.3, -0.2, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.35, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>

      {/* Aileron latéral gauche */}
      <mesh position={[0.5, -0.15, 0.65]}>
        <boxGeometry args={[0.8, 0.15, 0.15]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Aileron latéral droit */}
      <mesh position={[0.5, -0.15, -0.65]}>
        <boxGeometry args={[0.8, 0.15, 0.15]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}
