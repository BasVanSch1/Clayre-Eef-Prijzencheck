import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("product", "routes/layouts/product.tsx", [
    index("routes/productIndex.tsx"),
    route(":code", "routes/product.tsx"),
  ]),
  route("products", "routes/products.tsx"),
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
  route("settings", "routes/settings.tsx"),
  route("data/:id", "routes/retrieveData.tsx"),
  route("maintenance", "routes/layouts/maintenance.tsx", [
    index("routes/maintenance/statistics.tsx"),
    route("roles", "routes/maintenance/roles.tsx"),
    route("roles/:id", "routes/maintenance/roles/roleDetails.tsx"),
    route("roles/:id/delete", "routes/maintenance/roles/deleteRole.tsx"),
    route("roles/new", "routes/maintenance/roles/newRole.tsx"),
    route("users", "routes/maintenance/users.tsx"),
    route("users/:id", "routes/maintenance/users/userDetails.tsx"),
    route("users/:id/delete", "routes/maintenance/users/deleteUser.tsx"),
    route("users/new", "routes/maintenance/users/newUser.tsx"),
    route("products", "routes/maintenance/products.tsx"),
  ]),
] satisfies RouteConfig;
