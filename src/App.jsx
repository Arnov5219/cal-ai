import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import ProgressPage from './pages/ProgressPage'
import SettingsPage from './pages/SettingsPage'
import RecipesPage from './pages/RecipesPage'
import TimelinePage from './pages/TimelinePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import BottomNav from './components/layout/BottomNav'
import AIInteractionOverlay from './components/meals/AIInteractionOverlay'
import { NutritionProvider, useNutrition } from './context/NutritionContext'
import { Loader2 } from 'lucide-react'

const AppContent = () => {
    const { session } = useNutrition()
    const [isAIOpen, setIsAIOpen] = useState(false)

    return (
        <div className="flex flex-col min-h-screen pb-20 overflow-x-hidden bg-bg-primary text-text-primary">
            <Routes>
                <Route path="/login" element={session ? <Navigate to="/" replace /> : <LoginPage />} />
                <Route path="/signup" element={session ? <Navigate to="/" replace /> : <SignupPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/progress" element={<ProgressPage />} />
                    <Route path="/recipes" element={<RecipesPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/timeline" element={<TimelinePage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {session && (
                <>
                    <BottomNav onAIClick={() => setIsAIOpen(true)} />
                    <AIInteractionOverlay isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
                </>
            )}
        </div>
    )
}

function App() {
    return (
        <NutritionProvider>
            <Router>
                <AppContent />
            </Router>
        </NutritionProvider>
    )
}

export default App
