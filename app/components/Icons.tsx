interface DefaultProfileImageProps {
  width?: string;
  height?: string;
  className?: string;
}

interface ProductIconProps {
  width?: string;
  height?: string;
  className?: string;
}

interface UserIconProps {
  width?: string;
  height?: string;
  className?: string;
}

interface SearchIconProps {
  width?: string;
  height?: string;
  className?: string;
}

export const DefaultProfileImage: React.FC<DefaultProfileImageProps> = ({
  width = "100",
  height = "100",
  className = "",
}) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        className={className}
      >
        <path
          d="M15.9998 7C15.9998 9.20914 14.2089 11 11.9998 11C9.79067 11 7.99981 9.20914 7.99981 7C7.99981 4.79086 9.79067 3 11.9998 3C14.2089 3 15.9998 4.79086 15.9998 7Z"
          stroke="#4B5563"
          strokeWidth="1.6"
        />
        <path
          d="M11.9998 14C9.15153 14 6.65091 15.3024 5.23341 17.2638C4.48341 18.3016 4.10841 18.8204 4.6654 19.9102C5.2224 21 6.1482 21 7.99981 21H15.9998C17.8514 21 18.7772 21 19.3342 19.9102C19.8912 18.8204 19.5162 18.3016 18.7662 17.2638C17.3487 15.3024 14.8481 14 11.9998 14Z"
          stroke="#4B5563"
          strokeWidth="1.6"
        />
      </svg>
    </>
  );
};

export const ProductIcon: React.FC<ProductIconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g transform="translate(-325.000000, -80.000000)">
          <g transform="translate(325.000000, 80.000000)">
            <polygon
              fill="#FFFFFF"
              fillOpacity="0.01"
              fillRule="nonzero"
              points="24 0 0 0 0 24 24 24"
            />
            <polygon
              points="22 7 12 2 2 7 2 17 12 22 22 17"
              stroke="#212121"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <line
              stroke="#212121"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              x1="2"
              x2="12"
              y1="7"
              y2="12"
            />
            <line
              stroke="#212121"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              x1="12"
              x2="12"
              y1="22"
              y2="12"
            />
            <line
              stroke="#212121"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              x1="22"
              x2="12"
              y1="7"
              y2="12"
            />
            <line
              stroke="#212121"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              x1="17"
              x2="7"
              y1="4.5"
              y2="9.5"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

export const UserIcon: React.FC<UserIconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g
          stroke="#212121"
          strokeWidth="1.5"
          transform="translate(-175.000000, -142.000000)"
        >
          <g transform="translate(175.000000, 142.000000)">
            <g transform="translate(4.000000, 3.000000)">
              <path d="M14.5,6 C13.1193,6 12,4.8807 12,3.5 C12,2.11929 13.1193,1 14.5,1 C15.8807,1 17,2.11929 17,3.5 C17,4.8807 15.8807,6 14.5,6 Z" />
              <path d="M2,4 C0.89543,4 0,3.10455 0,2 C0,0.89543 0.89543,0 2,0 C3.10455,0 4,0.89543 4,2 C4,3.10455 3.10455,4 2,4 Z" />
              <path
                d="M9,17.5 L12,15 L12,12 C12,10.26695 13,9 14.5,9 C16,9 17,10.26695 17,12 L17,14.4186 L17,19"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8,14.5 L5,12 L5,10 C5,8.26695 4,7 2.5,7 C1,7 0,8.26695 0,10 L0,11.4186 L0,19"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export const SearchIcon: React.FC<SearchIconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g transform="translate(-327.000000, -142.000000)">
          <g transform="translate(327.000000, 142.000000)">
            <rect
              fill="#FFFFFF"
              fillOpacity="0.01"
              fillRule="nonzero"
              height="24"
              width="24"
              x="0"
              y="0"
            />
            <path
              d="M10.5,19 C15.1944,19 19,15.1944 19,10.5 C19,5.8056 15.1944,2 10.5,2 C5.8056,2 2,5.8056 2,10.5 C2,15.1944 5.8056,19 10.5,19 Z"
              stroke="#212121"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M13.3284,7.17155 C12.60455,6.4477 11.60455,6 10.5,6 C9.39545,6 8.39545,6.4477 7.67155,7.17155"
              stroke="#212121"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <line
              stroke="#212121"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              x1="16.6109"
              x2="20.85355"
              y1="16.6109"
              y2="20.85355"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
