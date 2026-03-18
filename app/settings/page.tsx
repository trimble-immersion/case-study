import { listConnections } from "@/lib/services";
import { DataPanel } from "@/components/domain/DataPanel";

export default function SettingsPage() {
  const connections = listConnections();

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
      <p className="text-sm text-gray-600">
        Integration connections with ERP, project management, and estimating systems. Mock placeholders for enterprise compatibility.
      </p>
      <DataPanel title="Integrations">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-600">
              <th className="pb-2 pr-4 font-medium">System</th>
              <th className="pb-2 pr-4 font-medium">Display name</th>
              <th className="pb-2 pr-4 font-medium">Status</th>
              <th className="pb-2 font-medium">Last sync</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {connections.map((c) => (
              <tr key={c.id}>
                <td className="py-2 pr-4 text-gray-900">{c.system}</td>
                <td className="py-2 pr-4 text-gray-700">{c.displayName}</td>
                <td className="py-2 pr-4">
                  <span
                    className={
                      c.connected
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    {c.connected ? "Connected" : "Not connected"}
                  </span>
                </td>
                <td className="py-2 text-gray-600">
                  {c.lastSync
                    ? new Date(c.lastSync).toLocaleString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-gray-500">
          Adapters for .NET / SQL, ERP records, estimating content, and event-driven workflows can be wired here.
        </p>
      </DataPanel>
    </div>
  );
}
