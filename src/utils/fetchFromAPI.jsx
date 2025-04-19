import axios from "axios";

// const BASE_URL = "https://youtube-v31.p.rapidapi.com";
// const options = {
//   params: {
//     maxResults: "5",
//   },
//   headers: {
//     "X-RapidAPI-Key": import.meta.env.VITE_XRAPID_API_KEY,
//     "X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
//   },
// };

// export const fetchFromAPI = async (url) => {
//   console.log(`${BASE_URL}/${url}`);
//   console.log(import.meta.env.VITE_XRAPID_API_KEY);
  
  
//   const { data } = await axios.get(`${BASE_URL}/${url}`, options);
//   console.log("data ", data);
  
//   return data;
// };



async function fetchData(url) {

  const options = {
    method: 'GET',
    url: 'https://youtube138.p.rapidapi.com/search/',
    params: {
      q: url,
      hl: 'en',
      gl: 'US'
    },
    headers: {
      'x-rapidapi-key': import.meta.env.VITE_XRAPID_API_KEY,
      'x-rapidapi-host': 'youtube138.p.rapidapi.com'
    }
  };
  

	try {
		const response = await axios.request(options);
		console.log(response.data.contents);
    return response.data.contents;
	} catch (error) {
		console.error(error);
	}
}

export const fetchFromAPI = async (url) => {
  
  return await fetchData(url);
  

}