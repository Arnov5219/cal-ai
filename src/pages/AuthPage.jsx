import React, { useState } from 'react'
import { useNutrition } from '../context/NutritionContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles } from 'lucide-react'

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const { signIn, signUp } = useNutrition()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            if (isLogin) {
                const { error } = await signIn(email, password)
                if (error) throw error
            } else {
                const { error } = await signUp(email, password)
                if (error) throw error
                // In Supabase, if email confirmation is on, they might need to check email
                if (!error) setIsLogin(true)
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-primary/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/20 rounded-full blur-[120px]"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-accent-gradient p-[1px] mb-6">
                        <div className="w-full h-full rounded-[23px] bg-bg-primary flex items-center justify-center">
                            <Sparkles size={32} className="text-accent-secondary" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Cal AI</h1>
                    <p className="text-text-secondary font-medium uppercase tracking-widest text-[10px] opacity-60">The future of calorie tracking</p>
                </div>

                <div className="glass-card p-8 backdrop-blur-xl">
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-1 text-center font-bold text-sm uppercase tracking-widest relative transition-all ${isLogin ? 'text-white' : 'text-white/40'}`}
                        >
                            Log In
                            {isLogin && <motion.div layoutId="authTab" className="absolute -bottom-2 left-0 right-0 h-1 bg-accent-secondary rounded-full" />}
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-1 text-center font-bold text-sm uppercase tracking-widest relative transition-all ${!isLogin ? 'text-white' : 'text-white/40'}`}
                        >
                            Sign Up
                            {!isLogin && <motion.div layoutId="authTab" className="absolute -bottom-2 left-0 right-0 h-1 bg-accent-secondary rounded-full" />}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    key="signup-name"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2"
                                >
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary block">Display Name</label>
                                    <div className="relative">
                                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:border-accent-primary transition-all"
                                            required
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary block">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:border-accent-primary transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary block">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:border-accent-primary transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-fat/10 border border-fat/20 text-fat p-4 rounded-xl text-xs font-bold text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 rounded-2xl bg-accent-gradient text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>{isLogin ? 'Log In' : 'Create Account'}</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-[10px] text-text-secondary font-black uppercase tracking-[0.3em] opacity-40">
                    Trusted by 100,000+ users
                </p>
            </motion.div>
        </div>
    )
}

export default AuthPage
