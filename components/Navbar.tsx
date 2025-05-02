'use client'

import { Github } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-xl font-bold text-gray-800 dark:text-white">Simplifica.AI</span>
        </div>
        <a
          href="https://github.com/Jeanpk12" // Substitua pelo seu repositório
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          aria-label="GitHub"
        >
          <Github className="w-5 h-5" />
        </a>
      </div>
    </nav>
  )
}

function Logo() {
  return (
    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 12l18-9-4 18-5-5-5 5z" />
    </svg>
  )
}
