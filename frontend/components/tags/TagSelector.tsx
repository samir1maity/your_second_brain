"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { HexColorPicker } from "react-colorful"
import { X, Plus } from "lucide-react"

interface Tag {
  name: string
  color: string
}

const predefinedTags: Tag[] = [
  { name: "Work", color: "#ff6b6b" },
  { name: "Personal", color: "#4ecdc4" },
  { name: "Important", color: "#f9d56e" },
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
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <Button
            key={tag.name}
            variant="outline"
            className="text-sm"
            style={{ borderColor: tag.color, color: tag.color }}
            onClick={() => addTag(tag)}
          >
            {tag.name}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => {
          const tagObj = allTags.find((t) => t.name === tag)
          return (
            <Badge
              key={tag}
              variant="secondary"
              className="text-sm py-1 px-2"
              style={{ backgroundColor: tagObj?.color, color: "#ffffff" }}
            >
              {tag}
              <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
            </Badge>
          )
        })}
      </div>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
          placeholder="New tag name"
          className="flex-grow"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[80px]" style={{ backgroundColor: newTagColor }}>
              Color
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <HexColorPicker color={newTagColor} onChange={setNewTagColor} />
          </PopoverContent>
        </Popover>
        <Button onClick={createCustomTag} disabled={!newTagName}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

