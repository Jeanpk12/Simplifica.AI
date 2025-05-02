'use client'

import { useState, useTransition, useRef, useEffect, useCallback } from 'react'
import { simplifyText } from '../app/actions/simplify'
import ReactMarkdown from 'react-markdown'
import { ClipboardPaste, Rocket, Loader2, ChevronDown, Pencil } from 'lucide-react'

export default function TextSimplifier() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isPending, startTransition] = useTransition()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isInputExpanded, setIsInputExpanded] = useState(true)

  const adjustTextareaHeight = useCallback((element: HTMLTextAreaElement | null) => {
    if (element) {
      element.style.height = 'auto'
      const computedStyle = window.getComputedStyle(element)
      const paddingTop = parseInt(computedStyle.paddingTop, 10)
      const paddingBottom = parseInt(computedStyle.paddingBottom, 10)
      const borderTop = parseInt(computedStyle.borderTopWidth, 10)
      const borderBottom = parseInt(computedStyle.borderBottomWidth, 10)
      const verticalPaddingAndBorder = paddingTop + paddingBottom + borderTop + borderBottom
      const maxHeight = parseInt(computedStyle.maxHeight, 10) || Infinity
      const neededHeight = element.scrollHeight - verticalPaddingAndBorder
      const newHeight = Math.min(neededHeight, maxHeight - verticalPaddingAndBorder)
      element.style.height = `${Math.max(newHeight, 24)}px`
    }
  }, [])

  const handlePaste = async () => {
    if (!isInputExpanded) setIsInputExpanded(true)
    try {
      const text = await navigator.clipboard.readText()
      setInput(text)
      setTimeout(() => {
        if (textareaRef.current) {
            textareaRef.current.focus()
            adjustTextareaHeight(textareaRef.current)
        }
      }, 0)
    } catch (err) {
      console.error('Falha ao ler da área de transferência:', err)
      setOutput('Erro ao colar da área de transferência.')
    }
  }

  const handleSimplify = useCallback(() => {
    if (!input.trim() || !isInputExpanded || isPending) return
    startTransition(async () => {
      try {
        const simplified = await simplifyText(input)
        setOutput(simplified)
        setInput('')
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
        }
      } catch (error) {
        console.error('Erro ao simplificar texto:', error)
        setOutput('Ocorreu um erro ao processar o texto. Tente novamente.')
      }
    })
  }, [input, isInputExpanded, isPending, startTransition, simplifyText]) // Added simplifyText to dependencies

  useEffect(() => {
    if (isInputExpanded) {
        adjustTextareaHeight(textareaRef.current)
    } else {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }, [input, isInputExpanded, adjustTextareaHeight])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSimplify()
    }
  }

  const toggleInputExpansion = () => {
    setIsInputExpanded(!isInputExpanded)
  }

  const baseIconButtonClasses = "flex-shrink-0 h-11 w-11 sm:h-12 sm:w-12 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-950 focus:ring-blue-500 transition-all duration-200 ease-in-out"
  const secondaryIconButtonClasses = `${baseIconButtonClasses} text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600`
  const primaryIconButtonClasses = `${baseIconButtonClasses} text-white ${
    isPending || !input.trim()
      ? 'bg-blue-400 dark:bg-blue-800 cursor-not-allowed opacity-70'
      : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
  }`

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 pt-8 pb-40 sm:pb-36">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Simplificador de Texto
        </h1>
        {output && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-5 sm:p-8">
              <ReactMarkdown
                components={{
                    h1: ({ node, ...props }: any) => <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900 dark:text-gray-50" {...props} />,
                    h2: ({ node, ...props }: any) => <h2 className="text-xl font-semibold mt-5 mb-3 text-gray-800 dark:text-gray-100" {...props} />,
                    h3: ({ node, ...props }: any) => <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-700 dark:text-gray-200" {...props} />,
                    p: ({ node, ...props }: any) => <p className="text-base mt-2 mb-4 leading-relaxed text-gray-700 dark:text-gray-300" {...props} />,
                    ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 mt-2 mb-4 space-y-1 text-gray-700 dark:text-gray-300" {...props} />,
                    ol: ({ node, ...props }: any) => <ol className="list-decimal pl-6 mt-2 mb-4 space-y-1 text-gray-700 dark:text-gray-300" {...props} />,
                    li: ({ node, ...props }: any) => <li className="mt-1" {...props} />,
                    blockquote: ({ node, ...props }: any) => <blockquote className="border-l-4 border-blue-300 dark:border-blue-600 pl-4 py-2 my-4 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 rounded-r-md" {...props} />,
                    code: ({ inline, className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline ? (
                        <pre className="bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 p-4 rounded-lg overflow-x-auto my-4 text-sm shadow-inner border border-gray-200 dark:border-gray-700">
                          <code className={`language-${match ? match[1] : ''}`} {...props}>{String(children).replace(/\n$/, '')}</code>
                        </pre>
                      ) : (
                        <code className="bg-gray-200 dark:bg-gray-700 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-md mx-0.5 font-mono text-[0.9em]" {...props}>
                          {children}
                        </code>
                      )
                    },
                    a: ({ node, ...props }: any) => <a className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-1 focus:ring-blue-500 rounded" {...props} />,
                }}
              >
                {output}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <div
        className={`fixed z-50 transition-all duration-300 ease-in-out ${
          isInputExpanded
            ? 'bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-950 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.3)]'
            : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center cursor-pointer group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-950 focus:ring-blue-500'
        }`}
        onClick={!isInputExpanded ? toggleInputExpansion : undefined}
        onKeyDown={!isInputExpanded ? (e) => { if (e.key === 'Enter' || e.key === ' ') toggleInputExpansion() } : undefined}
        aria-label={!isInputExpanded ? "Expandir área de texto" : undefined}
        role={!isInputExpanded ? "button" : undefined}
        tabIndex={!isInputExpanded ? 0 : undefined}
      >
        {isInputExpanded ? (
          <div className="max-w-3xl w-full mx-auto flex items-end gap-2 sm:gap-3">
            <button
              onClick={toggleInputExpansion}
              className={secondaryIconButtonClasses}
              aria-label="Recolher área de texto"
            >
              <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={handlePaste}
              className={secondaryIconButtonClasses}
              aria-label="Colar texto"
            >
              <ClipboardPaste className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <textarea
              ref={textareaRef}
              className="flex-grow resize-none rounded-xl sm:rounded-2xl py-2.5 sm:py-3 px-3.5 sm:px-4 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-gray-600 max-h-32 sm:max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-500 scrollbar-track-gray-100 dark:scrollbar-track-gray-700 transition-colors duration-150"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Cole ou digite o texto aqui..."
              rows={1}
              style={{ height: 'auto', minHeight: '3rem', scrollbarWidth: 'none' }}
              tabIndex={0}
            />

            <button
              onClick={handleSimplify}
              disabled={isPending || !input.trim()}
              className={primaryIconButtonClasses}
              aria-label="Simplificar texto"
              tabIndex={0}
            >
              {isPending ? (
                <Loader2 className="animate-spin w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : (
                <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-white pointer-events-none transition-transform duration-200 group-hover:scale-110" />
          </div>
        )}
      </div>
    </>
  )
}
