export const postRequest = async (url, body) => {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(body) 
    })
    
    const data = await response.json()
    if(!response.ok){
        let message
        if(data?.message){
            message = data.message
        } else {
            message = data
        }
        return {error:true,message}
    }
    return data
}

export const getRequest = async (url) => {
    const response = await fetch(url,{
        credentials:"include",
    })
    const data = await response.json()
    if(!response.ok){
        let message
        if(data?.message){
            message = data.message
        } else {
            message = data
        }
        return {error:true,message}
    }
    return data
}

