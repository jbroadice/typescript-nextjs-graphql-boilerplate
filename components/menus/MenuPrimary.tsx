import React from "react";
import { withRouter } from "next/router";
import { getTree } from "@lib/taxonomy";
import { Menu } from "react-bulma-components";
import { Link } from "@routes";

const MenuCategory = ({ category, router }) => (
  <Menu.List title={category.name} className={`category-${category.name.toLowerCase()}`}>
    {category.children &&
      category.children.map((child, i) => (
        <MenuItem key={i} router={router} {...child} />
      ))}
  </Menu.List>
);

const MenuItem = ({ url, route, name, children, router, routeRegex }) => {
  const isActive = routeRegex && routeRegex.test(router.asPath);
  return (
    <Menu.List.Item>
      {Array.isArray(children) ? (
        <MenuCategory category={{ route, name, children }} router={router} />
      ) : (
        <Link href={url}>
          <a className={isActive ? "is-active" : null}>{name}</a>
        </Link>
      )}
    </Menu.List.Item>
  );
};

const MenuPrimary = ({ router }) => (
  <Menu className="m-t-md">
    {getTree().categories.map((category) => (
      <MenuCategory key={category.key} category={category} router={router} />
    ))}
  </Menu>
);

export default withRouter(React.memo(MenuPrimary));
