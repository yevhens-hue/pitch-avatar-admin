import React, { Suspense } from 'react'
import VideoWizard from '@/components/Wizard/VideoWizard'

export default function VideoPresentationPage() {
  return (
    <Suspense fallback={<div>Loading wizard...</div>}>
      <VideoWizard />
    </Suspense>
  )
}
