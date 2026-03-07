import React from 'react'
import { Droplet, Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNutrition } from '../../context/NutritionContext'

const WaterTracker = () => {
    const { water, logWater, goals } = useNutrition()
    const target = goals?.water_ml || 2000
    const percentage = Math.min((water / target) * 100, 100)

    return (
        <div className="glass-card p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Droplet size={80} className="text-accent-secondary" />
            </div>

            <div className="relative z-10 flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-text-secondary mb-1">Hydration</h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black tracking-tighter">{water}</span>
                        <span className="text-text-secondary text-xs font-bold uppercase tracking-widest">/ {target}ml</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => logWater(-250)}
                        className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-text-secondary hover:text-white transition-colors border-white/5"
                    >
                        <Minus size={18} />
                    </button>
                    <button
                        onClick={() => logWater(250)}
                        className="w-10 h-10 rounded-xl bg-accent-secondary flex items-center justify-center text-white shadow-lg shadow-accent-secondary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            <div className="relative h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    className="absolute top-0 left-0 h-full bg-accent-secondary shadow-[0_0_15px_rgba(56,211,211,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                />
            </div>

            <div className="mt-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-60">
                <span>{percentage.toFixed(0)}% Complete</span>
                <span>{Math.max(target - water, 0)}ml Remaining</span>
            </div>
        </div>
    )
}

export default WaterTracker
