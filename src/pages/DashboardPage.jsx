import React, { useState } from 'react'
import { motion } from 'framer-motion'
import CalorieRing from '../components/dashboard/CalorieRing'
import MacroSummary from '../components/dashboard/MacroSummary'
import DailyLog from '../components/dashboard/DailyLog'
import WaterTracker from '../components/dashboard/WaterTracker'
import { Bell, Search, User, Loader2, Scale, ArrowRight } from 'lucide-react'
import { useNutrition } from '../context/NutritionContext'
import Modal from '../components/common/Modal'

const DashboardPage = () => {
    const { getDaySummary, loading, profile, logWeight } = useNutrition()
    const [isWeightModalOpen, setIsWeightModalOpen] = useState(false)
    const [newWeight, setNewWeight] = useState(profile?.weight_kg || 0)
    const summary = getDaySummary()

    const handleWeightSubmit = (e) => {
        e.preventDefault()
        logWeight(parseFloat(newWeight))
        setIsWeightModalOpen(false)
    }

    if (loading || !summary) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="animate-spin text-accent-primary" size={40} />
            </div>
        )
    }

    return (
        <div className="flex-1 w-full max-w-md mx-auto px-6 pt-12 pb-32 animate-in fade-in slide-up">
            {/* Header */}
            <header className="flex justify-between items-center mb-10">
                <div>
                    <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-accent-primary text-sm font-bold tracking-widest mb-1"
                    >
                        Hello, {profile?.name || 'User'} 👋
                    </motion.p>
                    <h1 className="text-3xl font-extrabold tracking-tight">Today</h1>
                    <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest mt-1">
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>
                {/* Dummy buttons removed per request */}
            </header>

            {/* Hero: Calorie Ring */}
            <section className="mb-12 flex flex-col items-center">
                <CalorieRing
                    target={summary.calories.target}
                    consumed={summary.calories.consumed}
                />
            </section>

            {/* Macros Section */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Nutrition</h3>
                    <span className="text-[10px] font-bold text-accent-secondary bg-accent-secondary/10 px-2 py-0.5 rounded-full">
                        {summary.calories.consumed <= summary.calories.target ? 'On Track' : 'Over Limit'}
                    </span>
                </div>
                <MacroSummary
                    protein={summary.protein}
                    carbs={summary.carbs}
                    fat={summary.fat}
                />
            </section>

            {/* Tracking Section */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Tracking</h3>
                </div>
                <div className="flex flex-col gap-4">
                    <WaterTracker />

                    {/* Compact Weight Widget (Aesthetic Redesign) */}
                    <button
                        onClick={() => {
                            setNewWeight(profile?.weight_kg || 0)
                            setIsWeightModalOpen(true)
                        }}
                        className="w-full bg-[#13141c] border border-white/[0.03] rounded-[24px] p-2 pr-6 flex items-center justify-between group hover:bg-[#181922] transition-colors"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-[52px] h-[52px] rounded-full bg-[#1b1928] flex items-center justify-center text-[#7c5cfc] shadow-[0_0_15px_rgba(124,92,252,0.15)] group-hover:scale-105 transition-transform duration-300">
                                <Scale size={20} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col items-start gap-1">
                                <p className="text-[10px] font-black tracking-[0.15em] text-[#8b8d96] uppercase">CURRENT WEIGHT</p>
                                <p className="text-2xl font-black text-white tracking-tighter">
                                    {profile?.weight_kg || 0} <span className="text-sm text-[#8b8d96] ml-1">kg</span>
                                </p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#1b1b22] flex items-center justify-center text-[#8b8d96] group-hover:bg-[#25252e] group-hover:text-white transition-colors">
                            <ArrowRight size={16} />
                        </div>
                    </button>
                </div>
            </section>

            <Modal
                isOpen={isWeightModalOpen}
                onClose={() => setIsWeightModalOpen(false)}
                title="Log Weight"
            >
                <form onSubmit={handleWeightSubmit} className="space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary block mb-3">Today's Weight (kg)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={newWeight}
                            onChange={(e) => setNewWeight(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-2xl font-black outline-none focus:border-accent-primary transition-colors mb-2"
                            autoFocus
                        />
                        <p className="text-[10px] text-text-secondary font-medium">Your weight history will be updated automatically.</p>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 rounded-2xl bg-accent-primary text-bg-primary font-black uppercase tracking-widest hover:opacity-90 transition-opacity active:scale-[0.98]"
                    >
                        Save Weight
                    </button>
                </form>
            </Modal>

            {/* Daily Log */}
            <section className="">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary">Timeline</h3>

                </div>
                <DailyLog />
            </section>
        </div >
    )
}

export default DashboardPage
