import type { Loader, Action } from "@remix-run/data";
import { parseFormBody, redirect } from "@remix-run/data";
import admin from "firebase-admin";
import firebase from "firebase";

export let loader: Loader = async (all) => {
  return {
    message: `this is awesome 😎 \n foo: ${all.session.get("foo")}`,
  };
};

const COOKIE_NAME = "__firebase_session";
export let action: Action = async ({ session, request }) => {
  try {
    let body = await parseFormBody(request);

    const email = body.get("email") as string;
    const password = body.get("password") as string;
    console.log("email and password", email, password);
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
    const { user } = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    console.log("user", user);
    const idToken = (await user?.getIdToken(true)) ?? "";
    console.log("token", idToken);

    // Set session expiration to 20 seconds.
    const expiresIn = 5 * 60 * 1000;
    // Create the session cookie. This will also verify the ID token in the process.
    // The session cookie will have the same claims as the ID token.
    // To only allow session cookie setting on recent sign-in, auth_time in ID token
    // can be checked to ensure user was recently signed in before creating a session cookie.
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });

    // Set cookie policy for session cookie.
    return new Response(body.toString(), {
      headers: {
        "Set-Cookie": `${COOKIE_NAME}=${sessionCookie}; Max-Age=${expiresIn}; HttpOnly; Path=/`,
        "content-type": "application/json",
        Location: "/",
      },
    });
  } catch (ex) {
    console.log("nope", ex);
    return new Response("", {
      headers: {
        Location: "/sign-up",
      },
      status: 500,
    });
  }
};
