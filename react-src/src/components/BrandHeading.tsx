import { Heading, HeadingProps } from '@chakra-ui/react';

export function BrandHeading({ children, ...props }: HeadingProps) {
  return (
    <Heading
      as="h1"
      bg="lotion"
      border="3px solid"
      borderColor="black"
      color="black"
      fontFamily="heading"
      fontWeight="bold"
      fontSize="5xl"
      letterSpacing="0.266em"
      m="auto"
      mb="1em"
      px="6"
      py="2"
      textAlign="center"
      w="xs"
      whiteSpace="nowrap"
      {...props}
    >
      {children}
    </Heading>
  );
}
