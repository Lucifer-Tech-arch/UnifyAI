import React, { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const Community = () => {
  const [creations, setCreations] = useState([])
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const { getToken } = useAuth()

  const fetchCreations = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (data.success) {
        setCreations(data.creations || [])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to load creations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchCreations()
    }
  }, [user])

  return (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      <h2 className='text-xl font-semibold'>Creations</h2>

      <div className='bg-white h-full w-full rounded-xl overflow-y-auto p-3'>
        {loading ? (
          <div className='flex items-center justify-center w-full h-[70vh]'>
            <span className='w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin'></span>
          </div>
        ) : creations.length === 0 ? (
          <div className='flex flex-col justify-center items-center h-[70vh]'>
            <img
              className='w-64 h-64 object-contain mb-3'
              src='/notfound.png'
              alt='No Creations'
            />
            <p className='text-gray-500 text-sm'>No Creations Found!</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {creations.map((creation, idx) => (
              <div
                key={idx}
                className='relative group rounded-lg overflow-hidden shadow-md'
              >
                <img
                  src={creation.content}
                  alt={creation.prompt || 'AI creation'}
                  className='w-full h-64 object-cover rounded-lg'
                />

                <div className='absolute inset-0 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-transparent to-black/70 text-white transition-all duration-300'>
                  <p className='text-xs line-clamp-2 w-3/4'>{creation.prompt}</p>
                  <div className='flex gap-1 items-center'>
                    <p className='text-sm'>{creation.likes?.length || 0}</p>
                    <Heart
                      className={`w-5 h-5 hover:scale-110 cursor-pointer transition ${
                        creation.likes?.includes(user.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-white'
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Community
