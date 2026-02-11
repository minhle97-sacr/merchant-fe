import React from 'react';
import { 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  Settings, 
  Clock, 
  Wallet, 
  CreditCard, 
  ShoppingBag, 
  BarChart, 
  List, 
  Users, 
  User, 
  Shield, 
  Search, 
  Bell, 
  ShoppingCart, 
  MapPin, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Tag, 
  Filter, 
  Zap, 
  Droplet, 
  Wifi, 
  Download, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  FileText, 
  Upload, 
  Pencil, 
  Trash2, 
  RefreshCcw,
  CircleHelp
} from 'lucide-react';

export type IconName = 
  | 'dashboard' 
  | 'logout' 
  | 'menu' 
  | 'close' 
  | 'shield-check' 
  | 'settings'
  | 'clock'
  | 'wallet'
  | 'payment'
  | 'bag'
  | 'chart'
  | 'catalog'
  | 'users'
  | 'user'
  | 'shield'
  | 'search'
  | 'bell'
  | 'cart'
  | 'location'
  | 'plus'
  | 'arrow-up-right'
  | 'arrow-down-left'
  | 'badge-percent'
  | 'filter'
  | 'chevron-down'
  | 'chevron-right'
  | 'chevron-up'
  | 'chevron-left'
  | 'calendar'
  | 'check-circle'
  | 'alert-circle'
  | 'alert-warning'
  | 'payments'
  | 'loader'
  | 'file-text'
  | 'cloud-upload'
  | 'sales'
  | 'edit'
  | 'trash'
  | 'arrow-left'
  | 'internet'
  | 'water'
  | 'electric'
  | 'download'
  | 'check';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
}

const iconMap: Record<string, any> = {
  'dashboard': LayoutDashboard,
  'logout': LogOut,
  'menu': Menu,
  'close': X,
  'shield-check': ShieldCheck,
  'settings': Settings,
  'clock': Clock,
  'wallet': Wallet,
  'payment': CreditCard,
  'bag': ShoppingBag,
  'chart': BarChart,
  'catalog': List,
  'users': Users,
  'user': User,
  'shield': Shield,
  'search': Search,
  'bell': Bell,
  'cart': ShoppingCart,
  'location': MapPin,
  'plus': Plus,
  'arrow-up-right': TrendingUp,
  'arrow-down-left': TrendingDown,
  'badge-percent': Tag,
  'filter': Filter,
  'electric': Zap,
  'water': Droplet,
  'internet': Wifi,
  'download': Download,
  'arrow-left': ArrowLeft,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'calendar': Calendar,
  'check': Check,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'check-circle': CheckCircle2,
  'alert-circle': AlertCircle,
  'alert-warning': AlertTriangle,
  'payments': CreditCard,
  'sales': TrendingUp,
  'edit': Pencil,
  'trash': Trash2,
  'loader': RefreshCcw,
  'file-text': FileText,
  'cloud-upload': Upload,
};

export const Icon = ({ name, className, size = 24, color }: IconProps) => {
  const IconComponent = iconMap[name] || CircleHelp;
  return <IconComponent className={className} size={size} color={color} />;
};
