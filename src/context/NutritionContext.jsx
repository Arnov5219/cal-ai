import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const NutritionContext = createContext()

export const useNutrition = () => useContext(NutritionContext)

export const NutritionProvider = ({ children }) => {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [goals, setGoals] = useState(null)
  const [meals, setMeals] = useState([])
  const [recipes, setRecipes] = useState([])
  const [water, setWater] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)

      let { data: profData, error: profError } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle()
      if (!profData || profError) {
        const defaultProf = { user_id: user.id, weight_kg: 70, height_cm: 170, activity_level: 'Moderate', goal_type: 'Maintain' }
        const { data: newProf, error: insertError } = await supabase.from('profiles').insert([defaultProf]).select().maybeSingle()
        profData = newProf || defaultProf
        if (insertError) console.error("Failed to insert profile", insertError)
      }

      let { data: goalsData, error: goalsError } = await supabase.from('daily_goals').select('*').eq('user_id', user.id).maybeSingle()
      if (!goalsData || goalsError) {
        const defaultGoals = { user_id: user.id, calories: 2000, protein: 150, carbs: 250, fat: 65, water_ml: 2000 }
        const { data: newGoals, error: insertError } = await supabase.from('daily_goals').insert([defaultGoals]).select().maybeSingle()
        goalsData = newGoals || defaultGoals
        if (insertError) console.error("Failed to insert goals", insertError)
      }

      const [mealsRes, waterRes, recipesRes] = await Promise.all([
        supabase.from('meal_logs').select('*').eq('user_id', user.id).gte('logged_at', startOfDay.toISOString()).order('logged_at', { ascending: false }),
        supabase.from('water_logs').select('*').eq('user_id', user.id).eq('recorded_at', today).maybeSingle(),
        supabase.from('recipes').select('*').order('created_at', { ascending: false })
      ])

      setProfile(profData)
      setGoals(goalsData)
      setMeals(mealsRes.data || [])
      setRecipes(recipesRes.data || [])
      setWater(waterRes.data ? waterRes.data.amount_ml : 0)
    } catch (err) {
      console.error('Failed to fetch nutrition data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (!session) setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const addMeal = async (mealData) => {
    if (!user) return
    try {
      const { error } = await supabase.from('meal_logs').insert([{ ...mealData, user_id: user.id }])
      if (!error) fetchData()
    } catch (err) {
      console.error('Failed to log meal', err)
    }
  }

  const deleteMeal = async (mealId) => {
    if (!user) return
    try {
      const { error } = await supabase.from('meal_logs').delete().eq('id', mealId).eq('user_id', user.id)
      if (!error) fetchData()
    } catch (err) {
      console.error('Failed to delete meal', err)
    }
  }

  const logWater = async (amount_ml) => {
    if (!user) return
    const today = new Date().toISOString().split('T')[0]
    try {
      // Upsert water log
      const { data: existing } = await supabase.from('water_logs').select('*').eq('user_id', user.id).eq('recorded_at', today).maybeSingle()

      if (existing) {
        await supabase.from('water_logs').update({ amount_ml: existing.amount_ml + amount_ml }).eq('id', existing.id)
      } else {
        await supabase.from('water_logs').insert([{ user_id: user.id, amount_ml, recorded_at: today }])
      }
      fetchData()
    } catch (err) {
      console.error('Failed to log water', err)
    }
  }

  const logWeight = async (weight) => {
    if (!user) return
    try {
      // Optimistic update
      setProfile(prev => prev ? { ...prev, weight_kg: weight } : prev)

      const [profRes, weightRes] = await Promise.all([
        supabase.from('profiles').update({ weight_kg: weight }).eq('user_id', user.id),
        supabase.from('weight_history').insert([{ user_id: user.id, weight }])
      ])
      if (profRes.error) console.error('Profile update error:', profRes.error)
      if (weightRes.error) console.error('Weight insert error:', weightRes.error)

      // Still fetch in background to ensure sync
      fetchData()
    } catch (err) {
      console.error('Failed to log weight', err)
    }
  }

  const updateGoals = async (goalData) => {
    if (!user) return
    try {
      const { error } = await supabase.from('daily_goals').upsert({ ...goalData, user_id: user.id }, { onConflict: 'user_id' })
      if (!error) fetchData()
    } catch (err) {
      console.error('Failed to update goals', err)
    }
  }

  const getDaySummary = () => {
    if (!goals) return null

    const consumed = meals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

    return {
      calories: { consumed: consumed.calories, target: goals.calories },
      protein: { consumed: consumed.protein, target: goals.protein },
      carbs: { consumed: consumed.carbs, target: goals.carbs },
      fat: { consumed: consumed.fat, target: goals.fat },
      water: { consumed: water, target: goals.water_ml }
    }
  }

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password })
  const signUp = (email, password) => supabase.auth.signUp({ email, password })
  const signOut = () => supabase.auth.signOut()

  return (
    <NutritionContext.Provider value={{
      session, user, profile, goals, meals, water, loading, recipes,
      addMeal, deleteMeal, logWater, logWeight, updateGoals,
      getDaySummary, refresh: fetchData,
      signIn, signUp, signOut
    }}>
      {children}
    </NutritionContext.Provider>
  )
}
