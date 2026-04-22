import React from 'react'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string | number
  style?: React.CSSProperties
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 6, style }: SkeletonProps) {
  return (
    <div style={{
      width,
      height,
      borderRadius,
      background: 'linear-gradient(90deg,#F4F4F5 25%,#EBEBEC 50%,#F4F4F5 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s ease infinite',
      flexShrink: 0,
      ...style,
    }} />
  )
}

export function VideoCardSkeleton() {
  const C = { card: '#FFFFFF', line: '#E4E4E7' }
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.line}`,
      borderRadius: 12,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <Skeleton height={140} borderRadius={8} />
      <Skeleton width="75%" height={14} />
      <Skeleton width="45%" height={12} />
      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <Skeleton width={70} height={30} borderRadius={8} />
        <Skeleton width={70} height={30} borderRadius={8} />
      </div>
    </div>
  )
}

export function MetricSkeleton() {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E4E4E7',
      borderRadius: 12,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      <Skeleton width={80} height={11} />
      <Skeleton width={60} height={28} borderRadius={6} />
      <Skeleton width={100} height={11} />
    </div>
  )
}

// Add shimmer keyframe to global styles via a style tag
export function ShimmerStyle() {
  return (
    <style>{`
      @keyframes shimmer {
        0%   { background-position: 200% 0 }
        100% { background-position: -200% 0 }
      }
    `}</style>
  )
}
