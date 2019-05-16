import React from "react";
import { withRouter, WithRouterProps } from "next/router";
import { getPageAndAncestors, findRouteByPath } from "@lib/taxonomy";

import { Breadcrumb } from "react-bulma-components";
import { Link } from "@routes";

const getBreadcrumbs = ({ router }) => {
  const currentRoute = findRouteByPath(router.asPath);
  const pageAndAncestors = currentRoute && getPageAndAncestors(currentRoute);

  return pageAndAncestors && currentRoute.name !== "dashboard" ? pageAndAncestors : null;
};

const Anchor: React.FunctionComponent = ({ children, ...props }) => (
  <Link {...props}>
    <a>{children}</a>
  </Link>
);

export interface BreadcrumbsProps extends WithRouterProps {}

const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({ router }) => {
  const breadcrumbs = getBreadcrumbs({ router });
  return (
    breadcrumbs && (
      <Breadcrumb
        items={breadcrumbs && breadcrumbs.reverse()}
        separator="succeeds"
        hrefAttr="href"
        renderAs={Anchor}
      />
    )
  );
};

export default withRouter(React.memo(Breadcrumbs));
