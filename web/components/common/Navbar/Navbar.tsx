import { ThemeToggleButton } from '@/components/ui/theme-animations';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between py-4">
      <div className="text-2xl font-bold text-primary">Elite Cron</div>
      <ul className="flex space-x-6">
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/feature" className="hover:underline">
            Features
          </Link>
        </li>
        <li>
          <Link href="https://github.com/AshutoshDM1/Aws-Cron" className="hover:underline">
            GitHub
          </Link>
        </li>
      </ul>
      <div className="flex space-x-6 ">
        <ThemeToggleButton variant="rectangle" start="right-left" className="h-6 w-6 cursor-pointer" />
      </div>
    </nav>
  );
};

export default Navbar;
