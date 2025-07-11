"use client"

import { QRCodeSVG } from 'qrcode.react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DialogTitle } from '@radix-ui/react-dialog'

interface QRCodeModalProps {
  email: string
  isOpen: boolean
  onClose: () => void
}

export function QRCodeModal({ email, isOpen, onClose }: QRCodeModalProps) {
  return (
    <Dialog open={isOpen}  onOpenChange={onClose}>
      <DialogTitle className='hidden'>Scan to send email</DialogTitle>
      <DialogContent className="sm:max-w-md max-w-full">
        <div className="flex flex-col items-center justify-center p-6">
          <QRCodeSVG
            value={`mailto:${email}`}
            size={200}
            level="L"
            className="dark:bg-white p-2 rounded-lg"
          />
          <p className="mt-4 text-sm text-muted-foreground">
            Scan to send email to {email}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

