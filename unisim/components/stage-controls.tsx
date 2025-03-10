"use client"

import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Repeat, Info, X } from "lucide-react"
import { useState } from "react"

interface StageControlsProps {
  stage: number
  setStage: (stage: number) => void
  autoPlay: boolean
  setAutoPlay: (autoPlay: boolean) => void
  isPlaying: boolean
  setIsPlaying: (isPlaying: boolean) => void
}

export function StageControls({ stage, setStage, autoPlay, setAutoPlay, isPlaying, setIsPlaying }: StageControlsProps) {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 p-4 flex justify-center items-center z-10">
        <div className="bg-black/70 backdrop-blur-md rounded-full p-2 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={() => setStage(0)}
            disabled={stage === 0}
          >
            <SkipBack size={20} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={() => setStage(Math.max(0, stage - 1))}
            disabled={stage === 0}
          >
            <SkipBack size={20} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={() => setStage(Math.min(3, stage + 1))}
            disabled={stage === 3}
          >
            <SkipForward size={20} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={() => setStage(3)}
            disabled={stage === 3}
          >
            <SkipForward size={20} />
          </Button>

          <Button
            variant={autoPlay ? "default" : "ghost"}
            size="icon"
            className={`${autoPlay ? "bg-white/30 text-white" : "text-white hover:bg-white/20"} rounded-full`}
            onClick={() => setAutoPlay(!autoPlay)}
          >
            <Repeat size={20} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={() => setShowInfo(true)}
          >
            <Info size={20} />
          </Button>
        </div>
      </div>

      <div className="fixed top-4 left-0 right-0 flex justify-center">
        <div className="bg-black/70 backdrop-blur-md rounded-full px-4 py-2 flex gap-2">
          {[0, 1, 2, 3].map((index) => (
            <Button
              key={index}
              variant={stage === index ? "default" : "ghost"}
              className={`${stage === index ? "bg-white/30 text-white" : "text-white hover:bg-white/20"} rounded-full px-3 py-1 h-auto`}
              onClick={() => setStage(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>

      {showInfo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20 p-4">
          <div className="bg-black/90 border border-white/20 rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Universe Evolution</h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
                onClick={() => setShowInfo(false)}
              >
                <X size={20} />
              </Button>
            </div>

            <div className="space-y-4 text-white/80">
              <p>This interactive 3D visualization shows the key stages in the evolution of our universe:</p>

              <div>
                <h3 className="font-bold text-white">1. Big Bang Event</h3>
                <p>
                  The universe begins as an infinitely hot, dense point that rapidly expands outward, releasing
                  tremendous energy and forming the first subatomic particles.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white">2. Cooling Phase</h3>
                <p>
                  As expansion continues, the universe cools enough for quarks to form protons and neutrons, and
                  eventually electrons can bind with nuclei to form the first atoms.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white">3. Galaxy Formation</h3>
                <p>
                  Gravity causes matter to clump together in denser regions, eventually forming the first galaxies with
                  their characteristic spiral and elliptical shapes.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-white">4. Star Birth</h3>
                <p>
                  Within galaxies, dense clouds of gas and dust collapse under gravity, heating up until nuclear fusion
                  begins, creating stars that illuminate the cosmos.
                </p>
              </div>

              <p className="text-sm italic">
                Use the controls to navigate between stages, play/pause the animation, or enable auto-play to
                automatically progress through the stages.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

