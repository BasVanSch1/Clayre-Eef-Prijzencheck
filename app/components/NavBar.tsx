import {
  Button,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router";
import Logo from "/milatonie_logo.svg";
import { useEffect, useState } from "react";
import { classNames } from "~/root";
import { useLoaderData } from "react-router";
import type { RolePermission, User } from "./Types";
import { DefaultProfileImage } from "./Icons";

const NavBar = () => {
  const [theme, setTheme] = useState("light");
  const user = useLoaderData().user as User | null;
  const productCount = useLoaderData().productCount as number;
  console.log("User data in NavBar:", user, "Product count:", productCount);

  const navigation = [
    { name: "Home", href: "/" },
    {
      name: "Products",
      href: "/products",
      children: [
        <span
          key="productCountBadge"
          className="bg-indigo-50 text-indigo-500 border border-indigo-400 text-xs font-medium px-1.5 rounded-full py-0.5"
        >
          {productCount}
        </span>,
      ],
    },
    ...(user?.permissions?.some(
      (perm: RolePermission) => perm.name === "prijzencheck.pages.maintenance"
    )
      ? [{ name: "Maintenance", href: "/maintenance" }]
      : []),
  ];

  let userNavigation: any[];
  if (user) {
    userNavigation = [
      { name: "Settings", href: "/settings" },
      { name: "Sign out", href: "/logout" },
    ];
  } else {
    userNavigation = [{ name: "Sign in", href: "/login" }];
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="shrink-0">
              <img
                alt="Logo"
                src={Logo}
                className="size-10 brightness-0 invert"
              />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-sm font-medium"
                      )
                    }
                  >
                    {item.name}
                    {item.children && (
                      <span className="ml-1">{item.children}</span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <Button
                onClick={toggleTheme}
                className="rounded-full p-1 bg-white shadow shadow-purple-400 dark:shadow-amber-400 cursor-pointer"
              >
                {theme === "light" ? "🌙" : "☀"}
              </Button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 cursor-pointer">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>

                    {user?.avatar ? (
                      <img
                        src={`/data/${user.id}-avatar?=${
                          user.avatarVersion ?? 0
                        }`}
                        className="size-8 rounded-full"
                      />
                    ) : (
                      <div className="relative size-8 bg-gray-100 flex justify-center items-center rounded-full">
                        <DefaultProfileImage />
                      </div>
                    )}
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      <NavLink
                        to={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                      >
                        {item.name}
                      </NavLink>
                    </MenuItem>
                  ))}
                </MenuItems>
              </Menu>
            </div>
          </div>
          <div className="-mr-2 flex items-center gap-0.5 md:hidden">
            <Button
              onClick={toggleTheme}
              className="rounded-full p-1 bg-white shadow shadow-purple-400 dark:shadow-amber-400 cursor-pointer"
            >
              {theme === "light" ? "🌙" : "☀"}
            </Button>
            {/* Mobile menu button */}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-open:block"
              />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel className="md:hidden">
        {({ close }) => (
          <>
            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    classNames(
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )
                  }
                  onClick={() => close()}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
            <div className="border-t border-gray-700 pt-4 pb-3">
              <div className="flex items-center px-5">
                <div className="shrink-0">
                  {user?.avatar ? (
                    <img
                      src={`/data/${user.id}-avatar?v=${
                        user.avatarVersion ?? 0
                      }`}
                      className="size-8 rounded-full"
                    />
                  ) : (
                    <div className="relative size-8 bg-gray-100 flex justify-center items-center rounded-full">
                      <DefaultProfileImage />
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base/5 font-medium text-white">
                    {user?.name || "Not logged in"}
                  </div>
                  <div className="text-sm font-medium text-gray-400">
                    {user?.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1 px-2">
                {userNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    onClick={() => close()}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </>
        )}
      </DisclosurePanel>
    </Disclosure>
  );
};

export default NavBar;
