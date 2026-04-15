/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/account-security/DeviceActivity.tsx" --revert
 */

import {
  ArrowsClockwiseIcon,
  DesktopIcon,
  DeviceMobileIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@albatroaz/ui/components/badge";
import { Button } from "@albatroaz/ui/components/button";
import { Spinner } from "@albatroaz/ui/components/spinner";
import { label, useEnvironment } from "../lib/shared";
import { deleteSession, getDevices } from "../api/methods";
import type {
  ClientRepresentation,
  DeviceRepresentation,
  SessionRepresentation,
} from "../api/representations";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { Page } from "../components/page/Page";
import { formatDate } from "../utils/formatDate";
import { useAccountAlerts } from "../utils/useAccountAlerts";
import { usePromise } from "../utils/usePromise";

export const DeviceActivity = () => {
  const { t } = useTranslation();
  const context = useEnvironment();
  const { addAlert, addError } = useAccountAlerts();

  const [devices, setDevices] = useState<DeviceRepresentation[]>();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  const moveCurrentToTop = (devices: DeviceRepresentation[]) => {
    const index = devices.findIndex((d) => d.current);
    const currentDevice = devices.splice(index, 1)[0];
    devices.unshift(currentDevice);

    const sessionIndex = currentDevice.sessions.findIndex((s) => s.current);
    const currentSession = currentDevice.sessions.splice(sessionIndex, 1)[0];
    currentDevice.sessions.unshift(currentSession);

    setDevices(devices);
  };

  usePromise((signal) => getDevices({ signal, context }), moveCurrentToTop, [
    key,
  ]);

  const signOutAll = async () => {
    await deleteSession(context);
    await context.keycloak.logout();
  };

  const signOutSession = async (
    session: SessionRepresentation,
    device: DeviceRepresentation,
  ) => {
    try {
      await deleteSession(context, session.id);
      addAlert(
        t("signedOutSession", { browser: session.browser, os: device.os }),
      );
      refresh();
    } catch (error) {
      addError("errorSignOutMessage", error);
    }
  };

  const makeClientsString = (clients: ClientRepresentation[]): string =>
    clients
      .map((c) => (c.clientName !== "" ? label(t, c.clientName) : c.clientId))
      .join(", ");

  if (!devices) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="size-6" />
      </div>
    );
  }

  return (
    <Page
      title={t("deviceActivity")}
      description={t("signedInDevicesExplanation")}
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">
          {t("signedInDevices")}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            id="refresh-page"
            variant="ghost"
            size="sm"
            onClick={refresh}
            className="gap-1.5"
          >
            <ArrowsClockwiseIcon className="size-4" />
            {t("refreshPage")}
          </Button>
          {(devices.length > 1 || devices[0].sessions.length > 1) && (
            <ConfirmDialog
              buttonTitle={t("signOutAllDevices")}
              modalTitle={t("signOutAllDevices")}
              description={t("signOutAllDevicesWarning")}
              continueLabel={t("confirm")}
              cancelLabel={t("cancel")}
              onContinue={signOutAll}
            />
          )}
        </div>
      </div>

      <div
        aria-label={t("signedInDevices")}
        className="divide-y divide-border rounded-md border border-border"
      >
        {devices.map((device) =>
          device.sessions.map((session, index) => (
            <article
              key={`${device.id}-${session.id}`}
              data-testid={`row-${index}`}
              className="grid gap-4 p-4 sm:grid-cols-[auto_1fr_auto]"
            >
              <div className="text-foreground/70">
                {device.mobile ? (
                  <DeviceMobileIcon className="size-6" />
                ) : (
                  <DesktopIcon className="size-6" />
                )}
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {device.os.toLowerCase().includes("unknown")
                      ? t("unknownOperatingSystem")
                      : device.os}{" "}
                    {!device.osVersion.toLowerCase().includes("unknown") &&
                      device.osVersion}{" "}
                    / {session.browser}
                  </span>
                  {session.current && (
                    <Badge variant="secondary">{t("currentSession")}</Badge>
                  )}
                </div>

                <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-xs sm:grid-cols-2 lg:grid-cols-3">
                  <Field label={t("ipAddress")} value={session.ipAddress} />
                  <Field
                    label={t("lastAccessedOn")}
                    value={formatDate(new Date(session.lastAccess * 1000))}
                  />
                  <Field
                    label={t("clients")}
                    value={makeClientsString(session.clients)}
                  />
                  <Field
                    label={t("started")}
                    value={formatDate(new Date(session.started * 1000))}
                  />
                  <Field
                    label={t("expires")}
                    value={formatDate(new Date(session.expires * 1000))}
                  />
                </dl>
              </div>

              <div>
                {!session.current && (
                  <ConfirmDialog
                    buttonTitle={t("signOut")}
                    modalTitle={t("signOut")}
                    description={t("signOutWarning")}
                    continueLabel={t("confirm")}
                    cancelLabel={t("cancel")}
                    onContinue={() => signOutSession(session, device)}
                  />
                )}
              </div>
            </article>
          )),
        )}
      </div>
    </Page>
  );
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-foreground/70">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}

export default DeviceActivity;
