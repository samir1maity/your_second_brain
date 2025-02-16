"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HexColorPicker } from "react-colorful"
import { X, Plus, Check } from "lucide-react"

interface Tag {
  name: string
  color: string
}

const predefinedTags: Tag[] = [
  { name: "Technology", color: "#ff6b6b" },
  { name: "Programming", color: "#4ecdc4" },
]

interface TagSelectorProps {
  selectedTags: string[]
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>
}

export function TagSelector({ selectedTags, setSelectedTags }: TagSelectorProps) {
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#000000")
  const [customTags, setCustomTags] = useState<Tag[]>([])

  const addTag = (tag: Tag) => {
    if (!selectedTags.includes(tag.name)) {
      setSelectedTags([...selectedTags, tag.name])
    }
  }

  const removeTag = (tagName: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagName))
  }

  const createCustomTag = () => {
    if (newTagName && !selectedTags.includes(newTagName)) {
      const newTag = { name: newTagName, color: newTagColor }
      setCustomTags([...customTags, newTag])
      setSelectedTags([...selectedTags, newTagName])
      setNewTagName("")
    }
  }

  const allTags = [...predefinedTags, ...customTags]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-gray-50 rounded-md border border-gray-200">
        {selectedTags.map((tag) => {
          const tagObj = allTags.find((t) => t.name === tag)
          return (
            <Badge
              key={tag}
              variant="secondary"
              className="text-sm py-1 px-2 flex items-center gap-1"
              style={{ backgroundColor: tagObj?.color, color: "#ffffff" }}
            >
              {tag}
              <X
                className="h-3 w-3 cursor-pointer hover:text-gray-200 transition-colors"
                onClick={() => removeTag(tag)}
              />
            </Badge>
          )
        })}
        {selectedTags.length === 0 && <span className="text-sm text-gray-400">No tags selected</span>}
      </div>
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Available Tags</h4>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isSelected = selectedTags.includes(tag.name)
            return (
              <Button
                key={tag.name}
                variant="outline"
                size="sm"
                className={`text-xs font-normal ${isSelected ? "bg-gray-100" : "bg-white"}`}
                style={{
                  borderColor: tag.color,
                  color: tag.color,
                }}
                onClick={() => addTag(tag)}
              >
                {tag.name}
                {isSelected && <Check className="ml-1 h-3 w-3" />}
              </Button>
            )
          })}
        </div>
      </div>
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Create Custom Tag</h4>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="New tag name"
            className="flex-grow text-sm"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="w-[80px]" style={{ backgroundColor: newTagColor }}>
                <span className="sr-only">Pick color</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <HexColorPicker color={newTagColor} onChange={setNewTagColor} />
            </PopoverContent>
          </Popover>
          <Button size="sm" onClick={createCustomTag} disabled={!newTagName}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

