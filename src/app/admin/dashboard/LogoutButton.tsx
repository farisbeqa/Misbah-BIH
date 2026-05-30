'use client'

import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/admin'
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 text-green-300 hover:text-white text-sm transition-colors"
    >
      <LogOut size={14} />
      Odjava
    </button>
  )
}
