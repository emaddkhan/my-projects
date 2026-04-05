import { API_KEY,BASE_URL } from "./config";
export const fetchDataFromApi = async (endpoint)=>{
    try {
        const url=endpoint.includes("?")?`${BASE_URL}${endpoint}&api_key=${API_KEY}`:`${BASE_URL}${endpoint}?api_key=${API_KEY}`;
        console.log("API URL:", url);
        const res=await fetch(url);
        if(!res.ok) throw new Error("Failed to fetch data from API");
        return await res.json();
    } catch (error) {
        console.error("Error fetching data from API:", error);
        return null;
    }
} 