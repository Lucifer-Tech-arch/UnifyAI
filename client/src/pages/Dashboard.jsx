import React, { useEffect, useState } from 'react'
import { dummyCreationData } from '../assets/assets';
import { Gem, Sparkles } from 'lucide-react';
import { Protect } from '@clerk/clerk-react';
import CreationItem from '../components/CreationItem';

const Dashboard = () => {
  const [creations,setCreations] = useState([]);

  const getdashboarddata = async() => {
    setCreations(dummyCreationData);
  }

  useEffect(() => {
    getdashboarddata();
  },[])
  return (
    <div className='h-full overflow-y scroll p-6'>
      <div className='flex justify-start gap-4 mb-6  flex-wrap'>
        {/* Total Creations Card */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Total Creations</p>
            <h2 className='text-xl font-semibold'>{creations.length}</h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-[linear-gradient(to_right,#2A65F5,#19D7B5)] text-white flex justify-center items-center'>
            <Sparkles className='w-5 text-white' />
          </div>
        </div>
        {/* Active Plan Card */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Active Plan</p>
            <h2 className='text-xl font-semibold'><Protect plan="Premium" fallback="Free"> </Protect></h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-[linear-gradient(to_right,#2A65F5,#19D7B5)] text-white flex justify-center items-center'>
            <Gem className='w-5 text-white' />
          </div>
        </div>
      </div>
      <div className='space-y-3'>
        <p className='mb-4'>Recent Creations</p>
        {
          creations.map((item) => <CreationItem key={item.id} item={item} />)
        }
      </div>
    </div>
  )
}

export default Dashboard
