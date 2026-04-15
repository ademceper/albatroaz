import { useEffect, useState } from "react";
import { useEnvironment } from "./shared";

let documentTitleStatus:
  | { isOverridden: false }
  | { isOverridden: true; actualTitle: string } = {
  isOverridden: false,
};

export function SessionExpirationWarningOverlay(props: {
  warnUserSecondsBeforeAutoLogout: number;
}) {
  const { warnUserSecondsBeforeAutoLogout } = props;
  const { keycloak } = useEnvironment();
  const [secondsLeft, setSecondsLeft] = useState<number | undefined>(undefined);

  useEffect(() => {
    const { oidc } = keycloak as unknown as {
      oidc: {
        isUserLoggedIn: boolean;
        subscribeToAutoLogoutCountdown: (cb: (p: { secondsLeft: number | undefined }) => void) => {
          unsubscribeFromAutoLogoutCountdown: () => void;
        };
      };
    };

    if (!oidc.isUserLoggedIn) {
      throw new Error("assertion error");
    }

    const { unsubscribeFromAutoLogoutCountdown } =
      oidc.subscribeToAutoLogoutCountdown(({ secondsLeft }) => {
        if (secondsLeft === undefined || secondsLeft > warnUserSecondsBeforeAutoLogout) {
          setSecondsLeft(undefined);
          return;
        }
        setSecondsLeft(secondsLeft);
      });

    return () => unsubscribeFromAutoLogoutCountdown();
  }, [keycloak, warnUserSecondsBeforeAutoLogout]);

  useEffect(() => {
    if (secondsLeft === undefined) {
      if (documentTitleStatus.isOverridden) {
        document.title = documentTitleStatus.actualTitle;
      }
      documentTitleStatus = { isOverridden: false };
      return;
    }
    if (!documentTitleStatus.isOverridden) {
      documentTitleStatus = {
        isOverridden: true,
        actualTitle: document.title,
      };
    }
    document.title = `${secondsLeft} seconds left`;
  }, [secondsLeft]);

  if (secondsLeft === undefined) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="w-[90%] max-w-md rounded-lg bg-card p-7 text-center text-card-foreground shadow-2xl">
        <p className="text-lg font-semibold">Session expiring soon</p>
        <p className="mt-3 text-sm">
          You will be signed out in <strong>{secondsLeft}</strong> seconds due
          to inactivity.
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Move your mouse or press any key to stay signed in.
        </p>
      </div>
    </div>
  );
}
