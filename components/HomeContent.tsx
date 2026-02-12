"use client"

import { useState, useCallback } from "react"
import SearchBar from "@/components/SearchBar"
import SearchResultsGrid from "@/components/SearchResultsGrid"
import type { GoogleSearchResult } from "@/lib/google"

interface HomeContentProps {
  children: React.ReactNode
}

export default function HomeContent({ children }: HomeContentProps) {
  const [searchResults, setSearchResults] = useState<GoogleSearchResult[] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true)
    setSearchQuery(query)

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const { results }: { results: GoogleSearchResult[] } = await res.json()
      setSearchResults(results)
    } catch (err) {
      console.error("Search failed:", err)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleClear = useCallback(() => {
    setSearchResults(null)
    setSearchQuery("")
  }, [])

  const isSearchMode = searchResults !== null

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClear}
          isLoading={isLoading}
        />
      </div>

      {isSearchMode ? (
        <SearchResultsGrid results={searchResults} query={searchQuery} />
      ) : (
        children
      )}
    </div>
  )
}
