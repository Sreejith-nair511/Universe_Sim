"use client"

import { useState, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import { StageControls } from "./stage-controls"

// Dynamically import the scene component with no SSR
const UniverseScene = dynamic(() => import("./universe-scene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-pulse">Loading 3D scene...</div>
      </div>
    </div>
  ),
})

export default function UniverseEvolution() {
  const [stage, setStage] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle auto-play functionality
  useEffect(() => {
    if (autoPlay && isPlaying) {
      autoPlayTimeoutRef.current = setTimeout(() => {
        setStage((prev) => (prev < 3 ? prev + 1 : prev))
      }, 15000) // Auto advance every 15 seconds
    }

    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current)
      }
    }
  }, [stage, autoPlay, isPlaying])

  return (
    <>
      <UniverseScene stage={stage} isPlaying={isPlaying} />

      <StageControls
        stage={stage}
        setStage={setStage}
        autoPlay={autoPlay}
        setAutoPlay={setAutoPlay}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
    </>
  )
}

