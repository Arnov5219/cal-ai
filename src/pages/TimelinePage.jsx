import React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, Coffee, Utensils, Zap, Trash2, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useNutrition } from '../context/NutritionContext'

const TimelinePage = () => {
    const navigate = useNavigate()
    const { meals, deleteMeal, loading } = useNutrition()

    const getIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'breakfast': return <Coffee size={18} />
            case 'snack': return <Zap size={18} />
            default: return <Utensils size={18} />
        }
    }

    return (
        <div className="flex-1 w-full max-w-md mx-auto px-6 pt-12 pb-32 animate-in fade-in slide-up">
            <header className="flex items-center gap-4 mb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-text-secondary hover:text-white transition-all"
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-2xl font-black tracking-tight">Timeline</h1>
            </header>

            <div className="flex flex-col gap-6">
                {meals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30">
                        <Calendar size={48} className="mb-4" />
                        <p className="font-bold uppercase tracking-widest text-xs text-center">No meals logged yet</p>
                    </div>
                ) : (
                    meals.map((meal, idx) => (
                        <motion.div
                            key={meal.id}
                            className="glass-card p-5 flex items-center justify-between glass-card-hover group"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.05 * idx }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center text-text-secondary group-hover:text-accent-primary group-hover:bg-accent-primary/10 transition-all duration-300">
                                    {getIcon(meal.meal_type)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg group-hover:text-white transition-colors leading-tight">{meal.name}</h4>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-[10px] text-accent-secondary font-black uppercase tracking-wider bg-accent-secondary/10 px-2 py-0.5 rounded-full">{meal.meal_type}</span>
                                        <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-60">
                                            {new Date(meal.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <span className="font-black text-xl leading-none block">{meal.calories}</span>
                                    <span className="text-[10px] text-text-secondary font-black tracking-tighter uppercase opacity-60">Kcal</span>
                                </div>
                                <button
                                    onClick={() => deleteMeal(meal.id)}
                                    className="p-2.5 rounded-xl text-white/5 hover:text-fat hover:bg-fat/10 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}

export default TimelinePage
