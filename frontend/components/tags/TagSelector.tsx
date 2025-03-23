"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Loader2, Tag } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getAllTags } from "@/Api/tags"

interface TagSelectorProps {
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
}

export function TagSelector({ selectedTags, setSelectedTags }: TagSelectorProps) {
  const [newTag, setNewTag] = useState("")
  const [existingTags, setExistingTags] = useState<Array<{ id: string; name: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  // Fetch existing tags only once when component mounts
  useEffect(() => {
    const fetchTags = async () => {
      if (user?.jwt_token) {
        try {
          setIsLoading(true)
          const tags = await getAllTags(user.jwt_token)
          setExistingTags(tags || [])
        } catch (error) {
          console.error("Error fetching tags:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchTags()
  }, [user?.jwt_token])

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags([...selectedTags, newTag.trim()])
      setNewTag("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const handleSelectExistingTag = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      setSelectedTags([...selectedTags, tagName])
    }
  }

  return (
    <div className="space-y-3">
      {/* Input for new tags */}
      <div className="flex space-x-2">
        <Input
          placeholder="Add a tag..."
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button 
          type="button" 
          onClick={handleAddTag} 
          size="sm"
          variant="outline"
          disabled={!newTag.trim()}
        >
          <Plus size={16} className="mr-1" />
          Add
        </Button>
      </div>

      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400">Selected tags:</p>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-2 py-1 flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-gray-400 hover:text-gray-200 rounded-full"
                >
                  <X size={14} />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Existing tags */}
      <div className="space-y-2">
        <p className="text-xs text-gray-400">Your existing tags:</p>
        {isLoading ? (
          <div className="flex items-center justify-center p-4 bg-[#1a1a1a] rounded-md">
            <Loader2 className="h-4 w-4 animate-spin mr-2 text-gray-400" />
            <span className="text-sm text-gray-400">Loading tags...</span>
          </div>
        ) : existingTags.length > 0 ? (
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-[#1a1a1a] rounded-md custom-scrollbar">
            {existingTags.map((tag) => (
              <Badge 
                key={tag.id} 
                variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                className="cursor-pointer hover:bg-[#252525] transition-colors"
                onClick={() => handleSelectExistingTag(tag.name)}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 bg-[#1a1a1a] rounded-md text-center">
            <Tag className="h-5 w-5 text-gray-400 mb-2" />
            <p className="text-sm text-gray-400">No existing tags found</p>
            <p className="text-xs text-gray-500 mt-1">Create your first tag using the input above</p>
          </div>
        )}
      </div>
    </div>
  )
}

