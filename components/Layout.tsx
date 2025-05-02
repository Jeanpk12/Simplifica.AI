import Navbar from './Navbar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
