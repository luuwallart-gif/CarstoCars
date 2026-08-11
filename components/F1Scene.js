import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import F1Model from './F1Model';

export default function F1Scene() {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas camera={{ position: [4, 2, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} />
        <F1Model />
        <Environment preset="city" />
        <OrbitControls enableZoom={true} enablePan={false} />
      </Canvas>
    </div>
  );
}
