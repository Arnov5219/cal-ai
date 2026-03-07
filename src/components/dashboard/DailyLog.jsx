import React from 'react'
import { motion } from 'framer-motion'
import { Coffee, Utensils, Zap, ChevronRight, Trash2 } from 'lucide-react'
import { useNutrition } from '../../context/NutritionContext'

const DailyLog = () => {
    const { meals, deleteMeal } = useNutrition()

    const getIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'breakfast': return <Coffee size={18} />
            case 'snack': return <Zap size={18} />
            default: return <Utensils size={18} />
        }
    }

    return (
        <div className="flex flex-col gap-3">
            {meals.map((meal, idx) => (
                <motion.div
                    key={meal.id}
                    className="glass-card p-4 flex items-center justify-between glass-card-hover group cursor-pointer"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * idx, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center text-text-secondary group-hover:text-accent-primary group-hover:bg-accent-primary/10 transition-all duration-300">
                            {meal.icon}
                        </div>
                        <div>
                            <h4 className="font-bold text-[15px] group-hover:text-white transition-colors">{meal.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">{meal.type}</span>
                                <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                <span className="text-[10px] text-text-secondary font-medium">{meal.time}</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <span className="px-2 py-0.5 rounded-md bg-protein/10 text-protein text-[9px] font-black uppercase tracking-tighter tabular">{meal.protein}g P</span>
                                <span className="px-2 py-0.5 rounded-md bg-carbs/10 text-carbs text-[9px] font-black uppercase tracking-tighter tabular">{meal.carbs}g C</span>
                                <span className="px-2 py-0.5 rounded-md bg-fat/10 text-fat text-[9px] font-black uppercase tracking-tighter tabular">{meal.fat}g F</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <span className="font-black text-base">{meal.calories}</span>
                            <span className="text-[9px] text-text-secondary font-black block tracking-tighter -mt-1 uppercase">Kcal</span>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); deleteMeal(meal.id); }}
                            className="p-2 rounded-xl text-white/5 hover:text-danger hover:bg-danger/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

export default DailyLog
