import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../lib/axios';
import { useAuth } from '../context/AuthContext';
import { TextInput } from '../../../components/ui/TextInput';
import { LoginSchema, type LoginDto, type User } from '@repo/types';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    setError, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginDto>({ // Use the shared DTO type
    resolver: zodResolver(LoginSchema), // Use the shared Zod schema
  });

  const onSubmit = async (data: LoginDto) => {
    try {
      // Return type is also typed now
      const res = await api.post<{ token: string; user: User }>('/auth/login', data);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
      setError('root', { 
        message: 'האימייל או הסיסמה שגויים. נסה שנית.' 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" dir="rtl">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">התחברות למערכת</h2>
          <p className="mt-2 text-sm text-gray-600">ברוך שובך! הזן את פרטיך לכניסה</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <TextInput 
              label="אימייל" 
              type="email" 
              {...register('email')} 
              error={errors.email} 
              autoComplete="email"
            />
            
            <TextInput 
              label="סיסמה" 
              type="password" 
              {...register('password')} 
              error={errors.password} 
              autoComplete="current-password"
            />
          </div>

          {errors.root && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
              {errors.root.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'מתחבר...' : 'היכנס'}
          </button>
        </form>
      </div>
    </div>
  );
};
