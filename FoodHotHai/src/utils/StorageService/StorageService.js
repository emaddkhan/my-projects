// import AsyncStorage from "@react-native-async-storage/async-storage";

// const setItem = async(key = "my-key", value)=>{
//     try {
//         const jsonValue = JSON.stringify(value);
//         await AsyncStorage.setItem(key, jsonValue);
//       } catch (e) {
//         // saving error
//       }
// }
// const getItem = async(key = "my-key", value)=>{
//     try {
//         const jsonValue =await AsyncStorage.getItem("my-key");
//         return jsonValue != null ? JSON.parse(jsonValue):null;
//       } catch (e) {
//         // saving error
//       }
// };
// const removeItem = async (key) => {
//     try {
//       await AsyncStorage.removeItem(key);
//     } catch (e) {
//       // remove error
//     }
//   };
// export const StorageService = {
//     setItem,
//     getItem,
//     removeItem
// }
import AsyncStorage from "@react-native-async-storage/async-storage";

const setItem = async (key = "my-key", value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

const getItem = async (key = "my-key") => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // saving error
  }
};

const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // remove error
  }
};

export const StorageService = {
  setItem,
  getItem,
  removeItem,
};