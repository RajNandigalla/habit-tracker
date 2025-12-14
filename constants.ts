export interface ColorOption {
  name: string;
  className: string;
  cssVar: string;
}

// Category color palette using Tailwind colors
export const CATEGORY_COLORS: ColorOption[] = [
  { name: 'red-500', className: 'bg-red-500', cssVar: 'var(--color-red-500)' },
  { name: 'amber-500', className: 'bg-amber-500', cssVar: 'var(--color-amber-500)' },
  { name: 'emerald-500', className: 'bg-emerald-500', cssVar: 'var(--color-emerald-500)' },
  { name: 'blue-500', className: 'bg-blue-500', cssVar: 'var(--color-blue-500)' },
  { name: 'violet-500', className: 'bg-violet-500', cssVar: 'var(--color-violet-500)' },
  { name: 'pink-500', className: 'bg-pink-500', cssVar: 'var(--color-pink-500)' },
  { name: 'indigo-600', className: 'bg-indigo-600', cssVar: 'var(--color-indigo-600)' },
  { name: 'slate-500', className: 'bg-slate-500', cssVar: 'var(--color-slate-500)' },
];
