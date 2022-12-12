import styles from '../styles/Home.module.css';
import React from "react";
import { Auth } from 'aws-amplify';
import { ChangeActionParams } from '../src/types';

export default function SignOutForm({ username, changeAction, setErrors }:
  { username: string, changeAction: (changeActionParams: ChangeActionParams) => void, setErrors: (authErrors: string) => void }) {

  const handleSignOut = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors('');

    try {
      await Auth.signOut();
      changeAction({ nextAction: 'signIn' });
    } catch (e: any) {
      setErrors(e.toString());
    }
  };

  return (
    <form className={styles.signInForm} onSubmit={handleSignOut}>
      <h3 data-test="sign-in-header-section">Hello, {username}</h3>
      <input className={styles.primaryButton} type="submit" value="Sign Out" data-test="sign-out-button" />
    </form>
  )
}
