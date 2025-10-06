import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'

const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useUser()
    const { openSignIn } = useClerk();

    return (
        <div className="fixed top-0 left-0 z-50 w-full backdrop-blur-2xl bg-white/10 flex justify-between items-center px-4 sm:px-20 xl:px-32 py-5">
            <img
                src={assets.logo}
                alt="Logo"
                className="w-25 sm:w-29 cursor-pointer"
                onClick={() => navigate('/')}
            />
            {
                user ? <UserButton /> : (
                    <button onClick={openSignIn} className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-[linear-gradient(to_right,#2A65F5,#19D7B5)] text-white px-6 sm:px-10 py-2.5">
                        Get Started <ArrowRight className="w-4 h-4" />
                    </button>
                )
            }

        </div>
    );
};

export default Navbar;
