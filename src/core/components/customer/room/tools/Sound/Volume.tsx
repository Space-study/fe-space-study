type VolumeProps = {
  isActive: boolean
  isMuted: boolean
}

function Volume({isActive, isMuted}: VolumeProps) {
  return (
    <span
      className={`h-4 w-2 ${
        isMuted
          ? 'filter-red-glow bg-slate-400'
          : isActive
            ? 'bg-white filter-green-glow'
            : 'bg-slate-400'
      }`}></span>
  )
}

export default Volume
