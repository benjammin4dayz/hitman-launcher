import { Icon, IconProps } from '@chakra-ui/react';

export function IOILogoIcon(
  props: IconProps & React.RefAttributes<SVGSVGElement>
) {
  return (
    <Icon {...props} fontSize="24px">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 37 20"
        fill="currentColor"
      >
        <path d="M2.99163 19.9995V1.9082L0 4.90498V19.9995H2.99163Z" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 0.0078125H2.99163V1.90734H0V0.0078125Z"
        />
        <path d="M26.1998 10.0231L18.0837 18.128L9.9678 10.0139L18.0837 1.90871L26.1998 10.0231ZM20.3827 20L28.7666 11.6552V8.37238L20.3827 0H15.7938L7.41016 8.37238V11.6552L15.7662 20H20.3827Z" />
        <path d="M36.101 19.9995V1.9082L33.1094 4.90498V19.9995H36.101Z" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M33.1094 0.0078125H36.101V1.90734H33.1094V0.0078125Z"
        />
      </svg>
    </Icon>
  );
}
