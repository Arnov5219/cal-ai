import React from 'react'
import { motion } from 'framer-motion'

const MacroSummary = ({ protein, carbs, fat }) => {
    const macros = [
        { label: 'Prot', ...protein, color: 'var(--protein)', unit: 'g' },
        { label: 'Carb', ...carbs, color: 'var(--carbs)', unit: 'g' },
        { label: 'Fat', ...fat, color: 'var(--fat)', unit: 'g' }
    ]

    return (
        <div className="grid grid-cols-3 gap-3">
            {macros.map((macro, idx) => (
                <div key={idx} className="glass-card p-4 flex flex-col items-start glass-card-hover group">
                    <div className="flex items-center gap-1.5 mb-2.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: macro.color }}></div>
                        <span className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">{macro.label}</span>
                    </div>

                    <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-lg font-bold">{macro.consumed}</span>
                        <span className="text-[10px] text-text-secondary font-medium">/ {macro.target}{macro.unit}</span>
                    </div>

                    <div className="relative w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 h-full rounded-full shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                            style={{ backgroundColor: macro.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (macro.consumed / macro.target) * 100)}%` }}
                            transition={{ duration: 1.2, delay: 0.4 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default MacroSummary
