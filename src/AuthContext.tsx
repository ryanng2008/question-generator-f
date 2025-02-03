import { createContext, useContext, useState } from 'react';
import { fetchUser, handleLogin, handleRegister } from './lib/api/accountApi';

const AuthContext = createContext<any>({});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);

    // If you load the page and there's already JWT, this does it
    const loadUser = async () => {
        const fetchedUser = await fetchUser();
        setUser(fetchedUser?.identity || null);
    }
    // useEffect(() => { 
    //     loadUser();
    // }, [])
    // when you login, set user details
    const login = async (username: string, password: string) => {
        const loginResponse = await handleLogin(username, password);
        if(loginResponse?.success) {
            await loadUser(); // Update the user context
            return { success: true, message: loginResponse?.message || '' };
        } else {
            return { success: false, message: loginResponse?.message || '' }
        }

    }
    const register = async (username: string, password: string) => {
        const registerResponse = await handleRegister(username, password);
        if(registerResponse?.success) {
            await loadUser(); // Update the user context
            return { success: true, message: registerResponse?.message || '' };
        } else {
            return { success: false, message: registerResponse?.message || '' }
        }
    }
    const logout = () => {
        sessionStorage.removeItem('token');
        setUser(null);
    }
    return (
        <AuthContext.Provider value={{ user, login, register, logout, loadUser }}>
        {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);