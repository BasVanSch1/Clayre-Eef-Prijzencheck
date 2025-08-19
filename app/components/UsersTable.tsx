import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import type { User } from "./Types";
import {
  SearchIconInput,
  UserBlockIcon,
  UserCheckIcon,
  UserPlusIcon,
  UserXIcon,
} from "./Icons";
import ConfirmationModal from "./Modals/ConfirmationModal";
import { classNames } from "~/root";

interface UsersTableProps {
  data?: User[] | undefined | null;
  addUser?: boolean;
  removeUser?: boolean;
}

const UsersTable = ({ data, addUser, removeUser }: UsersTableProps) => {
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

  function navigateToUser(
    event: React.MouseEvent<HTMLElement>,
    userId: string
  ) {
    if (!userId) {
      return;
    }

    // Prevent navigation if the click is on a link/icon
    const target = event.target as HTMLElement;
    if (
      target.tagName === "a" ||
      target.tagName === "svg" ||
      target.tagName === "path"
    ) {
      return;
    }

    navigate(`/maintenance/users/${userId}`);
  }

  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [enableUser, setEnableUser] = useState<{
    id: string;
    enable: boolean;
  } | null>(null);

  const handleConfirmDelete = () => {
    if (!deleteUserId) {
      setConfirmationModalOpen(false);
      return;
    }

    navigate(`/maintenance/users/${deleteUserId}/delete`);
  };

  const handleToggleEnabled = () => {
    if (!enableUser) {
      setConfirmationModalOpen(false);
      return;
    }

    navigate(`/maintenance/users/${enableUser.id}/toggleEnabled`);
  };

  return (
    <>
      {deleteUserId && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setConfirmationModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete User"
          message="Are you sure you want to delete this user?"
        />
      )}

      {enableUser && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setConfirmationModalOpen(false)}
          onConfirm={handleToggleEnabled}
          title={`${enableUser.enable ? "Enable" : "Disable"} User`}
          message={`Are you sure you want to ${
            enableUser.enable ? "enable" : "disable"
          } this user?`}
        />
      )}

      <div className="relative row-start-1 col-start-1">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
          <SearchIconInput />
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

      {addUser && (
        <div className="row-start-2 col-start-1 flex">
          <NavLink
            to="/maintenance/users/new"
            className="mt-2 cursor-pointer rounded-md bg-[#007bff] hover:bg-[#0066ff] p-1 text-sm md:text-base text-white shadow-md transition-colors duration-200 dark:bg-purple-700 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-0 dark:focus:bg-purple-600 dark:text-neutral-300"
          >
            <span className="flex items-center gap-1">
              <UserPlusIcon className="h-4.5 w-4.5 me-1" />
              New User
            </span>
          </NavLink>
        </div>
      )}

      <table className="row-start-3 col-start-1">
        <thead>
          <tr>
            <th scope="col" className={thClassNames}></th>
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
                onClick={(e) => navigateToUser(e, user.id)}
              >
                <td className="w-0 flex">
                  {removeUser && (
                    <div
                      onClick={() => {
                        setDeleteUserId(user.id);
                        setConfirmationModalOpen(true);
                      }}
                    >
                      <UserXIcon className="h-4.5 w-4.5 text-red-600 hover:text-red-700" />
                    </div>
                  )}

                  <div
                    onClick={() => {
                      setEnableUser({ id: user.id, enable: !user.enabled });
                      setConfirmationModalOpen(true);
                    }}
                  >
                    {user.enabled ? (
                      <UserCheckIcon className="h-4.5 w-4.5 text-green-600 hover:text-green-700" />
                    ) : (
                      <UserBlockIcon className="h-4.5 w-4.5 text-red-600 hover:text-red-700" />
                    )}
                  </div>
                </td>
                <td
                  className={classNames(
                    user.enabled ? "" : "text-neutral-400",
                    tdClassNames
                  )}
                >
                  {user.name}
                </td>
                <td
                  className={classNames(
                    user.enabled ? "" : "text-neutral-400",
                    tdClassNames
                  )}
                >
                  {user.username}
                </td>
                <td
                  className={classNames(
                    user.enabled ? "" : "text-neutral-400",
                    tdClassNames
                  )}
                >
                  {user.email}
                </td>
                <td
                  className={`${tdClassNames} hidden md:flex md:flex-wrap md:gap-1`}
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
