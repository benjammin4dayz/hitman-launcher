import type { ButtonProps as ChakraButtonProps } from '@chakra-ui/react';
import {
  AbsoluteCenter,
  Button as ChakraButton,
  Span,
  Spinner,
} from '@chakra-ui/react';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface ButtonLoadingProps {
  loading?: boolean;
  loadingText?: React.ReactNode;
}

export interface ButtonProps extends ChakraButtonProps, ButtonLoadingProps {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const { loading, disabled, loadingText, children, ...rest } = props;
    return (
      <ChakraButton disabled={loading || disabled} ref={ref} {...rest}>
        {loading && !loadingText ? (
          <>
            <AbsoluteCenter display="inline-flex">
              <Spinner size="inherit" color="inherit" />
            </AbsoluteCenter>
            <Span opacity={0}>{children}</Span>
          </>
        ) : loading && loadingText ? (
          <>
            <Spinner size="inherit" color="inherit" />
            {loadingText}
          </>
        ) : (
          children
        )}
      </ChakraButton>
    );
  }
);

export const RouteButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { to: string }
>(function RouteButton(props, ref) {
  const navigate = useNavigate();

  return (
    // Do not use `as={Link}` because it allows new windows to be spawned via
    // middle-click; these windows cannot connect to the app because the
    // one-time token is already consumed by the main window. It also displays
    // the URL in the bottom left which feels out-of-place given the context.
    <Button
      {...props}
      ref={ref}
      onClick={e => {
        props.onClick?.(e);
        void navigate(props.to);
      }}
    />
  );
});
