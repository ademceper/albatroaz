/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/resources/Resources.tsx" --revert
 */

import { useTranslation } from "react-i18next";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@albatroaz/ui/components/tabs";
import { Page } from "../components/page/Page";
import { ResourcesTab } from "./ResourcesTab";

export const Resources = () => {
  const { t } = useTranslation();

  return (
    <Page title={t("resources")} description={t("resourceIntroMessage")}>
      <Tabs defaultValue="my">
        <TabsList>
          <TabsTrigger value="my" data-testid="myResources">
            {t("myResources")}
          </TabsTrigger>
          <TabsTrigger value="shared" data-testid="sharedWithMe">
            {t("sharedWithMe")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="my">
          <ResourcesTab />
        </TabsContent>
        <TabsContent value="shared">
          <ResourcesTab isShared />
        </TabsContent>
      </Tabs>
    </Page>
  );
};

export default Resources;
