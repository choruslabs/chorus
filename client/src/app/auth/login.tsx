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
    <div className='h-screen w-screen flex flex-col md:flex-row justify-between items-center' id="container">
      <div id="branding" className='flex-1 w-full h-full bg-secondary flex flex-col justify-center p-8 md:p-0'>
        <div id='logo-text' className='md:mx-auto w-min'>
          <Logo fill='white' />
          <h1 className='text-white text-6xl font-bold mt-5'>
            Public
            <br />
            Square
            <br />
            TO
          </h1>
        </div>
      </div>
      <div id="sign-in-container" className='flex-2 w-full h-full flex justify-center p-8 md:p-0'>
        <div className='w-1/2 flex flex-col justify-center'>
          {error && (
            <div className='bg-red-500 text-white p-2 rounded-md mb-4 absolute top-16 self-center'>
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
            className='mb-8 p-2 bg-secondary text-white rounded-md'
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
