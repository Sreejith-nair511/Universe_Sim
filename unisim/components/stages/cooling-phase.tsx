"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { THREE } from "@/lib/three-instance"

function CoolingPhase({ isPlaying }: { isPlaying: boolean }) {
  const particlesRef = useRef<THREE.Points>(null)
  const atomsRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  // Create particles for the cooling universe
  const particles = useMemo(() => {
    const count = 3000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // More spread out positions
      const radius = 5 + Math.random() * 15
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)

      // Cooler colors (blues, purples, some reds)
      const colorChoice = Math.random()
      if (colorChoice < 0.5) {
        // Blue
        colors[i3] = 0.2 + Math.random() * 0.3
        colors[i3 + 1] = 0.3 + Math.random() * 0.3
        colors[i3 + 2] = 0.7 + Math.random() * 0.3
      } else if (colorChoice < 0.8) {
        // Purple
        colors[i3] = 0.5 + Math.random() * 0.3
        colors[i3 + 1] = 0.2 + Math.random() * 0.2
        colors[i3 + 2] = 0.6 + Math.random() * 0.4
      } else {
        // Red (less frequent)
        colors[i3] = 0.7 + Math.random() * 0.3
        colors[i3 + 1] = 0.2 + Math.random() * 0.2
        colors[i3 + 2] = 0.2 + Math.random() * 0.2
      }

      // Smaller sizes as energy decreases
      sizes[i] = 0.5 + Math.random()
    }

    return { positions, colors, sizes }
  }, [])

  // Create atoms (simplified representation)
  const atoms = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => {
      // Random position within a sphere
      const radius = 8 + Math.random() * 10
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      // Random rotation
      const rotationX = Math.random() * Math.PI * 2
      const rotationY = Math.random() * Math.PI * 2
      const rotationZ = Math.random() * Math.PI * 2

      // Random scale (size of atom)
      const scale = 0.2 + Math.random() * 0.3

      // Random speed
      const speed = 0.2 + Math.random() * 0.3

      return { position: [x, y, z], rotation: [rotationX, rotationY, rotationZ], scale, speed }
    })
  }, [])

  // Animation loop
  useFrame((state, delta) => {
    if (!isPlaying) return

    // Update time reference
    timeRef.current += delta

    // Update particles
    if (particlesRef.current) {
      // Slow rotation of the particle system
      particlesRef.current.rotation.y += delta * 0.05
    }

    // Update atoms
    if (atomsRef.current && atomsRef.current.children) {
      atomsRef.current.children.forEach((atom, i) => {
        if (i >= atoms.length) return

        // Rotate each atom's electron cloud
        if (atom.children && atom.children.length > 0) {
          atom.children[0].rotation.x += delta * atoms[i].speed
          atom.children[0].rotation.z += delta * atoms[i].speed * 0.7
        }

        // Slight movement of atoms
        const time = timeRef.current * 0.2
        const offset = i * 0.1
        atom.position.x += Math.sin(time + offset) * 0.01
        atom.position.y += Math.cos(time * 0.8 + offset) * 0.01
        atom.position.z += Math.sin(time * 0.5 + offset) * 0.01
      })
    }
  })

  return (
    <group>
      {/* Background particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particles.sizes.length}
            array={particles.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Atoms */}
      <group ref={atomsRef}>
        {atoms.map((atom, i) => (
          <group key={i} position={atom.position as any} rotation={atom.rotation as any} scale={atom.scale}>
            {/* Nucleus */}
            <mesh>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshBasicMaterial color="#6495ED" />
            </mesh>

            {/* Electron cloud */}
            <group>
              {[0, 1, 2].map((ring) => (
                <mesh key={ring} rotation={[Math.PI / 2, 0, (ring * Math.PI) / 3]}>
                  <torusGeometry args={[0.6 + ring * 0.3, 0.02, 16, 100]} />
                  <meshBasicMaterial color="#4169E1" transparent opacity={0.7} />
                </mesh>
              ))}

              {/* Electrons */}
              {[0, 1, 2].map((electron) => (
                <mesh
                  key={electron}
                  position={[
                    Math.cos((electron * Math.PI * 2) / 3) * 0.8,
                    Math.sin((electron * Math.PI * 2) / 3) * 0.8,
                    0,
                  ]}
                >
                  <sphereGeometry args={[0.08, 8, 8]} />
                  <meshBasicMaterial color="#87CEFA" />
                </mesh>
              ))}
            </group>
          </group>
        ))}
      </group>
    </group>
  )
}

export default CoolingPhase

