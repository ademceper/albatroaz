// @ts-nocheck
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@albatroaz/ui/components/breadcrumb";
import { uniqBy } from "lodash-es";
import { Fragment, isValidElement } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { useRealm } from "../../context/realm-context/RealmContext";
import { routes } from "../../routes";

export const PageBreadCrumbs = () => {
  const { t } = useTranslation();
  const { realm } = useRealm();
  const elementText = (crumb) =>
    isValidElement(crumb.breadcrumb) && crumb.breadcrumb.props.children;

  const routesWithCrumbs = routes.map((route) => ({
    ...route,
    breadcrumb: route.breadcrumb?.(t),
  }));

  const crumbs = uniqBy(
    useBreadcrumbs(routesWithCrumbs, {
      disableDefaults: true,
      excludePaths: ["/", `/${realm}`, `/${realm}/page-section`],
    }),
    elementText,
  );

  if (crumbs.length <= 1) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map(({ match, breadcrumb: crumb }, i) => (
          <Fragment key={i}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {i < crumbs.length - 1 ? (
                <BreadcrumbLink asChild>
                  <Link to={match.pathname}>{crumb}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{crumb}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
