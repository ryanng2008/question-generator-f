import BASE_URL from "./apiConfig";

export async function handleLogin(username: string, password: string) { 
    // POST Requests w/ username and password: receives JWT in return
    // Sets JWT into cookies
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        if(!response.ok) {
            return { success: false, message: 'Login failed' }
        }
        const data = await response.json();
        sessionStorage.setItem("token", data.token);
        // console.log(data)
        return { success: data.success, message: data.message }
        // console.log([...response.headers.entries()]);
        // return data;
    } catch (error) {
        console.error('An error occured. ', error)
        return { success: false, message: error }
    }

}
// add the new sessionstorage system to login later

export async function handleRegister(username: string, password: string) {
    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        const result = await response.json();
        return result
    } catch (error) {
        console.error('An error occurred. ', error)
        return { success: false, message: 'An error occurred'}
    }
    // Similar (POST)

}


export async function fetchUser() {
    const token = sessionStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/user`, {
            method: 'GET',
            credentials: 'include', // Include cookies with the request
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (res.ok) {
            const data = await res.json();
            return data; // or wtv format it is
        } else if(res.status === 404 || res.status === 401) {
            return { identity: '' }
        } else {
            // const data = await res.json();
            // console.log(data)
            return { identity: '' }
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        return null
    }
}

// export async function testTheCookie() {
//     try {
//         const res = await fetch(`${BASE_URL}/home`, {
//             method: 'GET',
//             credentials: 'include'
//         });
//     } catch(error) {
//         console.error(error);
//     }
// }