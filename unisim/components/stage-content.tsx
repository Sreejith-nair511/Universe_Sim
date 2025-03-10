"use client"

import { useEffect } from "react"
import { useThree } from "@react-three/fiber"
import dynamic from "next/dynamic"

// Dynamically import stage components
const BigBang = dynamic(() => import("./stages/big-bang"), { ssr: false })
const CoolingPhase = dynamic(() => import("./stages/cooling-phase"), { ssr: false })
const GalaxyFormation = dynamic(() => import("./stages/galaxy-formation"), { ssr: false })
const StarBirth = dynamic(() => import("./stages/star-birth"), { ssr: false })
const StageTitle = dynamic(() => import("./stage-title").then((mod) => mod.StageTitle), { ssr: false })

interface StageContentProps {
  stage: number
  isPlaying: boolean
}

export default function StageContent({ stage, isPlaying }: StageContentProps) {
  const { camera } = useThree()

  // Reset camera position when stage changes
  useEffect(() => {
    camera.position.set(0, 0, 20)
    camera.lookAt(0, 0, 0)
  }, [stage, camera])

  return (
    <>
      {stage === 0 && <BigBang isPlaying={isPlaying} />}
      {stage === 1 && <CoolingPhase isPlaying={isPlaying} />}
      {stage === 2 && <GalaxyFormation isPlaying={isPlaying} />}
      {stage === 3 && <StarBirth isPlaying={isPlaying} />}

      <StageTitle stage={stage} />
    </>
  )
}

