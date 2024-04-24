import defaultUser from '../utils/default-user';

export async function signIn(email, password) {
  try {
    // Send request
    const data = {
      userName: email,
      password: password
  };
    const response = await fetch('https://localhost:7137/api/Authenticate/Post', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  });

  const responseData = await response.json();
  localStorage.setItem('token', responseData.AuthenticateToken);
  localStorage.setItem('UserName', responseData.UserName);

  console.log(responseData);
  // navigate("/home")

    return {
      isOk: true,
      data: responseData
    };
  }
  catch {
    return {
      isOk: false,
      message: "Authentication failed"
    };
  }
}

export async function getUser() {
  try {
    // Send request
    
    const token = localStorage.getItem("token");
    if(token){
    const UserName = localStorage.getItem("UserName");
    const data = {
      token:token,
      UserName:UserName
    }
    return {
      isOk: true,
     data:data
    };
  }
}
  catch {
    return {
      isOk: false
    };
  }
}

export async function createAccount(email, password) {
  try {
    // Send request
    console.log(email, password);

    return {
      isOk: true
    };
  }
  catch {
    return {
      isOk: false,
      message: "Failed to create account"
    };
  }
}

export async function changePassword(email, recoveryCode) {
  try {
    // Send request
    console.log(email, recoveryCode);

    return {
      isOk: true
    };
  }
  catch {
    return {
      isOk: false,
      message: "Failed to change password"
    }
  }
}

export async function resetPassword(email) {
  try {
    // Send request
    console.log(email);

    return {
      isOk: true
    };
  }
  catch {
    return {
      isOk: false,
      message: "Failed to reset password"
    };
  }
}
