import styles from '../styles/Home.module.css';
import React from "react";
import { Auth } from 'aws-amplify';
import { ChangeActionParams } from '../src/types';

export default function SignInForm({ changeAction, setErrors }:
  { changeAction: ((changeActionParams: ChangeActionParams) => void), setErrors: (authErrors: string) => void }) {
  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let form: FormData = new FormData(event.target as HTMLFormElement);
    setErrors('');

    const username = form.get('username') as string;
    const password = form.get('password') as string;

    if (!username) { 
      setErrors('Username cannot be empty');
    }

    try {
      await Auth.signIn(username, password);
      changeAction({ nextAction: 'signOut', username });
    } catch (e: any) {
      if (e.toString().indexOf('UserNotConfirmedException') >= 0) {
        changeAction({ nextAction: 'confirm', username, password });
      } else {
        setErrors(e.toString());
      }
    }
  };

  const handlePasswordReset = async () => { 
    changeAction({ nextAction: 'resetPassword' });
  }

  const handleCreateAccount = async () => { 
    changeAction({ nextAction: 'signUp' });
  }

  return (
    <form className={styles.signInForm} onSubmit={handleSignIn}>
      <h3 data-test="sign-in-header-section">Sign in to your account</h3>
      <div className={styles.inputFields}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          data-test="username-input"/>
        <input
          type="password"
          name="password"
          placeholder="Password"
          data-test="sign-in-password-input"/>
      </div>
      <div>
        <div className={styles.linksDiv}>
          <a onClick={handleCreateAccount} data-test="sign-in-create-account-link">Create account</a>&nbsp;|&nbsp;
          <a onClick={handlePasswordReset} data-test="sign-in-forgot-password-link">Reset password</a>
        </div>
        <input className={styles.primaryButton} type="submit" value="Sign In" data-test="sign-in-sign-in-button" />
      </div>
    </form>
  )
}
