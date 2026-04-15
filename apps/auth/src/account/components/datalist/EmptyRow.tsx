/**
 * This file has been claimed for ownership from @keycloakify/keycloak-account-ui version 260502.0.2.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "account/components/datalist/EmptyRow.tsx" --revert
 */

type EmptyRowProps = {
  message: string;
};

export const EmptyRow = ({ message }: EmptyRowProps) => {
  return (
    <div className="rounded-md border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
};
