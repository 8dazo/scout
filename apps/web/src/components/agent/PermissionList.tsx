export function PermissionList({
  permissions,
}: {
  permissions?: Record<string, boolean>;
}) {
  const liveCan = permissions
    ? Object.entries(permissions)
        .filter(([, allowed]) => allowed)
        .map(([key]) => key)
    : [
        "Read research configuration",
        "Update research status",
        "Publish analysis records",
        "Spend within budget",
      ];
  const liveCannot = permissions
    ? Object.entries(permissions)
        .filter(([, allowed]) => !allowed)
        .map(([key]) => key)
    : [
        "Arbitrary transfers",
        "Change critical permissions",
        "Control user wallet",
      ];
  const cannot = liveCannot.length > 0
    ? liveCannot
    : ["Arbitrary transfers", "Change critical permissions", "Control user wallet"];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="border-brutal p-6">
        <h2 className="font-display text-sm uppercase tracking-widest mb-4">What Scout Can Do</h2>
        <ul className="space-y-2 text-sm">
          {liveCan.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-success">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-brutal p-6 bg-paper-muted">
        <h2 className="font-display text-sm uppercase tracking-widest mb-4">What Scout Cannot Do</h2>
        <ul className="space-y-2 text-sm">
          {cannot.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-error">×</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
