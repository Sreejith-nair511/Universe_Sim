"use client"

import { Text } from "@react-three/drei"

interface StageTitleProps {
  stage: number
}

export function StageTitle({ stage }: StageTitleProps) {
  const titles = ["Big Bang Event", "Cooling Phase", "Galaxy Formation", "Star Birth"]

  const descriptions = [
    "A bright explosion expands outward with high-energy particles forming",
    "Expansion slows, energy condenses into quarks, electrons, and early atoms",
    "Matter clusters under gravity, forming swirling galaxies",
    "Within galaxies, dense regions collapse to form stars",
  ]

  return (
    <group position={[0, 8, 0]}>
      <Text
        position={[0, 0, 0]}
        color="white"
        fontSize={1.5}
        font="/fonts/Inter_Bold.json"
        anchorX="center"
        anchorY="middle"
      >
        {titles[stage]}
      </Text>
      <Text
        position={[0, -1.5, 0]}
        color="white"
        fontSize={0.6}
        maxWidth={20}
        textAlign="center"
        font="/fonts/Inter_Regular.json"
        anchorX="center"
        anchorY="middle"
      >
        {descriptions[stage]}
      </Text>
    </group>
  )
}

