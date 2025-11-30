import AccountSettings from "./settings-form";

export default function SettingsPage() {
  return (
    <div className="space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences & system settings.
        </p>
      </div>

      {/* Settings Form */}
      <AccountSettings />

    </div>
  );
}
