import { routes } from "@routes";
import { some } from "lodash-es";
import taxonomyJson from "../taxonomy.json";

/**
 * Gets a page (by route) and returns its ancestors.
 * @param {Route} route
 * @returns {Array}
 */
const getPageAndAncestors = (route) => {
  const taxonomy = taxonomyJson;
  return (
    route &&
    taxonomy.categories
      .map((category) => getPageAndAncestorsFromCollection(category.children, route.name))
      .find((category) => !!category)
  );
};

/**
 * Gets a page (by route name) and its ancestors from a given collection of pages.
 * @param {Array} pages
 * @param {String} routeName
 * @returns {Array}
 */
const getPageAndAncestorsFromCollection = (pages, routeName) => {
  const ancestors = [];

  const matched = some(pages, function iter(a) {
    if (a.route === routeName) {
      ancestors.push({ ...a, active: true });
      return true;
    }

    if (Array.isArray(a.children)) {
      const childMatched = some(a.children, iter);

      if (childMatched) {
        ancestors.push(a);
      }

      return childMatched;
    }
  });

  if (routeName !== "dashboard") {
    ancestors.push({
      name: "Dashboard",
      route: "dashboard",
    });
  }

  return matched && ancestors.map(mapRoutes);
};

/**
 *
 */
const findRouteByPath = (path) => routes.find((route) => route.match(path));

/**
 *
 */
const findRouteByName = (name) => routes.find((route) => route.name === name);

/**
 *
 */
const getTree = ({ forMenu = true } = {}) => {
  const filterChildren = (item) =>
    item.children
      .map((o) => ({ ...o }))
      .filter(filterCollection)
      .map(mapRoutes);

  const filterCollection = (item) => {
    if (forMenu && item.showInMenu === false) {
      return false;
    }

    if (Array.isArray(item.children)) {
      item.children = filterChildren(item);

      if (item.children.length === 0) {
        delete item.children;
      }
    }

    return true;
  };

  const categories = taxonomyJson.categories.map((category) => ({
    ...category,
    children: filterChildren(category),
  }));

  return { categories };
};

/**
 *
 */
const mapRoutes = (item) => {
  const route = findRouteByName(item.route);

  let url = "#";
  if (route) {
    try {
      url = route.toPath();
    } catch (e) {
      url = "#";
    }
  }

  return {
    ...item,
    url,
    routeRegex: route ? route.regex : null,
  };
};

export { getTree, getPageAndAncestors, findRouteByPath };
