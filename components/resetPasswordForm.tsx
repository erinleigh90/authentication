import styles from '../styles/Home.module.css';
import React, { useState } from "react";
import { Auth } from 'aws-amplify';
import { ChangeActionParams } from '../src/types';

export default function ResetPasswordForm({ changeAction, setErrors }:
  { changeAction: (changeActionParams: ChangeActionParams) => void, setErrors: (authErrors: string) => void}) {
  
  const [codeSent, setCodeSent] = useState(false);

  const handleReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let form: FormData = new FormData(event.target as HTMLFormElement);
    setErrors('');

    const username = form.get('username') as string;
    const code = form.get('code') as string;
    const newPassword = form.get('newPassword') as string;

    try {
      if (!codeSent) {
        await Auth.forgotPassword(username);
        setCodeSent(true);
      } else { 
        await Auth.forgotPasswordSubmit(username, code, newPassword);
        changeAction({nextAction: 'signIn'});
      }
    } catch (e: any) {
      setErrors(e.toString());
    }
  };

  const handleSignIn = async () => { 
    changeAction({ nextAction: 'signIn'});
  }

  const handleCreateAccount = async () => { 
    changeAction({ nextAction: 'signUp' });
  }

  return (
    <form className={styles.signInForm} onSubmit={handleReset}>
      <h3 data-test="forgot-password-header-section">Reset your password</h3>
      <div className={styles.inputFields}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          data-test="username-input"
          required />
        {codeSent ? <>
          <input
            type="text"
            name="code"
            placeholder="Verification Code"
            required />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            required />
        </> : null}
      </div>
      <div>
        <div className={styles.linksDiv}>
          <a onClick={handleSignIn} data-test="forgot-password-back-to-sign-in-link">Sign in</a>&nbsp;|&nbsp;
          <a onClick={handleCreateAccount} data-test="sign-in-create-account-link">Create account</a>
        </div>
        <input className={styles.primaryButton} type="submit" value="Sign In" data-test="sign-in-sign-in-button" />
      </div>
    </form>
  )
}
