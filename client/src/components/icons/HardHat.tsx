import { SVGProps } from "react";

const HardHat = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="1em"
      height="1em"
      {...props}
    >
      <path d="M21.632 16.768 20.181 7.77A4.99 4.99 0 0 0 15.223 4H8.777A4.99 4.99 0 0 0 3.819 7.77L2.367 16.768A1 1 0 0 0 3.355 18H9V15a3 3 0 0 1 6 0v3h5.645a1 1 0 0 0 .987-1.232zM12 12a1 1 0 1 1 1-1 1 1 0 0 1-1 1zm3-4H9a1 1 0 0 1 0-2h6a1 1 0 0 1 0 2z"/>
      <path d="M12 17a1 1 0 0 1-1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1-1 1z"/>
    </svg>
  );
};

export default HardHat;
