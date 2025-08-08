import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import type { RolePermission, UserRole } from "./Types";
import { SearchIconInput, ShieldPlusIcon, TrashIcon } from "./Icons";
import ConfirmationModal from "./Modals/ConfirmationModal";

interface RolesTableProps {
  data?: UserRole[] | undefined | null;
  addRole?: boolean;
  removeRole?: boolean;
}

const RolesTable = ({ data, addRole, removeRole }: RolesTableProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const thClassNames =
    "px-1.5 md:px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500";
  const tdClassNames =
    "px-1.5 md:px-6 py-2 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 text-wrap";

  const filteredData = data?.filter((role) => {
    const roleName = role.name.toLowerCase();
    const roleDescription = role.description?.toLowerCase() || "";
    const rolePermissions: string[] = role.permissions
      ? role.permissions.map((perm) => perm.name.toLowerCase())
      : [];

    return (
      roleName.includes(searchTerm) ||
      roleDescription.includes(searchTerm) ||
      rolePermissions.some((perm) => perm.includes(searchTerm))
    );
  });

  function navigateToRole(
    event: React.MouseEvent<HTMLElement>,
    roleId: string | undefined
  ) {
    if (!roleId) {
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

    navigate(`/maintenance/roles/${roleId}`);
  }

  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [deleteRoleId, setDeleteRoleId] = useState<string | null | undefined>(
    null
  );

  const handleConfirmDelete = () => {
    console.log("Confirmed!");
    if (!deleteRoleId) {
      setConfirmationModalOpen(false);
      return;
    }

    navigate(`/maintenance/roles/${deleteRoleId}/delete`);
  };

  return (
    <>
      {deleteRoleId && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setConfirmationModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Role"
          message="Are you sure you want to delete this role?"
        />
      )}

      <div className="relative row-start-1 col-start-1">
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
          <SearchIconInput />
        </div>

        <input
          type="text"
          id="rolesSearch"
          placeholder="Search for a role..."
          className="block w-full rounded-lg border border-gray-400 bg-white p-1 ps-10 text-sm text-gray-900 focus:ring-0 focus:outline-none focus:border-[#0066ff] transition-colors duration-200 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-300 dark:focus:outline-none dark:focus:ring-0 dark:focus:border-purple-500"
          autoFocus={true}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
      </div>

      {addRole && (
        <div className="row-start-2 col-start-1 flex">
          <NavLink
            to="/maintenance/roles/new"
            className="mt-2 cursor-pointer rounded-md bg-[#007bff] hover:bg-[#0066ff] p-1 text-sm md:text-base text-white shadow-md transition-colors duration-200 dark:bg-purple-700 dark:hover:bg-purple-600 dark:focus:outline-none dark:focus:ring-0 dark:focus:bg-purple-600 dark:text-neutral-300"
          >
            <span className="flex items-center gap-1">
              <ShieldPlusIcon className="h-4.5 w-4.5 me-1" />
              New Role
            </span>
          </NavLink>
        </div>
      )}

      <table className="row-start-3 col-start-1">
        <thead>
          <tr>
            {removeRole && <th scope="col" className={thClassNames}></th>}
            <th scope="col" className={thClassNames}>
              Name
            </th>
            <th scope="col" className={thClassNames}>
              Description
            </th>
            <th scope="col" className={`${thClassNames} hidden md:table-cell`}>
              Permissions
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
                No roles available
              </td>
            </tr>
          ) : (
            filteredData.map((role: UserRole) => (
              <tr
                key={role.id}
                className="hover:bg-gray-200 dark:hover:bg-neutral-800 cursor-pointer"
                onClick={(e) => navigateToRole(e, role.id)}
              >
                {removeRole && (
                  <td className="w-0">
                    <div
                      onClick={() => {
                        setDeleteRoleId(role.id);
                        setConfirmationModalOpen(true);
                      }}
                    >
                      <TrashIcon className="h-4.5 w-4.5 text-red-600 hover:text-red-700" />
                    </div>
                  </td>
                )}
                <td className={tdClassNames}>{role.name}</td>
                <td className={tdClassNames}>{role.description}</td>
                <td
                  className={`${tdClassNames} hidden md:flex md:flex-wrap gap-1`}
                >
                  {role.permissions && role.permissions.length > 0 ? (
                    <>
                      {role.permissions
                        .slice(0, 3)
                        .map((perm: RolePermission) => (
                          <p
                            key={perm.id}
                            className="border border-blue-400 rounded-md shadow-md bg-blue-300 text-black text-sm p-1"
                          >
                            {perm.name}
                          </p>
                        ))}
                      {role.permissions.length > 3 && (
                        <p className="text-black text-sm p-1">more...</p>
                      )}
                    </>
                  ) : (
                    <p className="text-xs">No permissions</p>
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

export default RolesTable;
