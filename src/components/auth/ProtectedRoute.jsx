import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useNutrition } from '../../context/NutritionContext'
import { Loader2 } from 'lucide-react'

const ProtectedRoute = () => {
    const { session, loading } = useNutrition()

    if (loading) {
        return (
            <div className="flex-1 min-h-screen flex items-center justify-center bg-bg-primary text-white">
                <Loader2 className="animate-spin text-accent-primary" size={40} />
            </div>
        )
    }

    return session ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
