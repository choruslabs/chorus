import { useState } from "react";

export function SettingRow({
  label,
  description,
  unsaved = false,
  action,
  children,
}: {
  label: string;
  description?: string;
  unsaved?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <dl className="grid grid-cols-1 lg:grid-cols-3 lg:gap-x-6 py-4 border-b border-gray-200">
      <dt className="lg:col-span-1">
        <div className="flex items-center gap-2 text-sm md:text-base font-medium text-gray-900">
          <span>{label}</span>
          {action}
        </div>

        {description && (
          <p className="mt-0.5 text-xs text-gray-500 leading-4 lg:max-w-[32ch]">
            {description}
          </p>
        )}
        <span
          className={`${unsaved ? "bg-amber-300" : "hidden"} px-2 py-0.5 text-sm rounded-sm w-fit`}
        >
          Unsaved
        </span>
      </dt>

      <dd className="mt-2 lg:mt-0 lg:col-span-2">{children}</dd>
    </dl>
  );
}

export function EditableSetting({
  label,
  description,
  value,
  onSave,
}: {
  label: string;
  description?: string;
  value: string;
  onSave?: (value: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  return (
    <SettingRow
      label={label}
      description={description}
      action={
        onSave &&
        !isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-md border border-gray-200 px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit
          </button>
        )
      }
    >
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button
            type="button"
            onClick={() => onSave?.(draft)}
            className="text-sm text-blue-600 hover:underline"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft(value);
              setIsEditing(false);
            }}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
        </div>
      ) : (
        <p className="text-sm md:text-base text-gray-700 leading-6">
          {value || <span className="text-gray-400">Not set</span>}
        </p>
      )}
    </SettingRow>
  );
}

export function ToggleSetting({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <SettingRow label={label} description={description}>
      <div className="flex items-center">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={[
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500",
            checked ? "bg-blue-600" : "bg-gray-200",
          ].join(" ")}
        >
          <span
            className={[
              "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
              checked ? "translate-x-5" : "translate-x-1",
            ].join(" ")}
          />
        </button>

        <span className="ml-3 text-sm text-gray-700">
          {checked ? "Active" : "Inactive"}
        </span>
      </div>
    </SettingRow>
  );
}
