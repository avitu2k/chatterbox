
export const setLoggedUser = (data) =>{
    const user = JSON.stringify(data);
    console.log(user);
    localStorage.setItem("loggedUser", user);   
}

export const getLoggedUser = () =>{
    const user = localStorage.getItem("loggedUser");
    return JSON.parse(user);  
}

export const setToken = (token) =>{
    const newToken = JSON.stringify(token);
    localStorage.setItem("accessToken", newToken);   
}

export const getToken = () =>{
    const token = localStorage.getItem("accessToken");
    return JSON.parse(token);   
}

export const nullifyToken = () =>{
    localStorage.setItem("accessToken", null);   
}

export const nullifyLoggedUser = (data) =>{
    localStorage.setItem("loggedUser", null);   
}


