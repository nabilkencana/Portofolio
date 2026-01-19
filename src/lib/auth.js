import { auth } from "./firebase";
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut, signInWithRedirect } from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

export const loginWithGithub = () => signInWithRedirect(auth, githubProvider);

export const logout = () => signOut(auth);
