import styles from '../styles/Home.module.css';
import React from "react";
import { Auth } from 'aws-amplify';
import { ChangeActionParams } from '../src/types';

export default function SignUpForm({ changeAction, setErrors }:
  { changeAction: (changeActionParams: ChangeActionParams) => void, setErrors: (authErrors: string) => void }) {
  
  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let form: FormData = new FormData(event.target as HTMLFormElement);
    setErrors('');

    const username = form.get('username') as string;
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email
        }
      });
      changeAction({ nextAction: 'confirm', username, password });
    } catch (e: any) {
      setErrors(e.toString());
    }
  };

  const handleSignIn = async () => { 
    changeAction({ nextAction: 'signIn'});
  }

  const handlePasswordReset = async () => { 
    changeAction({ nextAction: 'resetPassword' });
  }

  return (
    <form className={styles.signInForm} onSubmit={handleSignUp}>
      <h3 data-test="sign-up-header-section">Create a new account</h3>

      <div className={styles.inputFields}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          data-test="username-input"
          required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          data-test="password-input"
          required />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required />
        <input
          type="phone"
          name="phone"
          placeholder="Phone Number"
          data-test="phone-number-input" />
      </div>
      <div className={styles.linksDiv}>          
        <a onClick={handleSignIn} data-test="sign-up-sign-in-link">Sign in</a>&nbsp;|&nbsp;
        <a onClick={handlePasswordReset} data-test="sign-in-forgot-password-link">Reset password</a>
      </div>
      <input className={styles.primaryButton} type="submit" value="Create Account" data-test="sign-up-create-account-button" />
    </form>
  )
}
