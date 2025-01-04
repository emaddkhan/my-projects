import camelize from "camelize";
import { mockImages, restaurant } from "./Restaurent.mock";

export const restaurantRequest = (search = "37.7749295,-122.4194155")=>{
    return new Promise((resolve,reject)=>{
        const restaurantMockData = restaurant[search];
        if(!restaurantMockData){
            reject("restaurant not found");
        }
        const transformLocationData = restaurantTranformData( restaurant[search])
        resolve(transformLocationData)
    })
}
const restaurantTranformData = (restaurantData)=>{
    const {results} = restaurantData;
    const formattedResponse = camelize(results);
    const mappedResults = formattedResponse?.map((singleRestaurant)=>{
        singleRestaurant.photos=mockImages[Math.ceil(Math.random()*(mockImages.length-1))];
        return{
            ...singleRestaurant,
            address :singleRestaurant?.vicinity,
            isOpenNow:Boolean(singleRestaurant?.openingHours?.OpenNow),
            isClosedTemporary:singleRestaurant?.businesStatus==="CLOSED_TEMPORARILY"
        };
    })
    return mappedResults;
};