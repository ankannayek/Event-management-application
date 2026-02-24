import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { add } from '../redux/userSlice';

type UserType = "admin" | "organizer" | "attendee" | "exhibitor" | "sponsor";

const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [mobileNumber, setMobileNumber] = useState<number>()
    const [userType, setUserType] = useState<UserType>("attendee");
    const [registerErr, setRegisterErr] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const dispatch = useDispatch()

    const registerRequest = () => {
        const options = {
            method: 'POST',
            url: `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
            data: {
                name,
                email,
                password,
                role: userType,
                mobileNumber
            }
        };
        setLoading(true);
        axios
            .request(options)
            .then((response) => {
                const resp = response.data;
                console.log(resp)
                if (response.status !== 201) {
                    setRegisterErr('Registration failed!');
                    toast.error('Registration failed!');
                } else {
                    toast.success('Registration successful!');

                    const localUser = {
                        authorization: resp.token,
                        data: resp.user
                    }

                    console.log(JSON.stringify(localUser))
                    localStorage.setItem('localUser', JSON.stringify(localUser));

                    dispatch(add(localUser));
                    navigate('/')
                }

            })
            .catch((error) => {
                console.log(error?.response?.data?.message || error?.message);
                toast.error('Registration failed!');
            })
            .finally(() => setLoading(false));
    };

    const handleSignUp = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;
        if (password !== cPassword) {
            setRegisterErr("Confirm password does not match!");
            return;
        }
        if (!name || !email || !password || !cPassword || !userType || !mobileNumber) {
            setRegisterErr("Please fill all the details!");
            return;
        }
        registerRequest();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800">
                    Create an Account
                </h2>

                <form className="space-y-4" onSubmit={handleSignUp}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

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
                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                            Mobile Number
                        </label>
                        <input
                            type="number"
                            id="mobileNumber"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Enter your full name"
                            value={mobileNumber}
                            onChange={(e) => {
                                if (!(e.target.value.length >10)) {
                                    setMobileNumber(Number(e.target.value))
                                }
                            }
                            }
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
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirm-password"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Confirm your password"
                            autoComplete="on"
                            value={cPassword}
                            onChange={(e) => setCPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="user-type" className="block text-sm font-medium text-gray-700">
                            User Type
                        </label>
                        <select
                            id="user-type"
                            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value as UserType)}
                        >
                            <option value="organizer">Organizer</option>
                            <option value="attendee">Attendee</option>
                            <option value="exhibitor">Exhibitor</option>
                            <option value="sponsor">Sponsor</option>
                        </select>
                    </div>

                    <div>
                        <button
                            className={`w-full px-4 py-2 ${loading ? 'bg-gray-600 hover:bg-gray-600' : 'bg-black hover:bg-gray-800'
                                } text-white rounded-lg focus:outline-none`}
                        >
                            {loading ? 'Signing up...' : 'Sign up'}
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-600">
                    <span className="text-red-500">{registerErr}</span>
                    <br />
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold hover:text-gray-800">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;