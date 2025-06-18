import { useContext } from 'react';
import Logo from '../../components/ui/logo';
import { AuthContext } from '../../components/context/AuthContext';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const UserDropdown = () => (
  <UserCircleIcon className='h-8 w-8  mr-2' />
);

const AppBar = ({ user, logout }: { user: any; logout: () => void }) => (
  <div id="app-bar" className='w-full p-3 pl-5 flex items-center justify-between border-b-gray-200 border-b-2'>
    <div className='flex'>
      <Logo />
      <h1 className='ml-3 mr-16 text-xl font-bold'>
        Convergent
      </h1>
    </div>
    <div className='flex items-center gap-4'>
      <a className='max-sm:hidden' href='/home'>
        Home
      </a>
      <a className='max-sm:hidden' href='/about'>
        About
      </a>
      <a className='max-sm:hidden' href='/contact'>
        Contact
      </a>
    </div>
    <div className='flex justify-end w-1/6'>
      <UserDropdown />
    </div>
  </div>
);

const CoreBase = ({ children }: { children: any }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className='h-screen w-screen flex flex-col items-center'>
      <div className='w-full h-16'>
        <AppBar user={user} logout={logout} />
      </div>
      <div className='grow w-full overflow-y-auto pt-4'>{children}</div>
    </div>
  );
};

export default CoreBase;
