import React from 'react'

interface CardProps {
  children: React.ReactNode
  padding?: string
  className?: string
}

export default function Card({ children, padding = '20px', className = '' }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E0D8',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        padding: padding,
      }}
    >
      {children}
    </div>
  )
}
