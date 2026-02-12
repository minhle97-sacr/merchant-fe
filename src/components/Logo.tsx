import Image from 'next/image';
import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<LogoProps> = ({ className, width = 120, height = 32 }) => {
  return (
    <div className={`relative ${className || ''}`} style={{ width, height }}>
      <Image
        src="/icons/logo.png"
        alt="Redtab Logo"
        fill
        sizes='120'
        className="object-contain"
        priority
      />
    </div>
  );
};

export default Logo;
