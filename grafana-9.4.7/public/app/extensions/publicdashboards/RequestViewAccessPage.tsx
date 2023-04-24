import { css } from '@emotion/css';
import React from 'react';

import { Button, Field, Form, Input } from '@grafana/ui';
import { InnerBox, LoginLayout } from 'app/core/components/Login/LoginLayout';

const formStyles = css`
  justify-content: center;
  width: 100%;
`;

const validEmailRegex = /^[A-Z\d._%+-]+@[A-Z\d.-]+\.[A-Z]{2,}$/i;

interface FormData {
  email: string;
}

const RequestViewAccessPage = () => {
  const handleSubmit = (data: FormData) => {
    //TODO make request to get access
  };

  return (
    <LoginLayout
      branding={{
        loginSubtitle:
          'Enter your email to request access to the dashboard. You will receive an email with a one-time use link.',
        loginTitle: 'Request Access',
        hideFooter: true,
      }}
    >
      <InnerBox>
        <Form className={formStyles} onSubmit={handleSubmit} validateOn="onChange">
          {({ register, errors, formState: { isSubmitSuccessful } }) => (
            <>
              <Field label="Email" error={errors?.email?.message} invalid={!!errors.email}>
                <Input
                  data-testid="requestAccessEmail"
                  placeholder="email"
                  autoCapitalize="none"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: validEmailRegex, message: 'Invalid email' },
                  })}
                />
              </Field>
              <Button
                data-testid="requestAccessSubmitButton"
                disabled={isSubmitSuccessful}
                type="submit"
                className={formStyles}
              >
                {isSubmitSuccessful ? 'Access requested' : 'Request access'}
              </Button>
            </>
          )}
        </Form>
      </InnerBox>
    </LoginLayout>
  );
};

export default RequestViewAccessPage;
