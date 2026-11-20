import { type FormEvent, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TeamCopy } from "./core-team-messages";
import {
  canChoosePermission,
  createRole,
  normalizeMemberName,
  permissionCatalogue,
  scopeChoices,
  type MemberNameEdit,
  type RoleDefinition,
  type TeamMember,
  type TeamProfile,
} from "./core-team-model";

export const compactButton =
  "h-auto min-h-9 max-w-full whitespace-normal max-sm:min-h-11";
export const subduedText = "text-sm text-gray-600 dark:text-gray-400";
const inputError = "text-sm text-red-700 dark:text-red-400";

export function permissionName(copy: TeamCopy, key: string) {
  const index = permissionCatalogue.findIndex((item) => item === key);
  return copy.permissionLabels[index] ?? key;
}

export function AssignmentFields({
  copy,
  profile,
  definitions,
  roleId,
  scopeId,
  onRole,
  onScope,
}: {
  copy: TeamCopy;
  profile: TeamProfile;
  definitions: readonly RoleDefinition[];
  roleId: string;
  scopeId: string;
  onRole: (id: string) => void;
  onScope: (id: string) => void;
}) {
  const id = useId();
  const options = scopeChoices(profile, roleId);
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
      <div className="min-w-0 space-y-2">
        <Label htmlFor={`${id}-role`}>{copy.role}</Label>
        <Select
          value={roleId || null}
          onValueChange={(value) => onRole(value ?? "")}
        >
          <SelectTrigger className="w-full" id={`${id}-role`}>
            <SelectValue placeholder={copy.selectRole} />
          </SelectTrigger>
          <SelectContent>
            {definitions.map((definition) => (
              <SelectItem key={definition.role_id} value={definition.role_id}>
                {definition.role_id === "owner" ? copy.owner : definition.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-0 space-y-2">
        <Label htmlFor={`${id}-scope`}>{copy.scope}</Label>
        <Select
          value={scopeId || null}
          onValueChange={(value) => onScope(value ?? "")}
          disabled={!options.length}
        >
          <SelectTrigger className="w-full" id={`${id}-scope`}>
            <SelectValue placeholder={copy.selectScope} />
          </SelectTrigger>
          <SelectContent>
            {options.map(({ id, label, value }) => (
              <SelectItem key={id} value={id}>
                {"site_id" in value
                  ? `${copy.site} · `
                  : "area_id" in value
                    ? `${copy.area} · `
                    : ""}
                {copy[label]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function TeamFormActions({
  copy,
  action,
  onBack,
  disabled = false,
}: {
  copy: TeamCopy;
  action: string;
  onBack: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button type="submit" className={compactButton} disabled={disabled}>
        {action}
      </Button>
      <Button
        type="button"
        variant="outline"
        className={compactButton}
        onClick={onBack}
      >
        {copy.back}
      </Button>
    </div>
  );
}

export function CoreListNavigation({
  labels,
  previous,
  next,
  onPage,
}: {
  labels: { previous: string; next: string };
  previous?: number;
  next?: number;
  onPage: (start: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        className={compactButton}
        disabled={previous === undefined}
        onClick={() => previous !== undefined && onPage(previous)}
      >
        {labels.previous}
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        className={compactButton}
        disabled={next === undefined}
        onClick={() => next !== undefined && onPage(next)}
      >
        {labels.next}
      </Button>
    </div>
  );
}

export function MemberNameForm({
  copy,
  member,
  onSave,
  onBack,
}: {
  copy: TeamCopy;
  member: TeamMember;
  onSave: (edit: MemberNameEdit) => void;
  onBack: () => void;
}) {
  const id = useId();
  const [firstName, setFirstName] = useState(member.first_name);
  const [lastName, setLastName] = useState(member.last_name ?? "");
  const [noLastName, setNoLastName] = useState(member.last_name === null);
  const [submitted, setSubmitted] = useState(false);
  const currentLastName = noLastName ? null : lastName;
  const edit: MemberNameEdit = {
    ...(firstName !== member.first_name && { first_name: firstName }),
    ...(currentLastName !== member.last_name && { last_name: currentLastName }),
  };
  const firstInvalid =
    edit.first_name !== undefined &&
    normalizeMemberName(edit.first_name) === undefined;
  const lastInvalid =
    typeof edit.last_name === "string" &&
    normalizeMemberName(edit.last_name) === undefined;

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    if (!firstInvalid && !lastInvalid && Object.keys(edit).length) onSave(edit);
  }

  return (
    <form className="space-y-4" onSubmit={save} noValidate>
      {member.email && (
        <p className={`${subduedText} [overflow-wrap:anywhere]`}>
          {member.email}
        </p>
      )}
      <p className={subduedText}>{copy.memberNameHelp}</p>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        <div className="min-w-0 space-y-2">
          <Label htmlFor={`${id}-first`}>{copy.memberFirstName}</Label>
          <Input
            id={`${id}-first`}
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
            aria-invalid={(submitted && firstInvalid) || undefined}
            aria-describedby={
              submitted && firstInvalid ? `${id}-first-error` : undefined
            }
          />
          {submitted && firstInvalid && (
            <p id={`${id}-first-error`} className={inputError} role="alert">
              {copy.memberNameError}
            </p>
          )}
        </div>
        <div className="min-w-0 space-y-2">
          <Label htmlFor={`${id}-last`}>{copy.memberLastName}</Label>
          <Input
            id={`${id}-last`}
            value={noLastName ? "" : lastName}
            onChange={(event) => setLastName(event.target.value)}
            disabled={noLastName}
            aria-invalid={(submitted && lastInvalid) || undefined}
            aria-describedby={
              submitted && lastInvalid ? `${id}-last-error` : undefined
            }
          />
          {submitted && lastInvalid && (
            <p id={`${id}-last-error`} className={inputError} role="alert">
              {copy.memberNameError}
            </p>
          )}
        </div>
      </div>
      <Label htmlFor={`${id}-no-last`} className="min-h-11 leading-snug">
        <Checkbox
          id={`${id}-no-last`}
          checked={noLastName}
          onCheckedChange={setNoLastName}
        />
        {copy.memberNoLastName}
      </Label>
      <TeamFormActions
        copy={copy}
        action={copy.saveMemberName}
        onBack={onBack}
        disabled={Object.keys(edit).length === 0}
      />
    </form>
  );
}

export function RoleForm({
  copy,
  profile,
  onSave,
  onBack,
  initial,
  action = copy.newRole,
}: {
  copy: TeamCopy;
  profile: TeamProfile;
  onSave: (role: Omit<RoleDefinition, "role_id">) => void;
  onBack: () => void;
  initial?: RoleDefinition;
  action?: string;
}) {
  const id = useId();
  const [name, setName] = useState(initial?.name ?? "");
  const [keys, setKeys] = useState<readonly string[]>(
    initial?.permissions ?? [],
  );
  const [invalid, setInvalid] = useState(false);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const role = createRole(profile, name, keys);
    setInvalid(!role);
    if (role) onSave(role);
  }

  return (
    <form className="space-y-4" onSubmit={save} noValidate>
      <div className="space-y-2">
        <Label htmlFor={id}>{copy.name}</Label>
        <Input
          id={id}
          value={name}
          required
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${id}-error` : undefined}
          onChange={(event) => {
            setName(event.target.value);
            setInvalid(false);
          }}
        />
        {invalid && (
          <p id={`${id}-error`} role="alert" className={inputError}>
            {copy.roleNameError}
          </p>
        )}
      </div>
      <fieldset className="space-y-2 rounded-lg border border-gray-200 p-4 dark:border-gray-800">
        <legend className="px-2 text-sm font-semibold">
          {copy.permissions}
        </legend>
        <div className="grid gap-1 sm:grid-cols-2">
          {permissionCatalogue.map((key) => {
            const protectedKey = key === "site:create" || key === "area:create";
            if (!canChoosePermission(profile, key) && !protectedKey)
              return null;
            return (
              <Label
                key={key}
                htmlFor={`${id}-${key}`}
                className="min-h-10 gap-3 leading-snug"
              >
                <Checkbox
                  id={`${id}-${key}`}
                  disabled={protectedKey}
                  checked={keys.includes(key)}
                  onCheckedChange={(checked) =>
                    setKeys((current) =>
                      checked
                        ? [...current, key]
                        : current.filter((item) => item !== key),
                    )
                  }
                />
                <span>
                  {permissionName(copy, key)}
                  {protectedKey && (
                    <span className={`block ${subduedText}`}>
                      {copy.protected}
                    </span>
                  )}
                </span>
              </Label>
            );
          })}
        </div>
      </fieldset>
      <TeamFormActions copy={copy} action={action} onBack={onBack} />
    </form>
  );
}
