import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, Search, Plus, Sparkles, Check, Loader2, History, ArrowRight } from 'lucide-react'
import { useNutrition } from '../../context/NutritionContext'
import { supabase } from '../../supabaseClient'

const AIInteractionOverlay = ({ isOpen, onClose }) => {
    const { addMeal, session, user, refresh } = useNutrition()
    const [input, setInput] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [activeMode, setActiveMode] = useState('ai') // ai, manual, camera, search

    const [manualMeal, setManualMeal] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' })

    const saveToRecipesDisplay = async (mealObj) => {
        try {
            await supabase.from('recipes').insert([{
                user_id: user?.id,
                name: mealObj.name,
                calories: mealObj.calories,
                protein: mealObj.protein,
                carbs: mealObj.carbs,
                fat: mealObj.fat
            }])
        } catch (err) {
            console.error("Failed saving recipe to DB", err)
        }
    }

    const handleAISubmit = async (e) => {
        if (e) e.preventDefault()
        if (!input.trim()) return

        setIsProcessing(true)

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
            const response = await fetch(`${apiUrl}/api/v1/ai/scan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ text: input })
            })

            if (!response.ok) throw new Error('AI Scan failed')

            const aiMeal = await response.json()
            await addMeal(aiMeal)
            await saveToRecipesDisplay(aiMeal)

            refresh() // trigger sync to update recipes/timeline
            handleSuccess()
        } catch (err) {
            console.error('Failed to log meal via AI', err)
            setIsProcessing(false)
        }
    }

    const handleManualSubmit = async (e) => {
        if (e) e.preventDefault()
        if (!manualMeal.name || !manualMeal.calories) return

        setIsProcessing(true)
        const newMeal = {
            name: manualMeal.name,
            meal_type: 'Other',
            calories: parseInt(manualMeal.calories) || 0,
            protein: parseFloat(manualMeal.protein) || 0,
            carbs: parseFloat(manualMeal.carbs) || 0,
            fat: parseFloat(manualMeal.fat) || 0
        }
        await addMeal(newMeal)
        await saveToRecipesDisplay(newMeal)

        refresh() // Pull the new recipe immediately
        handleSuccess()
    }

    const handleSearchSubmit = async (e) => {
        if (e) e.preventDefault()
        if (!input.trim()) return
        setIsProcessing(true)
        setTimeout(async () => {
            const searchMeal = { name: input, meal_type: 'Search Result', calories: 350, protein: 20, carbs: 40, fat: 15 }
            await addMeal(searchMeal)
            await saveToRecipesDisplay(searchMeal)

            refresh()
            handleSuccess()
        }, 1000)
    }

    const handleSuccess = () => {
        setIsProcessing(false)
        setIsSuccess(true)
        setTimeout(() => {
            setIsSuccess(false)
            setInput('')
            setManualMeal({ name: '', calories: '', protein: '', carbs: '', fat: '' })
            setActiveMode('ai')
            onClose()
        }, 1500)
    }

    const modes = [
        { id: 'search', label: 'Search', icon: <Search size={20} /> },
        { id: 'manual', label: 'Manual', icon: <Plus size={20} /> }
    ]

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="absolute inset-0 bg-black/40 backdrop-blur-[40px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.button
                        onClick={onClose}
                        className="absolute top-14 right-8 w-11 h-11 rounded-full glass-card flex items-center justify-center text-white/40 hover:text-white transition-colors z-20"
                    >
                        <X size={22} />
                    </motion.button>

                    {/* AI Orb or Mode Icon */}
                    <motion.div
                        className="relative mb-14 z-10"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        <div className="orb-glow"></div>
                        <div className="relative w-36 h-36 rounded-full bg-accent-gradient p-[2px] animate-orb">
                            <div className="w-full h-full rounded-full bg-bg-primary flex items-center justify-center overflow-hidden">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 backdrop-blur-3xl flex items-center justify-center">
                                    {activeMode === 'ai' ? <Sparkles size={32} className="text-white/60 animate-pulse" /> :
                                        activeMode === 'manual' ? <Plus size={32} className="text-accent-primary" /> :
                                            <Search size={32} className="text-orange-400" />}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="text-center mb-12 z-10 w-full max-w-sm px-6">
                        <h2 className="text-3xl font-black mb-2 tracking-tight">
                            {isSuccess ? 'Logged!' : isProcessing ? 'Processing...' :
                                activeMode === 'ai' ? 'Listening...' :
                                    activeMode === 'manual' ? 'Quick Add' : 'Find Food'}
                        </h2>
                        <p className="text-text-secondary text-lg font-medium opacity-80 h-7 overflow-hidden">
                            {isSuccess ? 'Meal added successfully' :
                                activeMode === 'ai' ? 'What are we eating?' :
                                    `Use your ${activeMode} to log a meal`}
                        </p>
                    </div>

                    {activeMode === 'manual' ? (
                        <motion.form onSubmit={handleManualSubmit} className="w-full max-w-sm glass-card p-4 mb-10 z-10 shadow-2xl flex flex-col gap-3">
                            <input type="text" value={manualMeal.name} onChange={e => setManualMeal({ ...manualMeal, name: e.target.value })} placeholder="Meal name..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-accent-primary transition-colors" disabled={isProcessing || isSuccess} autoFocus />
                            <div className="grid grid-cols-2 gap-3">
                                <input type="number" value={manualMeal.calories} onChange={e => setManualMeal({ ...manualMeal, calories: e.target.value })} placeholder="Calories" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-accent-secondary transition-colors" disabled={isProcessing || isSuccess} />
                                <input type="number" value={manualMeal.protein} onChange={e => setManualMeal({ ...manualMeal, protein: e.target.value })} placeholder="Protein (g)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-protein transition-colors" disabled={isProcessing || isSuccess} />
                                <input type="number" value={manualMeal.carbs} onChange={e => setManualMeal({ ...manualMeal, carbs: e.target.value })} placeholder="Carbs (g)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-carbs transition-colors" disabled={isProcessing || isSuccess} />
                                <input type="number" value={manualMeal.fat} onChange={e => setManualMeal({ ...manualMeal, fat: e.target.value })} placeholder="Fat (g)" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-fat transition-colors" disabled={isProcessing || isSuccess} />
                            </div>
                            <button type="submit" disabled={isProcessing || isSuccess || !manualMeal.name || !manualMeal.calories} className="w-full py-4 mt-2 rounded-2xl bg-accent-primary text-bg-primary font-black uppercase tracking-widest flex items-center justify-center disabled:opacity-50 transition-all active:scale-[0.98]">
                                {isSuccess ? <Check size={20} /> : isProcessing ? <Loader2 size={18} className="animate-spin" /> : "Add Meal"}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.form
                            onSubmit={activeMode === 'search' ? handleSearchSubmit : handleAISubmit}
                            className="w-full max-w-sm glass-card p-1.5 mb-10 z-10 shadow-2xl relative"
                        >
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={activeMode === 'search' ? "Search for food..." : "Describe your meal..."}
                                    className="w-full bg-transparent border-none outline-none p-4 pb-4.5 text-white placeholder:text-white/20 font-medium"
                                    autoFocus
                                    disabled={isProcessing || isSuccess}
                                />
                                <button
                                    type="submit"
                                    disabled={isProcessing || isSuccess || !input.trim()}
                                    className={`absolute right-3 w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isSuccess ? 'bg-accent-secondary text-white' : 'bg-accent-primary text-bg-primary hover:opacity-90 disabled:opacity-30'}`}
                                >
                                    {isSuccess ? <Check size={20} /> : isProcessing ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={20} />}
                                </button>
                            </div>
                        </motion.form>
                    )}

                    {/* Quick Mode Switcher */}
                    <div className="grid grid-cols-3 gap-4 w-full max-w-sm z-10">
                        {modes.map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => setActiveMode(mode.id)}
                                className={`glass-card py-5 flex flex-col items-center gap-2.5 transition-all ${activeMode === mode.id ? 'bg-white/10 border-accent-secondary/30' : 'opacity-60 hover:opacity-100'}`}
                            >
                                <div className={`${activeMode === mode.id ? 'text-accent-secondary' : 'text-white/40'}`}>
                                    {mode.icon}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{mode.label}</span>
                            </button>
                        ))}
                    </div>

                    {activeMode !== 'ai' && (
                        <button
                            onClick={() => setActiveMode('ai')}
                            className="mt-8 z-10 text-[10px] font-black uppercase tracking-[0.3em] text-accent-primary animate-pulse"
                        >
                            Return to AI Mode
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default AIInteractionOverlay
