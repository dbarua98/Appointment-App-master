import axios from "axios";

export async function getAPI(url, token) {
    debugger
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const response = await axios.get(url, config);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function putAPI(url, data, token) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const response = await axios.put(url, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export async function postAPI(url, data, token) {
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const response = await axios.post(url, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function checkDuplicateItemName(url, value, token) {
    debugger
    try {
        // const config = {
        //     headers: {
        //         Authorization: `Bearer ${token}`
        //     }
        // };

        // const response = await axios.get(`${"https://localhost:7137/api/Speciality/CheckDuplicateSpecialityName/"}/${value}`, config);
        // if (response.status === 200) {
        //     return true;
        // } 
        const response = await axios.get(
            `https://localhost:7137/api/Speciality/CheckDuplicateSpecialityName/${value}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        //   if (response.status == 200) {
        //     return true;
        //   } else {
        //     return false;
        //   }
        return response.status
        
    } catch (error) {
        return error.response.status;
        console.error("Error checking duplicate item name:", error);
    }
}


export async function fetchDataById(url, id, token) {
    try {
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        const response = await axios.get(`${url}/${id}`, { headers });
        return response.data;
    } catch (error) {
        throw error;
    }
}