import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: any[]) {
    return twMerge(clsx(inputs));
}
// Usage: cn('bg-white', isActive && 'text-primary', 'p-4')