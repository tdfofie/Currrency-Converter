"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-2 border-white/50 dark:border-gray-700/50 rounded-full hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-2 border-white/50 dark:border-gray-700/50 rounded-xl shadow-lg">
        <DropdownMenuItem onClick={() => setTheme("light")} className="hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200">
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200">
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200">
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
