import { useEffect } from "react";
import { auth } from "./firebase";
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut, signInWithRedirect } from "firebase/auth";
import { getRedirectResult } from "firebase/auth";

useEffect(() => {
    getRedirectResult(auth)
        .then((result) => {
            if (result?.user) {
                console.log("Login GitHub sukses:", result.user);
            }
        })
        .catch((error) => {
            console.error("Redirect error:", error);
        });
}, []);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

export const loginWithGithub = () => signInWithRedirect(auth, githubProvider);

export const logout = () => signOut(auth);
