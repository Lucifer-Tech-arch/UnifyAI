import { Hash, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios';
import Markdown from 'react-markdown'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const BlogTitles = () => {

  const blogcategories = [
    'General', 'Technology', 'Business', 'Health', 'LifeStyle', 'Education', 'Travel', 'Food'
  ]
  const [selectedcategory, setSelectedCategory] = useState(blogcategories[0])
  const [input, setInput] = useState('');
  const [loading, setloading] = useState(false);
  const [content, setcontent] = useState('');

  const { getToken } = useAuth();

  const onsubmithandler = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const prompt = `Generate a Blog title for ${input} in category ${selectedcategory}`;
      const { data } = await axios.post('/api/ai/blog-titles', { prompt, category: selectedcategory }, { headers: { Authorization: `Bearer ${await getToken()}` } })
      if (data.success) {
        setloading(false)
        setcontent(data.content);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setloading(false);
    }
  }

  return (
    <div>
      <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
        {/* Left Col */}
        <form onSubmit={onsubmithandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
          <div className='flex items-center gap-3 mb-6'>
            <Sparkles className='w-6 text-[#8E37EB]' />
            <h1 className='font-semibold text-xl'>AI Title Generator</h1>
          </div>
          <p className='mb-2 text-sm font-medium'>Keyword</p>
          <input onChange={(e) => setInput(e.target.value)} value={input} type="text" className='w-full mb-4 p-2 px-3 outline-none text-sm rounded-md border border-gray-300' placeholder='The future of artificial intelligence is...' required />
          <p className='text-sm font-medium mb-3'>Category</p>
          <div className='flex gap-3 flex-wrap sm:max-w-9/11'>
            {blogcategories.map((item, idx) => (
              <span onClick={() => setSelectedCategory(item)} className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedcategory === item ? 'bg-purple-50 text-purple-700' : 'text-gray-500 border-gray-300'}`} key={idx}>{item}</span>
            ))}
          </div>
          <br />
          <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-[linear-gradient(to_right,#C341F6,#65ADFF)] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
            {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>: (<Hash className='w-5' />)}
            Generate Title
          </button>
        </form>
        {/* Right Col */}
        <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
          <div className='flex items-center gap-3'>
            <Hash className='w-5 h-5 text-[#8E37EB]' />
            <h1 className='text-xl font-semibold'>Generated Title</h1>
          </div>
          {!content ? (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Hash className='w-9 h-9' />
                <p>Enter a topic and click "Generate Title" to get started</p>
              </div>
            </div>
          ) : (
            <div className='mt-3 w-full overflow-y-scroll text-sm text-slate-600'>
              <div className='reset-tw'>
                <Markdown>{content}</Markdown>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default BlogTitles
