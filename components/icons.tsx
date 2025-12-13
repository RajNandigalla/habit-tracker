import React from 'react';
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  Check,
  ChevronDown,
  Search,
  Menu,
  Flame,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Download,
  Upload,
  Cloud,
  Moon,
  Sun,
  Bell,
  ShieldCheck,
  Smartphone,
  LogOut,
  BarChartBig, // Added
} from 'lucide-react';

export const SpinnerIcon = ({ className }: { className?: string }) => (
  <Loader2 className={`animate-spin ${className}`} />
);
export const ChevronLeftIcon = ChevronLeft;
export const ChevronRightIcon = ChevronRight;
export const CalendarIcon = Calendar;
export const PlusIcon = Plus;
export const XIcon = X;
export const ArrowDownLeftIcon = ArrowDownLeft;
export const ArrowUpRightIcon = ArrowUpRight;
export const FabTransferIcon = ArrowRightLeft;
export const CheckIcon = Check;
export const ChevronDownIcon = ChevronDown;
export const SearchIcon = Search;
export const MenuIcon = Menu;
export const FireIcon = Flame;
export const TrashIcon = Trash2;
export const PlayIcon = Play;
export const PauseIcon = Pause;
export const ResetIcon = RotateCcw;
export const TimerIcon = Timer;
export const DownloadIcon = Download;
export const UploadIcon = Upload;
export const CloudIcon = Cloud;
export const MoonIcon = Moon;
export const SunIcon = Sun;
export const BellIcon = Bell;
export const ShieldCheckIcon = ShieldCheck;
export const SmartphoneIcon = Smartphone;
export const LogOutIcon = LogOut;
export const BarChartBigIcon = BarChartBig;
