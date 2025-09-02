import ThemeToggleButton from '@/components/ui/theme-toggle-button';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between py-4">
      <div className="text-2xl font-bold">Elite Cron</div>
      <ul className="flex space-x-6">
        <li>
          <a href="#" className="hover:underline">
            Home
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Features
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Pricing
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </li>
      </ul>
      <div className="flex space-x-6 ">
        <ThemeToggleButton  start="top-right" />
      </div>
    </nav>
  );
};

export default Navbar;
