import React from 'react'
import { motion } from 'framer-motion'
import { WEIGHT_HISTORY, CALORIE_TRENDS } from '../data/mockData'
import { TrendingUp, Flame, Target, ChevronLeft, Loader2 } from 'lucide-react'
import { useNutrition } from '../context/NutritionContext'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'

const ProgressPage = () => {
    const { loading: contextLoading, user, goals, profile } = useNutrition()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeRange, setActiveRange] = useState('week')

    const fetchStats = async (range) => {
        if (!user) return
        setLoading(true)
        try {
            const now = new Date()
            let startDate = new Date()
            if (range === 'week') startDate.setDate(now.getDate() - 7)
            else if (range === 'month') startDate.setMonth(now.getMonth() - 1)
            else if (range === 'year') startDate.setFullYear(now.getFullYear() - 1)

            const [weightRes, mealsRes] = await Promise.all([
                supabase.from('weight_history').select('*').eq('user_id', user.id).gte('recorded_at', startDate.toISOString().split('T')[0]).order('recorded_at', { ascending: true }),
                supabase.from('meal_logs').select('*').eq('user_id', user.id).gte('logged_at', startDate.toISOString()).order('logged_at', { ascending: true })
            ])

            // Group meals by day for calorie trends
            const trendsMap = {}
            mealsRes.data?.forEach(meal => {
                const day = new Date(meal.logged_at).toLocaleDateString([], { weekday: 'short' })
                if (!trendsMap[day]) trendsMap[day] = { day, consumed: 0, target: goals?.calories || 2000 }
                trendsMap[day].consumed += meal.calories
            })

            setStats({
                weight_history: weightRes.data || [],
                calorie_trends: Object.values(trendsMap).slice(-7) // Show last 7 active days
            })
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) fetchStats(activeRange)
    }, [activeRange, user])

    if (loading || contextLoading || !stats) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="animate-spin text-accent-primary" size={40} />
            </div>
        )
    }

    return (
        <div className="flex-1 w-full max-w-md mx-auto px-6 pt-12 pb-32 animate-in fade-in slide-up">
            <header className="mb-10 text-center">
                <h1 className="text-3xl font-extrabold tracking-tight">Analytics</h1>
                <div className="mt-6 flex overflow-hidden p-[1.5px] bg-white/[0.04] rounded-[18px] border border-white/[0.06] backdrop-blur-md">
                    {['week', 'month', 'year'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setActiveRange(range)}
                            className={`flex-1 py-2.5 text-xs font-bold rounded-2xl transition-all duration-300 capitalize ${activeRange === range ? 'bg-white/[0.08] text-white shadow-sm' : 'text-text-secondary hover:text-white/60'}`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </header>

            {/* Weight Insight Card */}
            <section className="mb-10">
                <div className="glass-card p-6 relative overflow-hidden group glass-card-hover">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/10 blur-[40px] -mr-16 -mt-16 group-hover:bg-accent-primary/20 transition-all duration-500"></div>

                    <div className="flex justify-between items-start mb-10 relative z-10">
                        <div>
                            <p className="text-text-secondary text-[11px] font-bold uppercase tracking-[0.2em] mb-1 opacity-70">Current Weight</p>
                            <h3 className="text-3xl font-black tabular tracking-tight">
                                {stats.weight_history[stats.weight_history.length - 1]?.weight || profile?.weight_kg || '0.0'}
                                <span className="text-sm font-medium text-text-secondary"> kg</span>
                            </h3>
                        </div>
                        <div className="bg-accent-secondary/15 text-accent-secondary px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider">
                            <TrendingUp size={14} /> -1.5kg
                        </div>
                    </div>

                    {/* Animated Weight Chart */}
                    <div className="h-28 w-full flex items-end gap-2.5 px-1 relative z-10">
                        {stats.weight_history.map((item, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center group/bar">
                                <motion.div
                                    className="w-full bg-accent-gradient opacity-20 rounded-t-[4px] group-hover/bar:opacity-40 transition-opacity"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(item.weight / 90) * 100}%` }}
                                    transition={{ duration: 1.2, delay: 0.1 * idx, ease: [0.16, 1, 0.3, 1] }}
                                />
                                <div className="w-2 h-2 rounded-full bg-accent-primary mt-3 shadow-[0_0_10px_rgba(124,92,252,0.5)]"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Quick Grid */}
            <section className="grid grid-cols-2 gap-4 mb-10">
                {[
                    { label: 'Streak', value: '12 Days', icon: <Flame size={18} />, color: 'text-orange-400', bg: 'bg-orange-400/10' },
                    { label: 'Consistency', value: '94%', icon: <Target size={18} />, color: 'text-accent-secondary', bg: 'bg-accent-secondary/10' }
                ].map((stat, idx) => (
                    <div key={idx} className="glass-card p-5 flex flex-col gap-3 glass-card-hover">
                        <div className={`w-10 h-10 rounded-[14px] ${stat.bg} flex items-center justify-center ${stat.color} shadow-inner`}>
                            {stat.icon}
                        </div>
                        <div>
                            <span className="text-text-secondary text-[10px] font-bold uppercase tracking-widest block mb-1 opacity-70">{stat.label}</span>
                            <span className="text-xl font-black">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </section>

            {/* Calorie Trends */}
            <section className="mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-5">Calorie History</h3>
                <div className="glass-card p-4 h-64 flex flex-col pt-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.calorie_trends} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorConsumed" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7c5cfc" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#7c5cfc" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#8b8d96', fontWeight: 900, textTransform: 'uppercase' }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#8b8d96', fontWeight: 900 }}
                                dx={-10}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1b23', borderColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', fontWeight: 'bold' }}
                                itemStyle={{ color: '#fff', fontSize: '14px' }}
                                labelStyle={{ color: '#8b8d96', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}
                                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" strokeDasharray="4 4" />
                            {stats.calorie_trends[0] && (
                                <ReferenceLine y={stats.calorie_trends[0].target} stroke="rgba(0,255,150,0.3)" strokeDasharray="3 3" label={{ position: 'top', value: 'TARGET', fill: 'rgba(0,255,150,0.5)', fontSize: 8, fontWeight: 900, tracking: 'widest' }} />
                            )}
                            <Line
                                type="monotone"
                                dataKey="consumed"
                                name="Cal"
                                stroke="#7c5cfc"
                                strokeWidth={3}
                                dot={{ fill: '#7c5cfc', stroke: '#1a1b23', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, fill: '#fff', stroke: '#7c5cfc', strokeWidth: 2 }}
                                animationDuration={1500}
                                animationEasing="ease-in-out"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>
        </div>
    )
}

export default ProgressPage
