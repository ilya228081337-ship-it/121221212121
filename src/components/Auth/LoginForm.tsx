import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && password !== password2) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        const fullName = `${firstName} ${lastName}`.trim();
        await signUp(email, password, fullName || 'Пользователь');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-teal-400 to-green-400 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-64 h-64 bg-pink-500 rounded-full opacity-40 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-orange-500 rounded-full opacity-40 blur-3xl"></div>
      <div className="absolute top-40 right-1/4 w-48 h-48 bg-green-300 rounded-full opacity-30 blur-2xl"></div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">PsyPlanner</h1>
          <p className="text-white text-lg">
            CRM система, которая помогает психологам<br />
            управлять клиентами и масштабировать практику
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 text-center">
            {isLogin ? 'Авторизация' : 'Зарегистрироваться'}
          </h2>

          {!isLogin && (
            <p className="text-center text-sm text-gray-600 mb-6">
              Если Вы уже зарегистрированы,{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className="text-teal-500 hover:text-teal-600"
              >
                авторизуйтесь
              </button>
            </p>
          )}

          {isLogin && (
            <p className="text-center text-sm text-gray-600 mb-6">
              Если Вы первый раз на сайте, пройдите{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className="text-teal-500 hover:text-teal-600"
              >
                регистрацию
              </button>
            </p>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Имя</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    placeholder="Имя"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Фамилия</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    placeholder="Фамилия"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                {isLogin ? 'Логин' : 'Email'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                placeholder={isLogin ? 'Логин' : 'Email'}
              />
            </div>

            <div className={!isLogin ? 'grid grid-cols-2 gap-4' : ''}>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Пароль</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  placeholder="Пароль"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Повторите пароль</label>
                  <input
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    placeholder="Повторите пароль"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-red-500 hover:text-red-600 text-sm flex items-center gap-2"
              >
                <span>←</span>
                <span>отмена</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Регистрация'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
