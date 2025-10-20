import { FileText, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios';
import Markdown from 'react-markdown'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const ReviewResume = () => {
  const [input, setInput] = useState('');
  const [loading, setloading] = useState(false);
  const [content, setcontent] = useState('');

  const { getToken } = useAuth();
  
    const onsubmithandler = async (e) => {
      e.preventDefault();
      setloading(true);
      try {
         const formdata = new FormData()
         formdata.append('resume',input);
         const {data} = await axios.post('/api/ai/review-resume',formdata,{headers: {Authorization: `Bearer ${await getToken()}`}})
         if(data.success) {
          setcontent(data.content);
          setloading(false);
         }

      } catch (error) {
          setloading(false)
          console.log(error);
          return toast.error(error.message);
      }
    }
  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
        {/* Left Col */}
        <form onSubmit={onsubmithandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
          <div className='flex items-center gap-3 mb-6'>
            <Sparkles className='w-6 text-[#00DA93]' />
            <h1 className='font-semibold text-xl'>AI Resume Review</h1>
          </div>
          <p className='mb-2 text-sm font-medium'>Upload Resume</p>
          <input onChange={(e) => setInput(e.target.files[0])} type="file" accept=".pdf, .doc, .docx, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document" className='w-full mb-1 text-gray-600 p-2 px-3 outline-none text-sm rounded-md border border-gray-300' required />
          <p className='font-light text-xs text-gray-500'>Supports PDF, Docs, and other document formets</p>
          <br />
          <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-[linear-gradient(to_right,#00DA83,#009BB3)] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer'>
            {
              loading? <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span> : <FileText className='w-5' />
            }
            Review Resume
          </button>
        </form>
        {/* Right Col */}
        <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
          <div className='flex items-center gap-3'>
            <FileText className='w-5 h-5 text-[#00DA83]' />
            <h1 className='text-xl font-semibold'>Analysis Results</h1>
          </div>
          {!content? (
            <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <FileText className='w-9 h-9' />
              <p>Upload a resume and click "Review Resume" to get started</p>
            </div>
          </div>
          ): (
            <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
              <div className='reset-tw'>
                <Markdown>{content}</Markdown>
              </div>
            </div>
          )}
          
        </div>
      </div>
  )
}

export default ReviewResume
