import { kcSanitize } from "keycloakify/lib/kcSanitize";

type MessagesPerField = {
    existsError: (...fieldNames: string[]) => boolean;
    getFirstError: (...fieldNames: string[]) => string;
};

type Props = {
    messagesPerField: MessagesPerField;
    fieldName: string;
    extraFieldNames?: string[];
};

export function FieldError({ messagesPerField, fieldName, extraFieldNames = [] }: Props) {
    if (!messagesPerField.existsError(fieldName, ...extraFieldNames)) {
        return null;
    }

    return (
        <p
            id={`input-error-${fieldName}`}
            className="text-destructive text-xs"
            aria-live="polite"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: kcSanitize is applied
            dangerouslySetInnerHTML={{
                __html: kcSanitize(
                    messagesPerField.getFirstError(fieldName, ...extraFieldNames)
                ),
            }}
        />
    );
}
