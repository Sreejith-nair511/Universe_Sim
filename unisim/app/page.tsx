"use client"

import { Suspense, lazy, useState, useEffect } from "react"
import Loading from "@/components/loading"
import ErrorBoundary from "@/components/error-boundary"

// Only load the universe component on the client side
const UniverseEvolution = lazy(() =>
  typeof window !== "undefined" ? import("@/components/universe-evolution") : Promise.resolve({ default: () => null }),
)

export default function Home() {
  // Only render the 3D content after the component has mounted
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Loading />
  }

  return (
    <main className="w-full h-screen bg-black overflow-hidden">
      <ErrorBoundary
        fallback={
          <div className="text-white p-8">Something went wrong with the visualization. Please refresh the page.</div>
        }
      >
        <Suspense fallback={<Loading />}>
          <UniverseEvolution />
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}

