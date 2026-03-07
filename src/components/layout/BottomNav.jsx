import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, BarChart2, User, Zap, Utensils } from 'lucide-react'

const BottomNav = ({ onAIClick }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-primary via-bg-primary/95 to-transparent px-6 flex items-end pb-8 pointer-events-none z-[80]">
            <div className="w-full max-w-md mx-auto h-[68px] glass-card shadow-2xl shadow-black/40 border-white/[0.08] flex items-center justify-around px-2 pointer-events-auto">
                <NavLink
                    to="/"
                    className={({ isActive }) => `flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ${isActive ? 'text-accent-primary bg-accent-primary/5' : 'text-white/30 hover:text-white/60'}`}
                >
                    {({ isActive }) => <Home size={22} strokeWidth={isActive ? 2.5 : 2} />}
                </NavLink>

                <NavLink
                    to="/progress"
                    className={({ isActive }) => `flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ${isActive ? 'text-accent-primary bg-accent-primary/5' : 'text-white/30 hover:text-white/60'}`}
                >
                    {({ isActive }) => <BarChart2 size={22} strokeWidth={isActive ? 2.5 : 2} />}
                </NavLink>

                {/* Central AI Orb Button */}
                <div className="relative -top-10 flex items-center justify-center group">
                    <div className="absolute inset-0 bg-accent-primary/20 blur-[25px] rounded-full group-hover:bg-accent-secondary/30 transition-colors duration-500"></div>
                    <button
                        onClick={onAIClick}
                        className="relative w-16 h-16 rounded-full bg-accent-gradient flex items-center justify-center text-white shadow-[0_12px_24px_rgba(124,92,252,0.4)] hover:scale-110 active:scale-95 transition-all duration-500 group-hover:shadow-[0_16px_32px_rgba(0,188,155,0.4)]"
                    >
                        <div className="absolute inset-0.5 rounded-full bg-black/20 backdrop-blur-md"></div>
                        <Zap size={28} className="relative z-10 fill-white" />
                    </button>
                </div>

                <NavLink
                    to="/recipes"
                    className={({ isActive }) => `flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ${isActive ? 'text-accent-primary bg-accent-primary/5' : 'text-white/30 hover:text-white/60'}`}
                >
                    {({ isActive }) => <Utensils size={22} strokeWidth={isActive ? 2.5 : 2} />}
                </NavLink>

                <NavLink
                    to="/settings"
                    className={({ isActive }) => `flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ${isActive ? 'text-accent-primary bg-accent-primary/5' : 'text-white/30 hover:text-white/60'}`}
                >
                    {({ isActive }) => <User size={22} strokeWidth={isActive ? 2.5 : 2} />}
                </NavLink>
            </div>
        </nav>
    )
}

export default BottomNav
