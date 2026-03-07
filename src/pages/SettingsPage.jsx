import React, { useState } from 'react'
import { User, Shield, Bell, HelpCircle, LogOut, ChevronRight, Target, Loader2, Save } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNutrition } from '../context/NutritionContext'
import Modal from '../components/common/Modal'
import { supabase } from '../supabaseClient'

const SettingsPage = () => {
    const { profile, goals, loading, updateGoals, refresh, signOut } = useNutrition()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
    const [editGoals, setEditGoals] = useState(null)
    const [editProfile, setEditProfile] = useState(null)

    if (loading || !profile || !goals) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="animate-spin text-accent-primary" size={40} />
            </div>
        )
    }

    const handleEditStart = () => {
        setEditGoals({ ...goals })
        setIsEditModalOpen(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        await updateGoals(editGoals)
        setIsEditModalOpen(false)
    }

    const handleProfileSave = async (e) => {
        e.preventDefault()
        try {
            // Update profile in Supabase
            const { error } = await supabase.from('profiles').update({
                name: editProfile.name,
                weight_kg: parseFloat(editProfile.weight_kg),
                activity_level: editProfile.activity_level,
                goal_type: editProfile.goal_type
            }).eq('user_id', profile.user_id)

            if (!error) refresh()
            setIsProfileModalOpen(false)
        } catch (err) { console.error(err) }
    }

    const sections = [
        {
            label: 'Nutritional Goals',
            icon: <Target size={18} />,
            color: 'text-accent-secondary',
            bg: 'bg-accent-secondary/10',
            value: `${goals.calories} kcal`,
            onClick: handleEditStart
        },
        { label: 'Privacy & Security', icon: <Shield size={18} />, color: 'text-accent-primary', bg: 'bg-accent-primary/10' },
        { label: 'Notifications', icon: <Bell size={18} />, color: 'text-orange-400', bg: 'bg-orange-400/10' },
        { label: 'Help & Support', icon: <HelpCircle size={18} />, color: 'text-white/60', bg: 'bg-white/5' }
    ]

    return (
        <div className="flex-1 w-full max-w-md mx-auto px-6 pt-12 pb-32 animate-in fade-in slide-up">
            <header className="mb-10 text-center">
                <h1 className="text-3xl font-extrabold tracking-tight">Profile</h1>
            </header>

            <section
                onClick={() => {
                    setEditProfile({ ...profile })
                    setIsProfileModalOpen(true)
                }}
                className="mb-10 glass-card p-6 flex items-center gap-5 glass-card-hover group cursor-pointer"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-accent-gradient blur-[15px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="w-20 h-20 rounded-3xl bg-accent-gradient p-[1.5px] relative">
                        <div className="w-full h-full rounded-[22px] bg-bg-primary flex items-center justify-center overflow-hidden">
                            <User size={36} className="text-white/20" />
                        </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent-secondary border-[3px] border-bg-primary shadow-xl"></div>
                </div>
                <div>
                    <h2 className="text-xl font-extrabold tracking-tight">{profile.name || 'Mark Johnson'}</h2>
                    <p className="text-text-secondary text-sm font-medium opacity-80">{profile.goal_type} Weight • {profile.activity_level}</p>
                </div>
            </section>

            <section className="flex flex-col gap-2.5 mb-10">
                {sections.map((item, idx) => (
                    <motion.button
                        key={idx}
                        onClick={item.onClick}
                        className="glass-card p-4.5 flex items-center justify-between group glass-card-hover"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.05 * idx }}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-[14px] ${item.bg} flex items-center justify-center ${item.color} shadow-sm group-hover:scale-105 transition-transform`}>
                                {item.icon}
                            </div>
                            <div>
                                <span className="font-bold text-[15px] block opacity-90 group-hover:opacity-100 transition-opacity">{item.label}</span>
                                {item.value && <span className="text-[10px] text-text-secondary font-black uppercase tracking-widest leading-none">{item.value}</span>}
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-white/10 group-hover:text-white/40 transition-all translate-x-0 group-hover:translate-x-0.5" />
                    </motion.button>
                ))}
            </section>

            <button
                onClick={signOut}
                className="w-full glass-card p-4.5 flex items-center justify-center gap-2.5 text-fat hover:bg-fat/10 transition-all duration-300 border-fat/10 group"
            >
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-black text-sm uppercase tracking-widest">Sign Out</span>
            </button>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Update Goals">
                {editGoals && (
                    <form onSubmit={handleSave} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary block mb-2">Daily Calories</label>
                                <input
                                    type="number"
                                    value={editGoals.calories}
                                    onChange={(e) => setEditGoals({ ...editGoals, calories: parseInt(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xl font-bold outline-none focus:border-accent-secondary"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary block mb-2">Protein (g)</label>
                                <input
                                    type="number"
                                    value={editGoals.protein}
                                    onChange={(e) => setEditGoals({ ...editGoals, protein: parseInt(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold outline-none focus:border-accent-secondary"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary block mb-2">Carbs (g)</label>
                                <input
                                    type="number"
                                    value={editGoals.carbs}
                                    onChange={(e) => setEditGoals({ ...editGoals, carbs: parseInt(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold outline-none focus:border-accent-secondary"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary block mb-2">Fat (g)</label>
                                <input
                                    type="number"
                                    value={editGoals.fat}
                                    onChange={(e) => setEditGoals({ ...editGoals, fat: parseInt(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold outline-none focus:border-accent-secondary"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary block mb-2">Water (ml)</label>
                                <input
                                    type="number"
                                    value={editGoals.water_ml}
                                    onChange={(e) => setEditGoals({ ...editGoals, water_ml: parseInt(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold outline-none focus:border-accent-secondary"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 rounded-2xl bg-accent-secondary text-bg-primary font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
                        >
                            <Save size={18} />
                            Save Targets
                        </button>
                    </form>
                )}
            </Modal>

            <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Edit Profile">
                {editProfile && (
                    <form onSubmit={handleProfileSave} className="space-y-5">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary block mb-2">Display Name</label>
                                <input
                                    type="text"
                                    value={editProfile.name}
                                    onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold outline-none focus:border-accent-primary"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary block mb-2">Current Weight (kg)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={editProfile.weight_kg}
                                        onChange={(e) => setEditProfile({ ...editProfile, weight_kg: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold outline-none focus:border-accent-primary"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary block mb-2">Activity Level</label>
                                    <select
                                        value={editProfile.activity_level}
                                        onChange={(e) => setEditProfile({ ...editProfile, activity_level: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 font-bold outline-none focus:border-accent-primary appearance-none"
                                    >
                                        {['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'].map(level => (
                                            <option key={level} value={level} className="bg-bg-primary">{level}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 rounded-2xl bg-accent-primary text-bg-primary font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
                        >
                            <Save size={18} />
                            Update Profile
                        </button>
                    </form>
                )}
            </Modal>

            <p className="text-center text-[10px] text-text-secondary font-black uppercase tracking-[0.3em] mt-12 pb-12 opacity-40">
                Cal AI Clone • Build v1.4.2
            </p>
        </div>
    )
}

export default SettingsPage
