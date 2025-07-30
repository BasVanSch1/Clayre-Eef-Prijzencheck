import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("product", "routes/layouts/product.tsx", [
    index("routes/productIndex.tsx"),
    route(":productCode", "routes/product.tsx"),
    route("ean/:eanCode", "routes/productEan.tsx"),
  ]),
  route("products", "routes/products.tsx"),
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
  route("settings", "routes/settings.tsx"),
  route("maintenance", "routes/maintenance.tsx"),
] satisfies RouteConfig;
