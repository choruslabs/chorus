import { useContext, useState } from 'react';
import Logo from '../../components/ui/logo';
import { Button, Input } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/context/AuthContext';

const LoginPage = () => {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error: any) {
      if (error.status == 401) {
        setError('Invalid email or password.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className='h-screen w-screen flex justify-between items-center'>
      <div className='w-1/3 h-full bg-emerald-500 flex flex-col justify-center pl-16'>
        <Logo fill='white' />
        <h1 className='text-white text-6xl font-bold mt-5'>PublicSquareTO</h1>
      </div>
      <div className='w-2/3 h-full flex justify-center'>
        <div className='w-1/2 flex flex-col justify-center'>
          {error && (
            <div className='bg-red-500 text-white p-2 rounded-md mb-4 absolute top-16'>
              {error}
            </div>
          )}
          <h2 className='text-5xl font-bold mb-8'>Sign In</h2>
          <Input
            className='mb-4 bg-gray-100 rounded-md p-2'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            className='mb-4 bg-gray-100 rounded-md p-2'
            placeholder='Password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className='mb-8 bg-emerald-500 text-white rounded-sm'
            onClick={() => handleLogin(email, password)}>
            Sign in
          </Button>
          <p>
            Don't have an account?{' '}
            <a href='/register' className='text-emerald-500'>
              Register here.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
