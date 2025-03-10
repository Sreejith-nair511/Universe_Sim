"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Stars } from "@react-three/drei"
import { THREE } from "@/lib/three-instance"

function GalaxyFormation({ isPlaying }: { isPlaying: boolean }) {
  const galaxiesRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  // Create multiple galaxies
  const galaxies = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => {
      // Position galaxies in different areas
      let position
      if (i === 0) {
        position = [0, 0, 0] // Center galaxy
      } else if (i === 1) {
        position = [-12, 5, -8] // Left galaxy
      } else {
        position = [15, -3, -10] // Right galaxy
      }

      // Different galaxy types
      const type = i === 0 ? "spiral" : i === 1 ? "elliptical" : "irregular"

      // Different colors for each galaxy
      let color
      if (i === 0) {
        color = new THREE.Color(0x4169e1) // Blue for spiral
      } else if (i === 1) {
        color = new THREE.Color(0xffa500) // Orange for elliptical
      } else {
        color = new THREE.Color(0x9370db) // Purple for irregular
      }

      // Different rotation speeds
      const rotationSpeed = 0.1 - i * 0.03

      return { position, type, color, rotationSpeed }
    })
  }, [])

  // Create particles for each galaxy
  const galaxyParticles = useMemo(() => {
    return galaxies.map((galaxy, galaxyIndex) => {
      const { type, color } = galaxy

      // Different particle counts based on galaxy type
      let count
      if (type === "spiral") {
        count = 10000
      } else if (type === "elliptical") {
        count = 8000
      } else {
        count = 6000
      }

      const positions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)
      const sizes = new Float32Array(count)

      for (let i = 0; i < count; i++) {
        const i3 = i * 3

        if (type === "spiral") {
          // Spiral galaxy
          const radius = Math.random() * 10
          const branchAngle = (i % 2) * Math.PI
          const spinAngle = radius * 0.5

          const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3
          const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3
          const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3

          positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
          positions[i3 + 1] = randomY
          positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ
        } else if (type === "elliptical") {
          // Elliptical galaxy
          const u = Math.random()
          const v = Math.random()
          const theta = 2 * Math.PI * u
          const phi = Math.acos(2 * v - 1)
          const r = Math.cbrt(Math.random()) * 8

          positions[i3] = r * Math.sin(phi) * Math.cos(theta) * 1.5
          positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
          positions[i3 + 2] = r * Math.cos(phi)
        } else {
          // Irregular galaxy
          positions[i3] = (Math.random() - 0.5) * 10
          positions[i3 + 1] = (Math.random() - 0.5) * 10
          positions[i3 + 2] = (Math.random() - 0.5) * 10
        }

        // Colors with slight variation
        const colorVariation = 0.2
        colors[i3] = color.r + (Math.random() * colorVariation - colorVariation / 2)
        colors[i3 + 1] = color.g + (Math.random() * colorVariation - colorVariation / 2)
        colors[i3 + 2] = color.b + (Math.random() * colorVariation - colorVariation / 2)

        // Sizes with variation
        sizes[i] = Math.random() * 0.5 + 0.1
      }

      return { positions, colors, sizes, count }
    })
  }, [galaxies])

  // Animation loop
  useFrame((state, delta) => {
    if (!isPlaying) return

    // Update time reference
    timeRef.current += delta

    // Update galaxies
    if (galaxiesRef.current && galaxiesRef.current.children) {
      galaxiesRef.current.children.forEach((galaxy, i) => {
        if (i >= galaxies.length) return

        // Rotate each galaxy at its own speed
        galaxy.rotation.y += delta * galaxies[i].rotationSpeed

        // Add some wobble to irregular galaxy
        if (galaxies[i].type === "irregular") {
          galaxy.rotation.x = Math.sin(timeRef.current * 0.2) * 0.1
          galaxy.rotation.z = Math.cos(timeRef.current * 0.3) * 0.1
        }
      })
    }
  })

  return (
    <group>
      {/* Galaxies */}
      <group ref={galaxiesRef}>
        {galaxies.map((galaxy, i) => (
          <points key={i} position={galaxy.position as any}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={galaxyParticles[i].count}
                array={galaxyParticles[i].positions}
                itemSize={3}
              />
              <bufferAttribute
                attach="attributes-color"
                count={galaxyParticles[i].count}
                array={galaxyParticles[i].colors}
                itemSize={3}
              />
              <bufferAttribute
                attach="attributes-size"
                count={galaxyParticles[i].count}
                array={galaxyParticles[i].sizes}
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
        ))}
      </group>

      {/* Distant stars */}
      <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  )
}

export default GalaxyFormation

