"use client"

import { Suspense, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import dynamic from "next/dynamic"

// Dynamically import stage components
const StageContent = dynamic(() => import("./stage-content"), { ssr: false })

interface UniverseSceneProps {
  stage: number
  isPlaying: boolean
}

export default function UniverseScene({ stage, isPlaying }: UniverseSceneProps) {
  // Only render after component has mounted to avoid hydration issues
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 60 }}
      dpr={[1, 2]} // Optimize for mobile by limiting device pixel ratio
      performance={{ min: 0.5 }} // Allow performance scaling for mobile
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
      }}
    >
      <color attach="background" args={["#000"]} />
      <fog attach="fog" args={["#000", 20, 100]} />
      <ambientLight intensity={0.2} />

      <Suspense fallback={null}>
        <StageContent stage={stage} isPlaying={isPlaying} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxDistance={50}
        minDistance={5}
        rotateSpeed={0.5}
        zoomSpeed={0.5}
        autoRotate={isPlaying}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  )
}

