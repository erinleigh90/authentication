import styles from '../styles/Home.module.css';
import { GetServerSideProps } from 'next';
import { withSSRContext } from 'aws-amplify';
import React from "react";
import { Auth } from 'aws-amplify';
import { ChangeActionParams } from '../src/types';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const SSR = withSSRContext(context);
  try {
    const user = await SSR.Auth.currentAuthenticatedUser();
    console.log(user);
    return {
      props: {username: user.username},
    }
  } catch (e) { 
    console.log(e);
  }
  return { props: {} }
}

export default function ConfirmEmailForm(
  { username, password, changeAction, setErrors }:
  {
    username: string,
    password: string,
    changeAction: (changeActionParams: ChangeActionParams) => void,
    setErrors: (authErrors: string) => void
    }) {

  const handleConfirm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let form: FormData = new FormData(event.target as HTMLFormElement);
    setErrors('');

    const code = form.get('code') as string;

    try {
      await Auth.confirmSignUp(username, code);
      await Auth.signIn(username, password);
      changeAction({nextAction: 'signOut'});
    } catch (e: any) {
      setErrors(e.toString());
    }
  };

  const handleResend = async () => {
    try {
      await Auth.resendSignUp(username);
    } catch (e: any) {
      setErrors(e.toString());
    }
  }

  return (
    <form className={styles.signInForm} onSubmit={handleConfirm}>
      <h3 data-test="sign-up-header-section">Confirm email</h3>
      <div className={styles.inputFields}>
        <input
          type="text"
          name="code"
          placeholder="Confirmation Code"
          required />
      </div>
      <p className={styles.center}>Can&apos;t find your confirmation code? <a onClick={handleResend}>Resend Code</a></p>
      <input className={styles.primaryButton} type="submit" value="Confirm"/>
    </form>
  )
}
