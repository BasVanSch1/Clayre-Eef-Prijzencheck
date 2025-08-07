import { useState } from "react";
import { useNavigate } from "react-router";
import type { RolePermission, UserRole } from "./Types";
import { SearchIconInput } from "./Icons";

interface RolesTableProps {
  data?: UserRole[] | undefined | null;
}

const RolesTable = ({ data }: RolesTableProps) => {
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

  function navigateToRole(roleId: string | undefined) {
    if (!roleId) {
      return;
    }

    navigate(`/maintenance/roles/${roleId}`);
  }

  return (
    <>
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

      <table className="row-start-2 col-start-1">
        <thead>
          <tr>
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
                onClick={() => navigateToRole(role.id)}
              >
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
