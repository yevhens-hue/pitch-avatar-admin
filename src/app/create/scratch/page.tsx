import React, { Suspense } from 'react'
import ScratchWizard from '@/components/Wizard/ScratchWizard'

export default function ScratchPresentationPage() {
  return (
    <Suspense fallback={<div>Loading wizard...</div>}>
      <ScratchWizard />
    </Suspense>
  )
}
