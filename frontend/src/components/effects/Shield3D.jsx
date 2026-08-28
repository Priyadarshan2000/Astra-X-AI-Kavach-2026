import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef } from 'react'

function ShieldMesh() {
  const group = useRef()
  const ring = useRef()
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.32
    if (ring.current) ring.current.rotation.z -= delta * 0.18
  })

  return (
    <Float speed={1.6} rotationIntensity={0.22} floatIntensity={0.55}>
      <group ref={group}>
        <mesh>
          <icosahedronGeometry args={[1.18, 1]} />
          <MeshDistortMaterial
            color="#00e5ff"
            emissive="#00384a"
            roughness={0.14}
            metalness={0.78}
            distort={0.32}
            speed={1.8}
            transparent
            opacity={0.5}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[1.18, 1]} />
          <meshBasicMaterial color="#00e5ff" wireframe transparent opacity={0.28} />
        </mesh>
        <mesh>
          <torusGeometry args={[1.48, 0.022, 16, 90]} />
          <meshStandardMaterial color="#7c4dff" emissive="#7c4dff" emissiveIntensity={1.6} />
        </mesh>
        <mesh ref={ring} rotation={[Math.PI / 2.2, 0.2, 0]}>
          <torusGeometry args={[1.78, 0.016, 12, 90]} />
          <meshStandardMaterial color="#00bfff" emissive="#00bfff" emissiveIntensity={1.1} />
        </mesh>
        <Sparkles count={28} scale={3.4} size={2.2} speed={0.4} color="#00e5ff" />
      </group>
    </Float>
  )
}

export default function Shield3D({ className = '' }) {
  return (
    <div className={className}>
      <Canvas gl={{ alpha: true, antialias: true }} camera={{ position: [0, 0, 4.2], fov: 42 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.35} />
        <pointLight position={[3, 2, 4]} intensity={22} color="#00e5ff" />
        <pointLight position={[-3, -1, 2]} intensity={12} color="#7c4dff" />
        <Suspense fallback={null}>
          <ShieldMesh />
        </Suspense>
      </Canvas>
    </div>
  )
}
