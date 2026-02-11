
import React from 'react';
import Logo from './Logo';

interface AuthSidePanelProps {
    title: string | React.ReactNode;
    subtitle: string | React.ReactNode;
}

const AuthSidePanel: React.FC<AuthSidePanelProps> = ({ title, subtitle }) => {
    return (
        <div className="hidden lg:flex lg:w-1/2 bg-[#D92D20] text-white p-12 xl:p-20 flex-col justify-between relative overflow-hidden">
            {/* Background Decorative Circle */}
            <div className="absolute -bottom-24 -right-24 w-[350px] h-[350px] xl:w-[450px] xl:h-[450px] bg-red-600/30 rounded-full"></div>

            <div className="relative z-10">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-16 xl:mb-20 ">
                    <div className='bg-white rounded-lg p-2'>
                        <Logo width={100} height={28} />
                    </div>
                    <div className='text-xl font-semibold'>
                        Merchant
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-xl">
                    <h1 className="text-4xl font-semibold mb-10 line-clamp-2 leading-[1.1]">
                        {title}
                    </h1>
                    <p className="text-base xl:text-lg text-white/90 mb-4 xl:mb-6 max-w-lg">
                        {subtitle}
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 xl:gap-5">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 xl:p-8 border border-white/20">
                            <div className="text-3xl xl:text-4xl font-semibold mb-2">रू 2.5M+</div>
                            <div className="text-white/80 text-xs xl:text-sm font-mediumm">Total Disbursed</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 xl:p-8 border border-white/20">
                            <div className="text-3xl xl:text-4xl font-semibold mb-2">500+</div>
                            <div className="text-white/80 text-xs xl:text-sm font-mediumm">Active Merchants</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 xl:p-8 border border-white/20">
                            <div className="text-3xl xl:text-4xl font-semibold mb-2">98.5%</div>
                            <div className="text-white/80 text-xs xl:text-sm font-mediumm">Recovery Rate</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 xl:p-8 border border-white/20">
                            <div className="text-3xl xl:text-4xl font-semibold mb-2">&lt;2s</div>
                            <div className="text-white/80 text-xs xl:text-sm font-mediumm">Avg Decision Time</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10">
                <p className="text-white/70 text-xs xl:text-sm italic">© 2024 Redtab. All rights reserved.</p>
            </div>
        </div>
    );
};

export default AuthSidePanel;