import { ISectionProps } from './Section.types';
import { cn } from '@/lib/utils';

export const Section = ({ className, children }: ISectionProps) => {
  return (
    <div className={cn(className, 'w-full xl:max-w-5xl 2xl:max-w-7xl mx-auto')}>{children}</div>
  );
};
