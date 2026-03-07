import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const CalorieRing = ({ target, consumed }) => {
    const remaining = Math.max(0, target - consumed)
    const percentage = Math.min(100, (consumed / target) * 100)
    const [displayValue, setDisplayValue] = useState(0)

    useEffect(() => {
        let start = 0
        const end = remaining
        const duration = 1500
        const steps = 60
        const stepValue = end / steps
        const stepTime = duration / steps

        const timer = setInterval(() => {
            start += stepValue
            if (start >= end) {
                setDisplayValue(end)
                clearInterval(timer)
            } else {
                setDisplayValue(Math.floor(start))
            }
        }, stepTime)

        return () => clearInterval(timer)
    }, [remaining])

    const radius = 94
    const strokeWidth = 14
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percentage / 100) * circumference

    return (
        <div className="relative flex items-center justify-center w-[260px] h-[260px]">
            {/* Background Ambient Glow */}
            <div className="absolute inset-4 rounded-full bg-accent-primary/10 blur-[50px] animate-pulse"></div>

            <svg className="transform -rotate-90 w-full h-full drop-shadow-[0_0_15px_rgba(124,92,252,0.15)]">
                {/* Background Track */}
                <circle
                    cx="130"
                    cy="130"
                    r={radius}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                {/* Progress Stroke */}
                <motion.circle
                    cx="130"
                    cy="130"
                    r={radius}
                    stroke="url(#calorieGradient)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                    strokeLinecap="round"
                />
                <defs>
                    <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#7c5cfc" />
                        <stop offset="100%" stopColor="#00d4aa" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Central Counter */}
            <div className="absolute flex flex-col items-center justify-center">
                <motion.span
                    className="text-5xl font-black tabular tracking-tight"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    {displayValue.toLocaleString()}
                </motion.span>
                <span className="text-text-secondary text-[11px] font-bold uppercase tracking-[0.2em] mt-2 opacity-80">Remaining</span>
            </div>
        </div>
    )
}

export default CalorieRing
