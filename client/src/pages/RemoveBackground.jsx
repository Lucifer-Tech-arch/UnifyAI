import { Eraser, Sparkles } from 'lucide-react';
import React, { useState } from 'react'

const RemoveBackground = () => {
  const [input, setInput] = useState('');

  const onsubmithandler = async (e) => {
    e.preventDefault();
  }
  return (
  
      <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
        {/* Left Col */}
        <form onSubmit={onsubmithandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
          <div className='flex items-center gap-3 mb-6'>
            <Sparkles className='w-6 text-[#FF4938]' />
            <h1 className='font-semibold text-xl'>AI Background Removal</h1>
          </div>
          <p className='mb-2 text-sm font-medium'>Upload Image</p>
          <input onChange={(e) => setInput(e.target.files[0])} type="file" accept='image/*' className='w-full mb-1 text-gray-600 p-2 px-3 outline-none text-sm rounded-md border border-gray-300' required />
          <p className='font-light text-xs text-gray-500'>Supports JPG, PNG, and other image formets</p>
          <br />
          <button className='w-full flex justify-center items-center gap-2 bg-[linear-gradient(to_right,#F6AB41,#FF4938)] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
            <Eraser className='w-5' />Remove Background
          </button>
        </form>
        {/* Right Col */}
        <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
          <div className='flex items-center gap-3'>
            <Eraser className='w-5 h-5 text-[#FF4938]' />
            <h1 className='text-xl font-semibold'>Proccessed Image</h1>
          </div>
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Eraser className='w-9 h-9' />
              <p>Enter a topic and click "Remove Background" to get started</p>
            </div>
          </div>
        </div>
      </div>

  )
}

export default RemoveBackground
