"use client"

import React, { useEffect } from 'react';
import { Amplify } from 'aws-amplify';

import { Authenticator, Heading, RadioGroupField, Radio, useAuthenticator, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { useRouter, usePathname } from 'next/navigation';


Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
    }
  }
});

const formFields = {
  signIn: {
    username: {
      label: 'Email',
      placeholder: 'Enter your email',
      isRequired: true,
    },
    password: {
      label: 'Password',
      placeholder: 'Enter your password',
      isRequired: true,
    },
  },
  signUp: {
    username: {
      order: 1,
      label: 'Username',
      placeholder: 'Enter your username',
      isRequired: true,
    },
    email: {
      order: 2,
      label: 'Email',
      placeholder: 'Enter your email',
      isRequired: true,

    },
    password: {
      order: 3,
      label: 'Password',
      placeholder: 'Enter your password',
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      label: 'Confirm Password',
      placeholder: 'Re-enter your password',
      isRequired: true,

    },
  }
};

const components = {
  Header() {
    return (
      <View className="mt-4 mb-7">
        <Heading level={3} className='!text-2xl !font-bold'>
          RENT
          <span className='text-pink-800 font-light hover:!text-fuchsia-400'>IFUL</span>
        </Heading>
        <p ><span className='font-bold'>Welcome!{" "}</span>Please Sign In to Continue</p>
      </View>
    )
  },
  SignIn: {
    Footer() {
      const { toSignUp } = useAuthenticator();
      return (
        <View className="mt-4">
          <p className='text-sm'>Don&apos;t have an account?{" "} <button onClick={toSignUp} className='text-black hover:underline bg-transparent border:none cursor-pointer'>Sign Up</button></p>
        </View>
      );
    }
  },
  SignUp: {
    FormFields() {
      const { validationErrors } = useAuthenticator();
      return (
        <>
          <Authenticator.SignUp.FormFields />
          <RadioGroupField
            legend="Role"
            name="custom:role"
            errorMessage={validationErrors?.['custom:role']}
            hasError={!!validationErrors?.['custom:role']}
            isRequired
          >
            <Radio value="tenant">Tenant</Radio>
            <Radio value="manager">Manager</Radio>
          </RadioGroupField>
        </>
      )
    },
    Footer() {
      const { toSignIn } = useAuthenticator();
      return (
        <View className="mt-4">
          <p className='text-sm'>Already have an account?{" "} <button onClick={toSignIn} className='text-black hover:underline bg-transparent border:none cursor-pointer'>Sign In</button></p>
        </View>
      );
    }
  }
};


const Auth = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname.match(/^\/(signin|signup)$/);
  const isDashboardPage = pathname.startsWith("/manager") || pathname.startsWith("/tenant");

  // Redirect to dashboard if user is authenticated and on auth page
  useEffect(() => {
    if (user && isAuthPage) {
      router.push("/");

    }

  }, [user, isAuthPage, router]);

  //Allow access to public pages without authentication
  if(!isAuthPage && !isDashboardPage ){
    return <>{children}</>;
  }

  return (
    <div className="h-full">
      <Authenticator
      initialState={pathname.includes("signup")? "signUp" : "signIn"}
        components={components}
        formFields={formFields}
      >
        {() => <>{children}</>}
      </Authenticator>
    </div>
  );
}

export default Auth;