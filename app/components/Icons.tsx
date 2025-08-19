import { classNames } from "~/root";

interface IconProps {
  width?: string;
  height?: string;
  className?: string;
}

// export const Icon: React.FC<IconProps> = ({
//   width = "800px",
//   height = "800px",
//   className = "",
// }) => {
//   return (

//   );
// };

// export const IconInput: React.FC<IconProps> = ({ className = "" }) => {
//   return (
//     <div
//       className={classNames(
//         className,
//         "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
//       )}
//     >
//       <Icon height="" width="" className="h-4.5 w-4.5 text-gray-500" />
//     </div>
//   );
// };

export const DefaultProfileImage: React.FC<IconProps> = ({
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

export const ProductIcon: React.FC<IconProps> = ({
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

export const UsersIcon: React.FC<IconProps> = ({
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

export const UsersIconInput: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <div
      className={classNames(
        className,
        "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
      )}
    >
      <UsersIcon height="" width="" className="h-4 w-4 text-gray-500" />
    </div>
  );
};

export const SearchIcon: React.FC<IconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
      />
    </svg>
  );
};

export const SearchIconInput: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <div
      className={classNames(
        className,
        "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
      )}
    >
      <SearchIcon height="" width="" className="h-4 w-4 text-gray-500" />
    </div>
  );
};

export const SearchIconAlt: React.FC<IconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
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

export const SearchIconAltInput: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <div
      className={classNames(
        className,
        "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
      )}
    >
      <SearchIconAlt height="" width="" className="h-4 w-4 text-gray-500" />
    </div>
  );
};

export const MailIcon: React.FC<IconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 18L9 12M20 18L15 12M3 8L10.225 12.8166C10.8665 13.2443 11.1872 13.4582 11.5339 13.5412C11.8403 13.6147 12.1597 13.6147 12.4661 13.5412C12.8128 13.4582 13.1335 13.2443 13.775 12.8166L21 8M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const MailIconInput: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <div
      className={classNames(
        className,
        "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
      )}
    >
      <MailIcon height="" width="" className="h-4.5 w-4.5 text-gray-500" />
    </div>
  );
};

export const MailCheckIcon: React.FC<IconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 18L17 20L21 16M11 19H6.2C5.0799 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2C3 7.0799 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H17.8C18.9201 5 19.4802 5 19.908 5.21799C20.2843 5.40973 20.5903 5.71569 20.782 6.09202C21 6.51984 21 7.0799 21 8.2V12M20.6067 8.26229L15.5499 11.6335C14.2669 12.4888 13.6254 12.9165 12.932 13.0827C12.3192 13.2295 11.6804 13.2295 11.0677 13.0827C10.3743 12.9165 9.73279 12.4888 8.44975 11.6335L3.14746 8.09863"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const MailCheckIconInput: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <div
      className={classNames(
        className,
        "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
      )}
    >
      <MailCheckIcon height="" width="" className="h-4.5 w-4.5 text-gray-500" />
    </div>
  );
};

export const KeyIcon: React.FC<IconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.3212 10.6852L4 19L6 21M7 16L9 18M20 7.5C20 9.98528 17.9853 12 15.5 12C13.0147 12 11 9.98528 11 7.5C11 5.01472 13.0147 3 15.5 3C17.9853 3 20 5.01472 20 7.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const KeyIconInput: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <div
      className={classNames(
        className,
        "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
      )}
    >
      <KeyIcon height="" width="" className="h-4.5 w-4.5 text-gray-500" />
    </div>
  );
};

export const IdCardIcon: React.FC<IconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18 12H15M21 8H3M18 16H15M13 19C12.6218 17.2883 10.9747 16 9 16C7.03262 16 5.39034 17.2788 5.00424 18.9811M9 12H9.01M5.00424 18.9811C5.31776 19 5.70396 19 6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.33038 18.9035 4.60979 18.9572 5.00424 18.9811ZM10 12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11C9.55228 11 10 11.4477 10 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const IdCardIconInput: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <div
      className={classNames(
        className,
        "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
      )}
    >
      <IdCardIcon height="" width="" className="h-4.5 w-4.5 text-gray-500" />
    </div>
  );
};

export const UserIcon: React.FC<IconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const UserIconInput: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <div
      className={classNames(
        className,
        "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
      )}
    >
      <UserIcon height="" width="" className="h-4.5 w-4.5 text-gray-500" />
    </div>
  );
};

export const HashIcon: React.FC<IconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 4L7 20M17 4L14 20M5 8H20M4 16H19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const HashIconInput: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <div
      className={classNames(
        className,
        "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
      )}
    >
      <HashIcon height="" width="" className="h-4.5 w-4.5 text-gray-500" />
    </div>
  );
};

export const UserPlusIcon: React.FC<IconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 18L17 18M17 18L14 18M17 18V15M17 18V21M11 21H4C4 17.134 7.13401 14 11 14C11.695 14 12.3663 14.1013 13 14.2899M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const UserPlusIconInput: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <div
      className={classNames(
        className,
        "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
      )}
    >
      <UserPlusIcon height="" width="" className="h-4.5 w-4.5 text-gray-500" />
    </div>
  );
};

export const UserXIcon: React.FC<IconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 16L20 21M20 16L15 21M11 14C7.13401 14 4 17.134 4 21H11M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const UserXIconInput: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <div
      className={classNames(
        className,
        "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
      )}
    >
      <UserXIcon height="" width="" className="h-4.5 w-4.5 text-gray-500" />
    </div>
  );
};

export const TrashIcon: React.FC<IconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const TrashIconInput: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <div
      className={classNames(
        className,
        "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
      )}
    >
      <TrashIcon height="" width="" className="h-4.5 w-4.5 text-gray-500" />
    </div>
  );
};

export const ShieldPlusIcon: React.FC<IconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 12H15M12 8.99999V15M20 12C20 16.4611 14.54 19.6937 12.6414 20.683C12.4361 20.79 12.3334 20.8435 12.191 20.8712C12.08 20.8928 11.92 20.8928 11.809 20.8712C11.6666 20.8435 11.5639 20.79 11.3586 20.683C9.45996 19.6937 4 16.4611 4 12V8.21759C4 7.41808 4 7.01833 4.13076 6.6747C4.24627 6.37113 4.43398 6.10027 4.67766 5.88552C4.9535 5.64243 5.3278 5.50207 6.0764 5.22134L11.4382 3.21067C11.6461 3.13271 11.75 3.09373 11.857 3.07827C11.9518 3.06457 12.0482 3.06457 12.143 3.07827C12.25 3.09373 12.3539 3.13271 12.5618 3.21067L17.9236 5.22134C18.6722 5.50207 19.0465 5.64243 19.3223 5.88552C19.566 6.10027 19.7537 6.37113 19.8692 6.6747C20 7.01833 20 7.41808 20 8.21759V12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ShieldPlusIconInput: React.FC<IconProps> = ({
  className = "",
}) => {
  return (
    <div
      className={classNames(
        className,
        "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
      )}
    >
      <ShieldPlusIcon
        height=""
        width=""
        className="h-4.5 w-4.5 text-gray-500"
      />
    </div>
  );
};

export const TextIcon: React.FC<IconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3V21M9 21H15M19 6V3H5V6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const TextIconInput: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <div
      className={classNames(
        className,
        "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
      )}
    >
      <TextIcon height="" width="" className="h-4.5 w-4.5 text-gray-500" />
    </div>
  );
};

export const ClockIcon: React.FC<IconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 7V12L14.5 13.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ClockIconInput: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <div
      className={classNames(
        className,
        "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
      )}
    >
      <ClockIcon height="" width="" className="h-4.5 w-4.5 text-gray-500" />
    </div>
  );
};

export const DownloadIcon: React.FC<IconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H6.6M12 15V4M12 15L9 12M12 15L15 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DownloadIconInput: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <div
      className={classNames(
        className,
        "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
      )}
    >
      <DownloadIcon height="" width="" className="h-4.5 w-4.5 text-gray-500" />
    </div>
  );
};

export const UserBlockIcon: React.FC<IconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 14C7.13401 14 4 17.134 4 21H11M14.8086 19.7053L19.127 16.3467M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7ZM20 18C20 19.6569 18.6569 21 17 21C15.3431 21 14 19.6569 14 18C14 16.3431 15.3431 15 17 15C18.6569 15 20 16.3431 20 18Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const UserBlockIconInput: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <div
      className={classNames(
        className,
        "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
      )}
    >
      <UserBlockIcon height="" width="" className="h-4.5 w-4.5 text-gray-500" />
    </div>
  );
};

export const UserCheckIcon: React.FC<IconProps> = ({
  width = "800px",
  height = "800px",
  className = "",
}) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.9999 15.2547C13.8661 14.4638 12.4872 14 10.9999 14C7.40399 14 4.44136 16.7114 4.04498 20.2013C4.01693 20.4483 4.0029 20.5718 4.05221 20.6911C4.09256 20.7886 4.1799 20.8864 4.2723 20.9375C4.38522 21 4.52346 21 4.79992 21H9.94465M13.9999 19.2857L15.7999 21L19.9999 17M14.9999 7C14.9999 9.20914 13.2091 11 10.9999 11C8.79078 11 6.99992 9.20914 6.99992 7C6.99992 4.79086 8.79078 3 10.9999 3C13.2091 3 14.9999 4.79086 14.9999 7Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const UserCheckIconInput: React.FC<IconProps> = ({ className = "" }) => {
  return (
    <div
      className={classNames(
        className,
        "pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
      )}
    >
      <UserCheckIcon height="" width="" className="h-4.5 w-4.5 text-gray-500" />
    </div>
  );
};
