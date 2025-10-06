import { Edit, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

const WriteArticles = () => {
  const articlelength = [
    { length: 800, text: 'Short (500-800 words)' },
    { length: 1200, text: 'Medium (800-1200 words)' },
    { length: 1500, text: 'Long (1200+ words)' }
  ]
  const [selectedLength, setSelectedLength] = useState(articlelength[0])
  const [input, setInput] = useState('');

  const onsubmithandler = async (e) => {
    e.preventDefault();
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* Left Col */}
      <form onSubmit={onsubmithandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3 mb-6'>
          <Sparkles className='w-6 text-[#1f8eef]' />
          <h1 className='font-semibold text-xl'>Article Configuration</h1>
        </div>
        <p className='mb-2 text-sm font-medium'>Article Topic</p>
        <input onChange={(e) => setInput(e.target.value)} value={input} type="text" className='w-full mb-4 p-2 px-3 outline-none text-sm rounded-md border border-gray-300' placeholder='The future of artificial intelligence is...' required />
        <p className='text-sm font-medium mb-3'>Article Length</p>
        <div className='flex gap-3 flex-wrap sm:max-w-9/11'>
          {articlelength.map((item, idx) => (
            <span onClick={() => setSelectedLength(item)} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedLength.text === item.text ? 'bg-blue-50 text-blue-700' : 'text-gray-500 border-gray-300'}`} key={idx}>{item.text}</span>
          ))}
        </div>
        <br />
        <button className='w-full flex justify-center items-center gap-2 bg-[linear-gradient(to_right,#2A65F5,#19D7B5)] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          <Edit className='w-5' />Generate Article
        </button>
      </form>
      {/* Right Col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3'>
          <Edit className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Generated Article</h1>
        </div>
        <div className='flex-1 flex justify-center items-center'>
          <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
            <Edit className='w-9 h-9' />
            <p>Enter a topic and click "Generate article" to get started</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WriteArticles
