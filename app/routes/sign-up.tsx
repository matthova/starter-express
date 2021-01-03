import { Form, usePendingFormSubmit, useRouteData } from "@remix-run/react";

export function meta() {
  return {
    title: "Sign up!",
    description: "do it...",
  };
}

export default function SignUp() {
  let data = useRouteData();
  let pendingForm = usePendingFormSubmit();

  if (pendingForm) {
    return <div>LOADING!!!!</div>;
  }

  return (
    <div>
      <div>sign up</div>
      <div>{JSON.stringify(data)}</div>
      <Form method="post" action="/sign-up">
        <input name="email" />
        <input name="password" />
        <button type="submit">submit form</button>
      </Form>
    </div>
  );
}
