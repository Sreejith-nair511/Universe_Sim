"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { THREE } from "@/lib/three-instance"

function BigBang({ isPlaying }: { isPlaying: boolean }) {
  const particlesRef = useRef<THREE.Points>(null)
  const explosionRef = useRef<THREE.Mesh>(null)
  const timeRef = useRef(0)

  // Create particles for the Big Bang
  const particles = useMemo(() => {
    const count = 5000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Initial positions near center
      positions[i3] = (Math.random() - 0.5) * 2
      positions[i3 + 1] = (Math.random() - 0.5) * 2
      positions[i3 + 2] = (Math.random() - 0.5) * 2

      // High energy colors (white, blue, purple)
      const colorChoice = Math.random()
      if (colorChoice < 0.6) {
        // White/blue
        colors[i3] = 0.8 + Math.random() * 0.2
        colors[i3 + 1] = 0.8 + Math.random() * 0.2
        colors[i3 + 2] = 1.0
      } else if (colorChoice < 0.8) {
        // Purple
        colors[i3] = 0.8 + Math.random() * 0.2
        colors[i3 + 1] = 0.2 + Math.random() * 0.3
        colors[i3 + 2] = 0.8 + Math.random() * 0.2
      } else {
        // Yellow/white
        colors[i3] = 1.0
        colors[i3 + 1] = 0.9 + Math.random() * 0.1
        colors[i3 + 2] = 0.7 + Math.random() * 0.3
      }

      // Varying sizes
      sizes[i] = Math.random() * 2
    }

    return { positions, colors, sizes }
  }, [])

  // Create explosion shader material
  const explosionMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        
        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f*f*(3.0-2.0*f);
          
          vec2 uv = (i.xy+vec2(37.0,17.0)*i.z) + f.xy;
          vec2 rg = vec2(
            sin(uv.x*0.1+time),
            sin(uv.y*0.1+time)
          )*0.5+0.5;
          return mix(rg.x, rg.y, f.z);
        }
        
        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          float d = length(p);
          
          // Create a pulsing, expanding explosion effect
          float brightness = 1.0 - smoothstep(0.0, 0.8 + 0.2 * sin(time * 3.0), d);
          
          // Add noise for texture
          vec3 noisePos = vec3(p * 5.0, time * 0.5);
          float noiseVal = noise(noisePos) * 0.5 + 0.5;
          
          // Color gradient from center (white/yellow) to edge (orange/red)
          vec3 color = mix(
            vec3(1.0, 1.0, 0.8), // Center: white/yellow
            vec3(1.0, 0.3, 0.1), // Edge: orange/red
            d * d
          );
          
          // Apply noise and brightness
          color = mix(color, vec3(noiseVal), 0.3) * brightness;
          
          gl_FragColor = vec4(color, brightness);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    })
  }, [])

  // Animation loop
  useFrame((state, delta) => {
    if (!isPlaying) return

    // Update time reference
    timeRef.current += delta * 0.5

    // Update explosion shader
    if (explosionRef.current && explosionRef.current.material) {
      const material = explosionRef.current.material as THREE.ShaderMaterial
      if (material.uniforms && material.uniforms.time) {
        material.uniforms.time.value = timeRef.current
      }

      // Scale the explosion over time
      const scale = Math.min(5, 1 + timeRef.current * 2)
      explosionRef.current.scale.set(scale, scale, scale)

      // Fade out over time
      const opacity = Math.max(0, 1 - timeRef.current * 0.2)
      material.opacity = opacity
    }

    // Update particles
    if (particlesRef.current && particlesRef.current.geometry.attributes.position) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array

      for (let i = 0; i < positions.length; i += 3) {
        // Get current position
        const x = positions[i]
        const y = positions[i + 1]
        const z = positions[i + 2]

        // Calculate distance from center
        const distance = Math.sqrt(x * x + y * y + z * z)

        // Direction vector (avoid division by zero)
        const dirX = distance === 0 ? 0 : x / distance
        const dirY = distance === 0 ? 0 : y / distance
        const dirZ = distance === 0 ? 0 : z / distance

        // Speed based on distance (farther particles move faster)
        const speed = 0.1 + distance * 0.05

        // Update position
        positions[i] += dirX * speed * delta * (isPlaying ? 1 : 0)
        positions[i + 1] += dirY * speed * delta * (isPlaying ? 1 : 0)
        positions[i + 2] += dirZ * speed * delta * (isPlaying ? 1 : 0)
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true

      // Rotate the entire particle system
      particlesRef.current.rotation.y += delta * 0.1 * (isPlaying ? 1 : 0)
    }
  })

  return (
    <group>
      {/* Central explosion */}
      <mesh ref={explosionRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <primitive object={explosionMaterial} attach="material" />
      </mesh>

      {/* Expanding particles */}
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
          size={0.15}
          vertexColors
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

export default BigBang

