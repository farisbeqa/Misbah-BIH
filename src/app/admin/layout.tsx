export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The admin pages always stay light, also when the public site is in dark mode
  return (
    <div className="min-h-screen bg-gray-50 text-[#241F1D] [color-scheme:light]">
      {children}
    </div>
  )
}
