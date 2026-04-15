/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/content/ContentComponent.tsx" --revert
 */

import { lazy, Suspense, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "@albatroaz/ui/components/spinner";
import { useEnvironment } from "../lib/shared";
import type { MenuItem } from "../root/PageNav";
import type { ContentComponentParams } from "../routes";
import { joinPath } from "../utils/joinPath";
import { usePromise } from "../utils/usePromise";
import fetchContentJson from "./fetchContent";

function findComponent(
  content: MenuItem[],
  componentId: string,
): string | undefined {
  for (const item of content) {
    if (
      "path" in item &&
      item.path.endsWith(componentId) &&
      "modulePath" in item
    ) {
      return item.modulePath;
    }
    if ("children" in item) {
      const r = findComponent(item.children, componentId);
      if (r) return r;
    }
  }
  return undefined;
}

export const ContentComponent = () => {
  const context = useEnvironment();
  const [content, setContent] = useState<MenuItem[]>();
  const { componentId } = useParams<ContentComponentParams>();

  usePromise((signal) => fetchContentJson({ signal, context }), setContent);

  const modulePath = useMemo(
    () => findComponent(content || [], componentId ?? ""),
    [content, componentId],
  );

  return modulePath ? <Component modulePath={modulePath} /> : null;
};

function Component({ modulePath }: { modulePath: string }) {
  const { environment } = useEnvironment();
  const Element = lazy(
    () => import(joinPath(environment.resourceUrl, modulePath)),
  );
  return (
    <Suspense fallback={<Spinner className="size-6" />}>
      <Element />
    </Suspense>
  );
}

export default ContentComponent;
