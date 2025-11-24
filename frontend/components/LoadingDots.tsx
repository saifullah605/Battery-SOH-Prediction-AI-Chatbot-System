export default function LoadingDots() {
  return (
    <div className="flex gap-2">
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
    </div>
  )
}