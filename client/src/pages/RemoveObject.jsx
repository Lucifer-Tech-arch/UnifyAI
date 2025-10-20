import { Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios';
import Markdown from 'react-markdown'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const RemoveObject = () => {
  const [input, setInput] = useState('');
  const [object, setObject] = useState('');
  const [loading, setloading] = useState(false);
  const [content, setcontent] = useState('');

  const { getToken } = useAuth();

  const onsubmithandler = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      if (object.split(' ').length > 1) {
        return toast("Please enter only one object name!...");
      }
      const formdata = new FormData();
      formdata.append('image', input);
      formdata.append('object',object);
      const { data } = await axios.post('/api/ai/remove-object', formdata, { headers: { Authorization: `Bearer ${await getToken()}` } })
      if (data.success) {
        setloading(false);
        setcontent(data.content);
      }
    } catch (error) {
      console.log(error);
      setloading(false);
      return toast.error(error.message);
    }
  }
  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* Left Col */}
      <form onSubmit={onsubmithandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3 mb-6'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='font-semibold text-xl'>AI Object Removal</h1>
        </div>
        <p className='mb-2 text-sm font-medium'>Upload Image</p>
        <input onChange={(e) => setInput(e.target.files[0])} type="file" accept='image/*' className='w-full mb-6 text-gray-600 p-2 px-3 outline-none text-sm rounded-md border border-gray-300' required />
        <br />
        <p className='mb-2 text-sm font-medium'>Describe object name to remove</p>
        <textarea rows={4} onChange={(e) => setObject(e.target.value)} value={object} className='w-full mb-5 p-2 px-3 outline-none text-sm rounded-md border border-gray-300' placeholder='e.g., watch or spoon, Only single object name' required />
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-[linear-gradient(to_right,#417DF6,#8E37EB)] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
          {loading ? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <Scissors className='w-5' />}
          Remove Object
        </button>
      </form>
      {/* Right Col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
          <Scissors className='w-5 h-5 text-[#417DF6]' />
          <h1 className='text-xl font-semibold'>Proccessed Image</h1>
        </div>
        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Scissors className='w-9 h-9' />
              <p>Enter a topic and click "Remove Object" to get started</p>
            </div>
          </div>
        ): (
          <img src={content} className='w-full h-full mt-3' alt="" />
        )}
      </div>
    </div>
  )
}

export default RemoveObject
