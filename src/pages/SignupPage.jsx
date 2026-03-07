import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { Loader2, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react'

const SignupPage = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    }
                }
            })
            if (error) throw error
            navigate('/dashboard')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex-1 w-full max-w-md mx-auto px-6 flex flex-col justify-center min-h-[80vh] animate-in fade-in slide-up">
            <div className="mb-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-[20px] bg-accent-primary/10 flex items-center justify-center text-accent-primary shadow-[0_0_25px_rgba(255,255,255,0.05)] mb-6">
                    <Sparkles size={32} strokeWidth={2.5} />
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-white text-center">Create Account</h1>
                <p className="text-[#8b8d96] text-sm font-bold uppercase tracking-widest mt-2">Start tracking today</p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-sm font-bold text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8b8d96] group-focus-within:text-white transition-colors">
                        <User size={20} />
                    </div>
                    <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#13141c] border border-white/[0.05] rounded-2xl py-4 pl-12 pr-4 text-white font-bold placeholder:text-[#8b8d96] focus:border-white focus:outline-none transition-colors"
                    />
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8b8d96] group-focus-within:text-white transition-colors">
                        <Mail size={20} />
                    </div>
                    <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#13141c] border border-white/[0.05] rounded-2xl py-4 pl-12 pr-4 text-white font-bold placeholder:text-[#8b8d96] focus:border-white focus:outline-none transition-colors"
                    />
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#8b8d96] group-focus-within:text-white transition-colors">
                        <Lock size={20} />
                    </div>
                    <input
                        type="password"
                        required
                        placeholder="Create Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#13141c] border border-white/[0.05] rounded-2xl py-4 pl-12 pr-4 text-white font-bold placeholder:text-[#8b8d96] focus:border-white focus:outline-none transition-colors"
                        minLength="6"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 py-4 rounded-2xl bg-white text-bg-primary font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                        <>
                            Get Started <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <p className="text-center text-[#8b8d96] font-bold mt-8 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-white hover:underline">
                    Log In
                </Link>
            </p>
        </div>
    )
}

export default SignupPage
