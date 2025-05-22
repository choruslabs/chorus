import { useContext } from 'react';
import Logo from '../../components/ui/logo';
import { AuthContext } from '../../components/context/AuthContext';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const UserDropdown = () => (
  <UserCircleIcon className='h-8 w-8 text-white mr-2' />
);

const AppBar = ({ user, logout }: { user: any; logout: () => void }) => (
  <div className='w-full p-3 bg-emerald-500 pl-5 flex items-center justify-between'>
    <div className='flex'>
      <Logo fill='white' />
      <h1 className='ml-3 mr-16 text-white text-xl font-bold'>
        Convergent
      </h1>
    </div>
    <div className='flex items-center'>
      <a className='text-white mr-4 max-sm:hidden' href='/home'>
        Home
      </a>
      <a className='text-white mr-4 max-sm:hidden' href='/about'>
        About
      </a>
      <a className='text-white max-sm:hidden' href='/contact'>
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
      <div className='grow w-full overflow-y-auto'>{children}</div>
    </div>
  );
};

export default CoreBase;
