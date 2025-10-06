import React from 'react'
import { assets } from '../assets/assets'
import { TypeAnimation } from 'react-type-animation'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const Hero = () => {
    const navigate = useNavigate();
  return (
    <div
      className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-cover bg-no-repeat min-h-screen'
      style={{ backgroundImage: `url(${assets.gradientBackground})` }}
    >
      <div className='text-center mb-6'>
        <h1 className='text-3xl sm:text-5xl mb-2 md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]'>
          <TypeAnimation
            sequence={[
              'Supercharge your content', 1500,
              'Accelerate your workflow', 1500,
              'Elevate your writing', 1500,
              'Unleash your creativity', 1500,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className='text-black'
          />
          <br />with <span className='text-gradient'>AI Tools</span>
        </h1>

        <p className='mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl m-auto max-sm:text-xs text-gray-600'>
          Transform your content creation with our suite of premium AI tools. Write articles, generate images, and enhance your workflow.
        </p>
      </div>
      <div className='flex flex-wrap justify-center gap-4 text-md max-sm:text-xs mb-8'>
        <button onClick={() => navigate('/ai')} className='bg-primary-gradient text-white px-8 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer flex items-center justify-center'>Start Creating now <ArrowRight className='ml-2' /></button>
        <button className='bg-white px-10 py-3 rounded-lg border border-gray-300 hover:scale-102 active:scale-95 transition cursor-pointer'>Watch Demo</button>
      </div>
      <div className='flex items-center gap-4 mx-auto text-gray-600'>
        <img src={assets.user_group} className='h-8' />Trusted by 10k+ people
      </div>
    </div>
  )
}

export default Hero
