import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Clock, Utensils, Heart, Plus, ChevronRight } from 'lucide-react'
import { supabase } from '../supabaseClient'
import { useNutrition } from '../context/NutritionContext'

const RecipesPage = () => {
    const { addMeal, recipes } = useNutrition()
    const [searchQuery, setSearchQuery] = useState('')

    const handleAddRecipeToTimeline = async (recipe) => {
        await addMeal({
            name: recipe.name,
            meal_type: 'Other',
            calories: recipe.calories,
            protein: recipe.protein,
            carbs: recipe.carbs,
            fat: recipe.fat
        })
    }

    const filteredRecipes = recipes.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex-1 w-full max-w-md mx-auto px-6 pt-12 pb-32 animate-in fade-in slide-up">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold tracking-tight mb-6">Recipes</h1>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-secondary group-focus-within:text-accent-primary transition-colors">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search healthy meals..."
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary/50 transition-all backdrop-blur-md"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            <section className="space-y-4">
                {filteredRecipes.map((recipe, idx) => (
                    <motion.div
                        key={recipe.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-4 flex items-center gap-4 glass-card-hover group cursor-pointer"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-accent-gradient flex items-center justify-center text-white shadow-lg shadow-accent-primary/10">
                            <Utensils size={24} />
                        </div>

                        <div className="flex-1">
                            <h4 className="font-bold text-sm mb-1 group-hover:text-accent-primary transition-colors">{recipe.name}</h4>
                            <div className="flex items-center gap-3 text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-70">
                                <span className="flex items-center gap-1"><Clock size={12} /> 15 MIN</span>
                                <span className="flex items-center gap-1 text-accent-secondary">{recipe.calories} KCAL</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <span className="px-2 py-0.5 rounded-md bg-protein/10 text-protein text-[9px] font-black uppercase tracking-tighter tabular">{recipe.protein}g P</span>
                                <span className="px-2 py-0.5 rounded-md bg-carbs/10 text-carbs text-[9px] font-black uppercase tracking-tighter tabular">{recipe.carbs}g C</span>
                                <span className="px-2 py-0.5 rounded-md bg-fat/10 text-fat text-[9px] font-black uppercase tracking-tighter tabular">{recipe.fat}g F</span>
                            </div>
                        </div>

                        <button onClick={() => handleAddRecipeToTimeline(recipe)} className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center text-text-secondary transition-all hover:bg-accent-primary hover:text-bg-primary hover:scale-110 active:scale-95">
                            <Plus size={18} />
                        </button>
                    </motion.div>
                ))}
            </section>


        </div>
    )
}

export default RecipesPage
