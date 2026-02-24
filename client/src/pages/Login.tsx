import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { add } from '../redux/userSlice';


const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginErr, setLoginErr] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const dispatch = useDispatch()

    const registerRequest = () => {
        const options = {
            method: 'POST',
            url: `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
            data: {
                email,
                password
            }
        };
        setLoading(true);
        axios
            .request(options)
            .then((response) => {
                const resp = response.data;
                console.log(resp)
                if (response.status !== 200) {
                    setLoginErr('Login failed!');
                    toast.error('Login failed!');
                } else {
                    toast.success('Login successful!');

                    const localUser={
                        authorization:resp.token,
                        data:resp.user
                    }

                    //console.log(JSON.stringify(localUser))
                    localStorage.setItem('localUser', JSON.stringify(localUser));

                    dispatch(add(localUser));
                    navigate('/')
                }

            })
            .catch((error) => {
                console.log(error?.response?.data?.message || error?.message);
                toast.error('Login failed!');
            })
            .finally(() => setLoading(false));
    };

    const handleSignUp = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;
        
        if ( !email || !password ) {
            setLoginErr("Please fill all the details!");
            return;
        }
        registerRequest();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800">
                    Login
                </h2>

                <form className="space-y-4" onSubmit={handleSignUp}>
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                     

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Enter your password"
                            autoComplete="on"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                   

                   

                    <div>
                        <button
                            className={`w-full px-4 py-2 ${loading ? 'bg-gray-600 hover:bg-gray-600' : 'bg-black hover:bg-gray-800'
                                } text-white rounded-lg focus:outline-none`}
                        >
                            {loading ? 'Logging in...' : 'Log in'}
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-600">
                    <span className="text-red-500">{loginErr}</span>
                    <br />
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-semibold hover:text-gray-800">
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;