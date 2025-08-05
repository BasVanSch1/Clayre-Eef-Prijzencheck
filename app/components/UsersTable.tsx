import { useState } from "react";
import { useNavigate } from "react-router";
import type { User } from "./Types";

interface UsersTableProps {
  data?: User[] | undefined | null;
}

const UsersTable = ({ data }: UsersTableProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const thClassNames =
    "px-1.5 md:px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500";
  const tdClassNames =
    "px-1.5 md:px-6 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 text-wrap";

  const filteredData = data?.filter((user) => {
    const userName = user.username.toLowerCase();
    const userDisplayName = user.name.toLowerCase();
    const userEmail = user.email.toLowerCase();
    const userRoles: string[] = user.roles
      ? user.roles.map((role) => role.name.toLowerCase())
      : [];

    return (
      userName.includes(searchTerm) ||
      userDisplayName.includes(searchTerm) ||
      userEmail.includes(searchTerm) ||
      userRoles.some((role) => role.includes(searchTerm))
    );
  });

  function navigateToUser(userId: string) {
    if (!userId) {
      return;
    }

    navigate(`/maintenance/users/${userId}`);
  }

  return (
    <>
      <div className="relative row-start-1 col-start-1">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
          <svg
            className="h-4 w-4 text-gray-500"
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
        </div>

        <input
          type="text"
          id="usersSearch"
          placeholder="Search for a user..."
          className="block w-full rounded-lg border border-gray-400 bg-white p-1 ps-10 text-sm text-gray-900 focus:ring-0 focus:outline-none focus:border-[#0066ff] transition-colors duration-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
          autoFocus={true}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
      </div>

      <table className="row-start-2 col-start-1">
        <thead>
          <tr>
            <th scope="col" className={thClassNames}>
              Name
            </th>
            <th scope="col" className={thClassNames}>
              Username
            </th>
            <th scope="col" className={thClassNames}>
              Email
            </th>
            <th scope="col" className={`${thClassNames} hidden md:table-cell`}>
              Roles
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
          {!filteredData || filteredData.length <= 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-4 text-center text-gray-500 dark:text-neutral-400"
              >
                No users available
              </td>
            </tr>
          ) : (
            filteredData.map((user: User) => (
              <tr
                key={user.id}
                className="hover:bg-gray-200 dark:hover:bg-neutral-800 cursor-pointer"
                onClick={() => navigateToUser(user.id)}
              >
                <td className={tdClassNames}>{user.name}</td>
                <td className={tdClassNames}>{user.username}</td>
                <td className={tdClassNames}>{user.email}</td>
                <td
                  className={`${tdClassNames} hidden md:flex md:flex-wrap gap-1`}
                >
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role) => {
                      return (
                        <p
                          key={role.id}
                          className="border border-blue-400 rounded-md shadow-md bg-blue-300 text-black text-sm p-1"
                        >
                          {role.name}
                        </p>
                      );
                    })
                  ) : (
                    <p className="text-xs">No roles</p>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
};

export default UsersTable;
