import styles from '../styles/Home.module.css';
import { GetServerSideProps } from 'next';
import { withSSRContext } from 'aws-amplify';
import React, { useState } from "react";
import { SignInForm, SignUpForm, ConfirmEmailForm, SignOutForm, ResetPasswordForm } from '../components';
import { ChangeActionParams } from '../src/types';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const SSR = withSSRContext(context);
  try {
    const user = await SSR.Auth.currentAuthenticatedUser();
    console.log(user);
    return {
      props: {initialUsername: user.username},
    }
  } catch (e) { 
    console.log(e);
  }
  return { props: {} }
}

export default function Home({ initialUsername } : {initialUsername: string}) {
  const initialType = (initialUsername) ? 'signOut' : 'signIn';
  const [authType, setAuthType] = useState(initialType);
  const [authErrors, setAuthErrors] = useState('');
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState('');

  const changeAction = ({ nextAction, username, password }: ChangeActionParams) => {
    if (username) { 
      setUsername(username);
    }
    if (password) { 
      setPassword(password);
    }
    if (nextAction) {
      setAuthType(nextAction);
    }
  }

  const renderForm = () => { 
    switch (authType) {
      case 'signIn':
        return <SignInForm changeAction={changeAction} setErrors={setAuthErrors} />
      case 'signUp':
        return <SignUpForm changeAction={changeAction} setErrors={setAuthErrors} />
      case 'confirm':
        return <ConfirmEmailForm username={username} password={password} changeAction={changeAction} setErrors={setAuthErrors} />
      case 'signOut':
        return <SignOutForm username={username} changeAction={changeAction} setErrors={setAuthErrors} />
      case 'resetPassword':
        return <ResetPasswordForm changeAction={changeAction} setErrors={setAuthErrors}/>
    }
    return null;
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div>
          <div className={styles.authenticator}>
            <div className={styles.body}>
              {authErrors ?
                <div className={styles.errorMessage}>
                  <div className={styles.errorIcon}>
                    <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true" focusable="false">
                      <path d="m23.49 20.79c.39.73.12 1.64-.61 2.03-.22.12-.46.18-.71.18h-20.33c-.83 0-1.5-.67-1.5-1.5 0-.25.06-.49.18-.71l10.16-18.94c.39-.73 1.3-1 2.03-.61.26.14.47.35.61.61zm-11.05-18.47c-.05-.09-.12-.16-.2-.2-.24-.13-.55-.04-.68.2l-10.16 18.94c-.04.07-.06.15-.06.24 0 .28.22.5.5.5h20.33c.08 0 .16-.02.24-.06.24-.13.33-.43.2-.68zm-.48 4.68c-.58.02-1.04.51-1.02 1.1l.29 7.42c.01.27.23.48.5.48h.54c.27 0 .49-.21.5-.48l.29-7.42c0-.01 0-.03 0-.04 0-.58-.47-1.06-1.06-1.06-.01 0-.03 0-.04 0zm-.96 12c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1z"></path>
                    </svg>
                  </div>
                  <div className={styles.errorText} data-test="authenticator-error">
                    {authErrors}
                  </div>
                </div>
                : null}
              {renderForm()}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
