export default function Loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="animate-pulse text-2xl font-bold mb-4">Loading Universe...</div>
        <div className="text-sm opacity-70">Preparing cosmic simulation</div>
      </div>
    </div>
  )
}

