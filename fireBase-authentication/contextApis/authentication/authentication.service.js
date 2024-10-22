import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth"
export const registerFirebaseRequest = (email,password)=>{
    const auth = getAuth()
    return createUserWithEmailAndPassword(auth,email,password)
}


export const loginFirebaseRequest = (email,password)=>{
    const auth = getAuth()
    return signInWithEmailAndPassword(auth,email,password)
}