"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import { THREE } from "@/lib/three-instance"

function StarBirth({ isPlaying }: { isPlaying: boolean }) {
  const nebulaRef = useRef<THREE.Points>(null)
  const starsRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  // Create nebula particles
  const nebula = useMemo(() => {
    const count = 8000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // Create a cloud-like structure
      const theta = Math.random() * Math.PI * 2
      const radius = 3 + Math.random() * 7
      const height = (Math.random() - 0.5) * 4

      positions[i3] = Math.cos(theta) * radius
      positions[i3 + 1] = height
      positions[i3 + 2] = Math.sin(theta) * radius

      // Add some randomness to create cloud-like appearance
      positions[i3] += (Math.random() - 0.5) * 3
      positions[i3 + 1] += (Math.random() - 0.5) * 3
      positions[i3 + 2] += (Math.random() - 0.5) * 3

      // Nebula colors (reds, blues, purples)
      const colorChoice = Math.random()
      if (colorChoice < 0.4) {
        // Red/orange
        colors[i3] = 0.8 + Math.random() * 0.2
        colors[i3 + 1] = 0.3 + Math.random() * 0.3
        colors[i3 + 2] = 0.2 + Math.random() * 0.2
      } else if (colorChoice < 0.7) {
        // Blue
        colors[i3] = 0.2 + Math.random() * 0.2
        colors[i3 + 1] = 0.4 + Math.random() * 0.3
        colors[i3 + 2] = 0.8 + Math.random() * 0.2
      } else {
        // Purple
        colors[i3] = 0.6 + Math.random() * 0.3
        colors[i3 + 1] = 0.2 + Math.random() * 0.2
        colors[i3 + 2] = 0.8 + Math.random() * 0.2
      }

      // Varying sizes
      sizes[i] = Math.random() * 2 + 0.5
    }

    return { positions, colors, sizes }
  }, [])

  // Create stars being born
  const stars = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => {
      // Position stars within the nebula
      const theta = Math.random() * Math.PI * 2
      const radius = 2 + Math.random() * 6
      const height = (Math.random() - 0.5) * 3

      const x = Math.cos(theta) * radius + (Math.random() - 0.5) * 2
      const y = height
      const z = Math.sin(theta) * radius + (Math.random() - 0.5) * 2

      // Different sizes for stars
      const scale = 0.2 + Math.random() * 0.4

      // Different colors for stars (white, blue, yellow)
      let color
      const colorChoice = Math.random()
      if (colorChoice < 0.4) {
        color = new THREE.Color(0xffffff) // White
      } else if (colorChoice < 0.7) {
        color = new THREE.Color(0x87cefa) // Light blue
      } else {
        color = new THREE.Color(0xffd700) // Gold/yellow
      }

      // Pulse speed
      const pulseSpeed = 0.5 + Math.random() * 1.5

      return { position: [x, y, z], scale, color, pulseSpeed }
    })
  }, [])

  // Animation loop
  useFrame((state, delta) => {
    if (!isPlaying) return

    // Update time reference
    timeRef.current += delta

    // Update nebula
    if (nebulaRef.current && nebulaRef.current.geometry.attributes.position) {
      // Slow rotation of the nebula
      nebulaRef.current.rotation.y += delta * 0.05

      // Subtle movement of nebula particles
      const positions = nebulaRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < positions.length; i += 3) {
        const ix = i
        const iy = i + 1
        const iz = i + 2

        // Add subtle movement
        const time = timeRef.current
        const offset = i * 0.0001

        positions[ix] += Math.sin(time * 0.2 + offset) * 0.01
        positions[iy] += Math.cos(time * 0.3 + offset) * 0.01
        positions[iz] += Math.sin(time * 0.1 + offset) * 0.01
      }

      nebulaRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Update stars
    if (starsRef.current && starsRef.current.children) {
      starsRef.current.children.forEach((star, i) => {
        if (i >= stars.length) return

        // Pulsing effect for stars
        const pulse = Math.sin(timeRef.current * stars[i].pulseSpeed) * 0.2 + 1
        star.scale.set(stars[i].scale * pulse, stars[i].scale * pulse, stars[i].scale * pulse)

        // Slight movement
        const time = timeRef.current * 0.5
        const offset = i * 0.5
        star.position.x += Math.sin(time + offset) * 0.005
        star.position.y += Math.cos(time * 0.8 + offset) * 0.005
        star.position.z += Math.sin(time * 0.5 + offset) * 0.005
      })
    }
  })

  return (
    <group>
      {/* Nebula cloud */}
      <points ref={nebulaRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nebula.positions.length / 3}
            array={nebula.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={nebula.colors.length / 3}
            array={nebula.colors}
            itemSize={3}
          />
          <bufferAttribute attach="attributes-size" count={nebula.sizes.length} array={nebula.sizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          size={0.2}
          vertexColors
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* Stars being born */}
      <group ref={starsRef}>
        {stars.map((star, i) => (
          <mesh key={i} position={star.position as any}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial color={star.color} transparent opacity={0.9} blending={THREE.AdditiveBlending} />

            {/* Glow effect */}
            <mesh>
              <sphereGeometry args={[1.5, 16, 16]} />
              <meshBasicMaterial color={star.color} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
            </mesh>
          </mesh>
        ))}
      </group>

      {/* Background stars */}
      <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
    </group>
  )
}

export default StarBirth

