import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';
import F1Model from './F1Model';

export default function F1Scene() {
  return (
    <div style={{ width: '100%', height: '500px', maxWidth: '900px' }}>
      <Canvas camera={{ position: [4, 2, 4], fov: 50 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, 3, -5]} intensity={0.5} />
          <F1Model />
          <ContactShadows position={[0, -0.5, 0]} opacity={0.5} scale={10} blur={2} />
          <Environment preset="city" />
          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={8}
            autoRotate
            autoRotateSpeed={2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
