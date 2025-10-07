import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react'; // ⚡ Zap icon for “Upgrade Plan”
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';

const Navbar = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const { openSignIn } = useClerk();

    return (
        <div className="fixed top-0 left-0 z-50 w-full backdrop-blur-2xl bg-white/10 flex justify-between items-center px-4 sm:px-20 xl:px-32 py-5">
            {/* Logo */}
            <img
                src={assets.logo}
                alt="Logo"
                className="w-25 sm:w-29 cursor-pointer"
                onClick={() => navigate('/')}
            />

            <div className="flex items-center gap-4">
                {/* Upgrade Plan Button — only visible if user is logged in */}
                {user && (
                    <button
                        onClick={() => navigate('/pricing')}
                        className="flex items-center mr-3 gap-2 rounded-full text-sm font-medium cursor-pointer bg-[linear-gradient(to_right,#FFA500,#FF6B00)] text-white px-5 sm:px-7 py-2.5 shadow-[0_4px_10px_rgba(255,165,0,0.4)] hover:shadow-[0_6px_15px_rgba(255,165,0,0.6)] transition-all"
                    >
                        <Zap className="w-4 h-4" />
                        Upgrade Plan
                    </button>
                )}

                {/* Sign In / UserButton */}
                {user ? (
                    <UserButton />
                ) : (
                    <button
                        onClick={openSignIn}
                        className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-[linear-gradient(to_right,#2A65F5,#19D7B5)] text-white px-6 sm:px-10 py-2.5"
                    >
                        Get Started <ArrowRight className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
