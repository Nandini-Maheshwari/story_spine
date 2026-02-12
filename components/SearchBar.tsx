"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"

interface SearchBarProps {
  onSearch: (query: string) => void
  onClear: () => void
  isLoading: boolean
}

export default function SearchBar({ onSearch, onClear, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed.length > 0) {
      onSearch(trimmed)
    }
  }

  function handleClear() {
    setQuery("")
    onClear()
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-muted pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books by title, author, or genre"
          className="w-full pl-12 pr-20 py-3.5 text-base border border-border rounded-lg text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-14 p-1 text-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || query.trim().length === 0}
          className="absolute right-2 px-3 py-1.5 text-sm font-medium bg-accent text-white rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? "..." : "Search"}
        </button>
      </div>
    </form>
  )
}
