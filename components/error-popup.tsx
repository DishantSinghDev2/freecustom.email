import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface ErrorPopupProps {
  message: string
  onClose: () => void
}

export function ErrorPopup({ message, onClose }: ErrorPopupProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md flex items-center">
      <span>{message}</span>
      <Button variant="ghost" size="sm" className="ml-2" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

