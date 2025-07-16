import { Loader2 } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className='fixed inset-0 flex gap-2 items-center justify-center'>
        <Loader2 className='h-6 w-6 animate-spin text-gra-800'/>
        <span className='text-sm font-medium text-gray-800'>Loading...</span>
      
    </div>
  )
}

export default Loading
