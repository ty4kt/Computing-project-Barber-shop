const accountSetupRequest = async (data1, checkpoint) => {
  let authorization = localStorage.getItem("authToken");

  try {
    if (!authorization) {
      throw new Error("Not authorized");
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/account-setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authorization}`,
      },
      body: JSON.stringify({
        data: JSON.stringify(data1),
        checkpoint: checkpoint
      })
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || "Request failed");
    }

    console.log(responseData);
    
    return responseData;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

const accountSetupCheck = async () => {
    let authorization = localStorage.getItem("authToken");

    try {
      if (!authorization) {
        throw new Error("Not authorized");
      }

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/account-setup/check`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authorization}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed");
      }

      const data = await response.json();
      console.log(data);
      
    } catch (error) {
      console.error(error);
    }
}

const signUpRequest = async (fullName, email, password) => {
    try {
        const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/auth/register`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ fullName, email, password }),
        }
        );
    
        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
        }
    
        const { token } = await response.json();
        localStorage.setItem("authToken", token);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const signInRequest = async (email, password) => {
    try {
        const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        }
        );
    
        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
        }
    
        const { token } = await response.json();
        localStorage.setItem("authToken", token);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const barberAccountSetup = async (data1, checkpoint) => {
  let authorization = localStorage.getItem("authToken");

  try {
    if (!authorization) {
      throw new Error("Not authorized");
    }

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/barber-setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authorization}`,
      },
      body: JSON.stringify({
        data: JSON.stringify(data1),
        checkpoint: checkpoint
      })
    });

    const responseData = await response.json(); // Parse the response data once
    if (!response.ok) {
      throw new Error(responseData.message || "Request failed");
    }

    console.log(responseData);
    
    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const uploadProfilePicture = async (selectedFile) => {
  const authorization = localStorage.getItem("authToken");
  if (!authorization) {
    throw new Error("Not authorized");
  }

  try {
    const formData = new FormData();
    formData.append('image', selectedFile);

    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/update-profile-picture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authorization}`,
      },
      body: formData, // Send the form data with the file
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || "Failed to upload profile picture");
    }

    return responseData;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};



export { accountSetupRequest, accountSetupCheck, signUpRequest, signInRequest, barberAccountSetup, uploadProfilePicture};