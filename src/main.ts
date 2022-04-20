import type { RouteRecordRaw } from "vue-router";

import { MENU_ROUTE_PATHS } from "./constants/paths";
import { applyTranslations } from "./locales/apply";
import MenuEditor from "./views/MenuEditor";

applyTranslations();

export * from "./constants/routes";
export * from "./constants/paths";
export * from "./utils/paths";

export { MenuEditor };

export function createMenuRoute(
  name: string,
  overrides?: Partial<RouteRecordRaw>
): RouteRecordRaw {
  const menuRoute: RouteRecordRaw = {
    name,
    path: MENU_ROUTE_PATHS.MENU_PAGE,
    component: MenuEditor,
    meta: {
      getBreadcrumbs: (route) => [
        { url: "/", text: "Home" },
        { url: route.path, text: name },
      ],
    },
  };

  Object.assign(menuRoute, overrides);

  return menuRoute;
}
