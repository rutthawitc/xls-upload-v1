'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        pwd,
      });
      //console.log('User :', username, 'Password :', pwd);
      if (result.error) {
        console.error(result.error);
        toast.error('รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      } else {
        router.push('/protected');
      }
    } catch (error) {
      console.log('error', error);
      toast.error(error, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  return (
    <div className='flex h-screen items-center justify-center'>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded-md shadow-md'>
        <div className='mb-4'>
          <h3 className='text-xl font-bold mb-1'>PWA Intranet Login</h3>
          <label htmlFor='email'>รหัสพนักงาน</label>
          <input
            id='username'
            type='text'
            value={username}
            autoComplete='username'
            onChange={(e) => setUsername(e.target.value)}
            required
            className='w-full border border-gray-300 px-3 py-2 rounded' // Added border
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='password'>รหัสผ่าน</label>
          <input
            id='password'
            type='password'
            value={pwd}
            autoComplete='current-password'
            onChange={(e) => setPwd(e.target.value)}
            required
            className='w-full border border-gray-300 px-3 py-2 rounded' // Added border
          />
        </div>
        <button
          type='submit'
          className='w-full bg-blue-500 text-white py-2 rounded mb-4'>
          เข้าสู่ระบบ
        </button>{' '}
      </form>
      <ToastContainer />
    </div>
  );
}
