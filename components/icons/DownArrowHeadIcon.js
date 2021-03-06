import React from 'react';
import CustomStyledIcon from './CustomStyledIcon';

const DownArrowHead = props => {
  return (
    <CustomStyledIcon
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="0.5" y="0.5" width="25" height="25" rx="12.5" fill="white" stroke="#297EFF" />
      <path
        d="M16.9416 11.7065L16.081 11.0359C16.0473 11.0098 16.004 10.9989 15.9593 11.0001C15.9153 11.0031 15.8743 11.0222 15.8456 11.0531L12.999 14.0992L10.1544 11.0531C10.1254 11.0222 10.0844 11.0031 10.0404 11.0001C9.99778 10.9992 9.95245 11.0098 9.91878 11.0359L9.05814 11.7065C9.02447 11.7329 9.00381 11.7702 9.00047 11.8105C8.99714 11.8508 9.01147 11.8905 9.04081 11.9208L12.8734 15.9476C12.905 15.9806 12.951 16 12.9994 16C13.0477 16 13.0937 15.9809 13.1254 15.9476L16.9593 11.9208C16.9883 11.8902 17.0026 11.8508 16.9996 11.8105C16.9963 11.7702 16.9753 11.7329 16.9416 11.7065Z"
        fill="#1869F5"
      />
    </CustomStyledIcon>
  );
};

export default DownArrowHead;
