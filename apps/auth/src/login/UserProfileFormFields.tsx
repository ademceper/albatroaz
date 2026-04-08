import { Button } from "@albatroaz/ui/components/button"
import { Checkbox } from "@albatroaz/ui/components/checkbox"
import { Input } from "@albatroaz/ui/components/input"
import { Label } from "@albatroaz/ui/components/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@albatroaz/ui/components/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@albatroaz/ui/components/select"
import { Textarea } from "@albatroaz/ui/components/textarea"
import { PlusIcon, TrashIcon } from "@phosphor-icons/react"
import type { Attribute } from "keycloakify/login/KcContext"
import {
  type FormAction,
  type FormFieldError,
  getButtonToDisplayForMultivaluedAttributeField,
  useUserProfileForm,
} from "keycloakify/login/lib/useUserProfileForm"
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps"
import { assert } from "keycloakify/tools/assert"
import { Fragment, useEffect } from "react"
import { PasswordField } from "./components/PasswordField"
import type { I18n } from "./i18n"
import type { KcContext } from "./KcContext"

export default function UserProfileFormFields(
  props: UserProfileFormFieldsProps<KcContext, I18n>,
) {
  const {
    kcContext,
    i18n,
    onIsFormSubmittableValueChange,
    doMakeUserConfirmPassword,
    BeforeField,
    AfterField,
  } = props

  const { advancedMsg } = i18n

  const {
    formState: { formFieldStates, isFormSubmittable },
    dispatchFormAction,
  } = useUserProfileForm({ kcContext, i18n, doMakeUserConfirmPassword })

  useEffect(() => {
    onIsFormSubmittableValueChange(isFormSubmittable)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFormSubmittable, onIsFormSubmittableValueChange])

  const groupNameRef = { current: "" }

  return (
    <>
      {formFieldStates.map(
        ({ attribute, displayableErrors, valueOrValues }) => (
          <Fragment key={attribute.name}>
            <GroupLabel
              attribute={attribute}
              groupNameRef={groupNameRef}
              i18n={i18n}
            />
            {BeforeField !== undefined && (
              <BeforeField
                attribute={attribute}
                dispatchFormAction={dispatchFormAction}
                displayableErrors={displayableErrors}
                valueOrValues={valueOrValues}
                kcClsx={() => ""}
                i18n={i18n}
              />
            )}
            <div
              className="space-y-1.5"
              style={{
                display:
                  attribute.annotations.inputType === "hidden" ||
                  (attribute.name === "password-confirm" &&
                    !doMakeUserConfirmPassword)
                    ? "none"
                    : undefined,
              }}
            >
              {attribute.annotations.inputType !== "hidden" && (
                <Label htmlFor={attribute.name}>
                  {advancedMsg(attribute.displayName ?? "")}
                  {attribute.required && (
                    <span className="text-destructive ms-0.5">*</span>
                  )}
                </Label>
              )}
              {attribute.annotations.inputHelperTextBefore !== undefined && (
                <p
                  className="text-muted-foreground text-xs"
                  id={`form-help-text-before-${attribute.name}`}
                  aria-live="polite"
                >
                  {advancedMsg(attribute.annotations.inputHelperTextBefore)}
                </p>
              )}
              <InputFieldByType
                attribute={attribute}
                valueOrValues={valueOrValues}
                displayableErrors={displayableErrors}
                dispatchFormAction={dispatchFormAction}
                i18n={i18n}
              />
              <FieldErrors
                attribute={attribute}
                displayableErrors={displayableErrors}
                fieldIndex={undefined}
              />
              {attribute.annotations.inputHelperTextAfter !== undefined && (
                <p
                  className="text-muted-foreground text-xs"
                  id={`form-help-text-after-${attribute.name}`}
                  aria-live="polite"
                >
                  {advancedMsg(attribute.annotations.inputHelperTextAfter)}
                </p>
              )}
              {AfterField !== undefined && (
                <AfterField
                  attribute={attribute}
                  dispatchFormAction={dispatchFormAction}
                  displayableErrors={displayableErrors}
                  valueOrValues={valueOrValues}
                  kcClsx={() => ""}
                  i18n={i18n}
                />
              )}
            </div>
          </Fragment>
        ),
      )}
    </>
  )
}

function GroupLabel(props: {
  attribute: Attribute
  groupNameRef: { current: string }
  i18n: I18n
}) {
  const { attribute, groupNameRef, i18n } = props
  const { advancedMsg } = i18n

  if (attribute.group?.name === groupNameRef.current) {
    return null
  }

  groupNameRef.current = attribute.group?.name ?? ""
  if (groupNameRef.current === "") {
    return null
  }

  assert(attribute.group !== undefined)

  const groupDisplayHeader = attribute.group.displayHeader ?? ""
  const groupDisplayDescription = attribute.group.displayDescription ?? ""

  return (
    <div className="space-y-1 border-t pt-3">
      <div
        className="text-sm font-medium"
        id={`header-${attribute.group.name}`}
      >
        {groupDisplayHeader !== ""
          ? advancedMsg(groupDisplayHeader)
          : attribute.group.name}
      </div>
      {groupDisplayDescription !== "" && (
        <p
          className="text-muted-foreground text-xs"
          id={`description-${attribute.group.name}`}
        >
          {advancedMsg(groupDisplayDescription)}
        </p>
      )}
    </div>
  )
}

function FieldErrors(props: {
  attribute: Attribute
  displayableErrors: FormFieldError[]
  fieldIndex: number | undefined
}) {
  const { attribute, fieldIndex } = props
  const errors = props.displayableErrors.filter(
    (e) => e.fieldIndex === fieldIndex,
  )
  if (errors.length === 0) return null

  return (
    <p
      id={`input-error-${attribute.name}${fieldIndex === undefined ? "" : `-${fieldIndex}`}`}
      className="text-destructive text-xs"
      aria-live="polite"
    >
      {errors.map(({ errorMessage }, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: stable error list
        <Fragment key={i}>
          {errorMessage}
          {i < errors.length - 1 && <br />}
        </Fragment>
      ))}
    </p>
  )
}

type InputFieldByTypeProps = {
  attribute: Attribute
  valueOrValues: string | string[]
  displayableErrors: FormFieldError[]
  dispatchFormAction: React.Dispatch<FormAction>
  i18n: I18n
}

function InputFieldByType(props: InputFieldByTypeProps) {
  const { attribute, valueOrValues } = props

  switch (attribute.annotations.inputType) {
    case "hidden":
      return (
        <input
          type="hidden"
          name={attribute.name}
          value={valueOrValues as string}
        />
      )
    case "textarea":
      return <TextareaTag {...props} />
    case "select":
    case "multiselect":
      return <SelectTag {...props} />
    case "select-radiobuttons":
      return <RadioButtonsTag {...props} />
    case "multiselect-checkboxes":
      return <CheckboxesTag {...props} />
    default: {
      if (Array.isArray(valueOrValues)) {
        return (
          <div className="space-y-2">
            {valueOrValues.map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: ordered multi-value field
              <InputTag key={i} {...props} fieldIndex={i} />
            ))}
          </div>
        )
      }
      return <InputTag {...props} fieldIndex={undefined} />
    }
  }
}

function InputTag(
  props: InputFieldByTypeProps & { fieldIndex: number | undefined },
) {
  const {
    attribute,
    fieldIndex,
    dispatchFormAction,
    valueOrValues,
    i18n,
    displayableErrors,
  } = props
  const { advancedMsgStr } = i18n

  const inputType = (() => {
    const t = attribute.annotations.inputType
    if (t?.startsWith("html5-")) return t.slice(6)
    return t ?? "text"
  })()

  const value = (() => {
    if (fieldIndex !== undefined) {
      assert(Array.isArray(valueOrValues))
      return valueOrValues[fieldIndex]
    }
    assert(typeof valueOrValues === "string")
    return valueOrValues
  })()

  const isInvalid =
    displayableErrors.find((e) => e.fieldIndex === fieldIndex) !== undefined

  const commonProps = {
    id: attribute.name,
    name: attribute.name,
    value,
    disabled: attribute.readOnly,
    autoComplete: attribute.autocomplete,
    placeholder:
      attribute.annotations.inputTypePlaceholder === undefined
        ? undefined
        : advancedMsgStr(attribute.annotations.inputTypePlaceholder),
    pattern: attribute.annotations.inputTypePattern,
    maxLength: attribute.annotations.inputTypeMaxlength
      ? parseInt(`${attribute.annotations.inputTypeMaxlength}`, 10)
      : undefined,
    minLength: attribute.annotations.inputTypeMinlength
      ? parseInt(`${attribute.annotations.inputTypeMinlength}`, 10)
      : undefined,
    max: attribute.annotations.inputTypeMax,
    min: attribute.annotations.inputTypeMin,
    step: attribute.annotations.inputTypeStep,
    "aria-invalid": isInvalid,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      dispatchFormAction({
        action: "update",
        name: attribute.name,
        valueOrValues: (() => {
          if (fieldIndex !== undefined) {
            assert(Array.isArray(valueOrValues))
            return valueOrValues.map((v, i) =>
              i === fieldIndex ? event.target.value : v,
            )
          }
          return event.target.value
        })(),
      }),
    onBlur: () =>
      dispatchFormAction({
        action: "focus lost",
        name: attribute.name,
        fieldIndex,
      }),
  } as const

  const isPasswordField =
    attribute.name === "password" || attribute.name === "password-confirm"

  return (
    <>
      {isPasswordField ? (
        <PasswordField i18n={i18n} inputId={attribute.name} {...commonProps} />
      ) : (
        <Input type={inputType} {...commonProps} />
      )}
      {fieldIndex !== undefined && Array.isArray(valueOrValues) && (
        <>
          <FieldErrors
            attribute={attribute}
            displayableErrors={displayableErrors}
            fieldIndex={fieldIndex}
          />
          <AddRemoveButtons
            attribute={attribute}
            values={valueOrValues}
            fieldIndex={fieldIndex}
            dispatchFormAction={dispatchFormAction}
            i18n={i18n}
          />
        </>
      )}
    </>
  )
}

function AddRemoveButtons(props: {
  attribute: Attribute
  values: string[]
  fieldIndex: number
  dispatchFormAction: React.Dispatch<Extract<FormAction, { action: "update" }>>
  i18n: I18n
}) {
  const { attribute, values, fieldIndex, dispatchFormAction, i18n } = props
  const { hasAdd, hasRemove } = getButtonToDisplayForMultivaluedAttributeField({
    attribute,
    values,
    fieldIndex,
  })

  return (
    <div className="flex gap-1">
      {hasRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          id={`kc-remove-${attribute.name}-${fieldIndex + 1}`}
          onClick={() =>
            dispatchFormAction({
              action: "update",
              name: attribute.name,
              valueOrValues: values.filter((_, i) => i !== fieldIndex),
            })
          }
          aria-label={i18n.msgStr("remove")}
        >
          <TrashIcon />
        </Button>
      )}
      {hasAdd && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          id={`kc-add-${attribute.name}-${fieldIndex + 1}`}
          onClick={() =>
            dispatchFormAction({
              action: "update",
              name: attribute.name,
              valueOrValues: [...values, ""],
            })
          }
          aria-label={i18n.msgStr("addValue")}
        >
          <PlusIcon />
        </Button>
      )}
    </div>
  )
}

function TextareaTag(props: InputFieldByTypeProps) {
  const { attribute, dispatchFormAction, displayableErrors, valueOrValues } =
    props
  assert(typeof valueOrValues === "string")

  return (
    <Textarea
      id={attribute.name}
      name={attribute.name}
      disabled={attribute.readOnly}
      cols={
        attribute.annotations.inputTypeCols
          ? parseInt(`${attribute.annotations.inputTypeCols}`, 10)
          : undefined
      }
      rows={
        attribute.annotations.inputTypeRows
          ? parseInt(`${attribute.annotations.inputTypeRows}`, 10)
          : undefined
      }
      maxLength={
        attribute.annotations.inputTypeMaxlength
          ? parseInt(`${attribute.annotations.inputTypeMaxlength}`, 10)
          : undefined
      }
      value={valueOrValues}
      aria-invalid={displayableErrors.length !== 0}
      onChange={(event) =>
        dispatchFormAction({
          action: "update",
          name: attribute.name,
          valueOrValues: event.target.value,
        })
      }
      onBlur={() =>
        dispatchFormAction({
          action: "focus lost",
          name: attribute.name,
          fieldIndex: undefined,
        })
      }
    />
  )
}

function SelectTag(props: InputFieldByTypeProps) {
  const { attribute, dispatchFormAction, valueOrValues, i18n } = props
  const isMultiple = attribute.annotations.inputType === "multiselect"

  const options = getOptions(attribute)

  if (isMultiple) {
    return (
      <select
        id={attribute.name}
        name={attribute.name}
        multiple
        disabled={attribute.readOnly}
        value={valueOrValues as string[]}
        className="border-input bg-input/20 w-full rounded-md border px-2 py-1 text-sm"
        onChange={(event) =>
          dispatchFormAction({
            action: "update",
            name: attribute.name,
            valueOrValues: Array.from(event.target.selectedOptions).map(
              (o) => o.value,
            ),
          })
        }
        onBlur={() =>
          dispatchFormAction({
            action: "focus lost",
            name: attribute.name,
            fieldIndex: undefined,
          })
        }
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {inputLabel(i18n, attribute, option)}
          </option>
        ))}
      </select>
    )
  }

  return (
    <Select
      value={valueOrValues as string}
      disabled={attribute.readOnly}
      onValueChange={(value) =>
        dispatchFormAction({
          action: "update",
          name: attribute.name,
          valueOrValues: value,
        })
      }
    >
      <SelectTrigger id={attribute.name}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {inputLabel(i18n, attribute, option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function RadioButtonsTag(props: InputFieldByTypeProps) {
  const { attribute, dispatchFormAction, valueOrValues, i18n } = props
  const options = getOptions(attribute)

  return (
    <RadioGroup
      value={valueOrValues as string}
      disabled={attribute.readOnly}
      onValueChange={(value) =>
        dispatchFormAction({
          action: "update",
          name: attribute.name,
          valueOrValues: value,
        })
      }
    >
      {options.map((option) => (
        <label
          key={option}
          htmlFor={`${attribute.name}-${option}`}
          className="flex cursor-pointer items-center gap-2 text-xs"
        >
          <RadioGroupItem value={option} id={`${attribute.name}-${option}`} />
          {inputLabel(i18n, attribute, option)}
        </label>
      ))}
    </RadioGroup>
  )
}

function CheckboxesTag(props: InputFieldByTypeProps) {
  const { attribute, dispatchFormAction, valueOrValues, i18n } = props
  const options = getOptions(attribute)
  const values = Array.isArray(valueOrValues) ? valueOrValues : [valueOrValues]

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option}
          htmlFor={`${attribute.name}-${option}`}
          className="flex cursor-pointer items-center gap-2 text-xs"
        >
          <Checkbox
            id={`${attribute.name}-${option}`}
            disabled={attribute.readOnly}
            checked={values.includes(option)}
            onCheckedChange={(checked) =>
              dispatchFormAction({
                action: "update",
                name: attribute.name,
                valueOrValues: (() => {
                  const next = [...values]
                  if (checked) {
                    next.push(option)
                  } else {
                    next.splice(next.indexOf(option), 1)
                  }
                  return next
                })(),
              })
            }
          />
          {inputLabel(i18n, attribute, option)}
        </label>
      ))}
    </div>
  )
}

function getOptions(attribute: Attribute): string[] {
  const { inputOptionsFromValidation } = attribute.annotations
  if (inputOptionsFromValidation !== undefined) {
    const validator = (
      attribute.validators as Record<string, { options?: string[] }>
    )[inputOptionsFromValidation]
    if (validator?.options !== undefined) {
      return validator.options
    }
  }
  return attribute.validators.options?.options ?? []
}

function inputLabel(i18n: I18n, attribute: Attribute, option: string) {
  const { advancedMsg } = i18n
  if (attribute.annotations.inputOptionLabels !== undefined) {
    return advancedMsg(
      attribute.annotations.inputOptionLabels[option] ?? option,
    )
  }
  if (attribute.annotations.inputOptionLabelsI18nPrefix !== undefined) {
    return advancedMsg(
      `${attribute.annotations.inputOptionLabelsI18nPrefix}.${option}`,
    )
  }
  return option
}
