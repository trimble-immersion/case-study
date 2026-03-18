import { IntegrationService } from "@/lib/services/integrationService";
import { DataPanel } from "@/components/domain/DataPanel";

export default function SettingsPage() {
  const connections = IntegrationService.listConnections();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Toolbar */}
      <div className="shrink-0 border-b border-[#8a9aaa] bg-[#e4eaf0] px-2 flex items-center gap-1" style={{ height: 26 }}>
        <span className="text-[11px] font-semibold text-[#1a2a3a] mr-2">INTEGRATIONS — System Connection Registry</span>
        <span className="text-[#9aa8b6] mx-1">|</span>
        <button className="btn-toolbar">Test All Connections</button>
        <button className="btn-toolbar">Force Sync</button>
        <button className="btn-toolbar">View Sync Logs</button>
      </div>

      <div className="flex-1 overflow-auto p-2">
        <DataPanel title="INTEGRATION CONNECTIONS — Adapter Status">
          <table>
            <thead>
              <tr>
                <th>System Type</th>
                <th>Display Name</th>
                <th>Adapter</th>
                <th>Status</th>
                <th>Last Sync</th>
                <th>Sync Interval</th>
                <th>Health</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {connections.map((c) => (
                <tr key={c.id}>
                  <td className="font-medium">{c.system}</td>
                  <td>{c.displayName}</td>
                  <td className="text-[#6a7e90]">{c.system.toLowerCase()}Adapter.ts</td>
                  <td>
                    {c.connected ? (
                      <span style={{ color: "#1a5a1a", fontWeight: 600 }}>CONNECTED</span>
                    ) : (
                      <span className="error-cell font-semibold">OFFLINE</span>
                    )}
                  </td>
                  <td className="text-[#4a5a6a]">
                    {c.lastSync ? new Date(c.lastSync).toLocaleString() : <span className="text-[#9aa8b6]">Never</span>}
                  </td>
                  <td className="text-[#6a7e90]">
                    {c.connected ? "15 min" : <span className="warn-cell">Manual only</span>}
                  </td>
                  <td>
                    {c.connected ? (
                      <span style={{ color: "#1a5a1a" }}>OK</span>
                    ) : (
                      <span className="error-cell">DEGRADED</span>
                    )}
                  </td>
                  <td>
                    <button className="btn-toolbar">
                      {c.connected ? "Test" : "Reconnect"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 border border-[#b0bcc8] bg-[#f4f6f8] px-2 py-1 text-[10px] text-[#6a7e90]">
            Adapters map internal domain models to external system formats.
            See: erpAdapter.ts · estimatingAdapter.ts · projectSystemAdapter.ts
            Integration architecture: event-driven (Kafka / Azure Service Bus).
            Contact infrastructure team to modify connection parameters.
          </div>
        </DataPanel>

        <DataPanel title="EVENT BUS — Domain Event Log (Recent)">
          <div className="border border-[#c8a000] bg-[#fff8e0] px-2 py-1 text-[11px] text-[#7a5000] mb-2">
            ⚠ Event log is in-memory only in current deployment. Configure Kafka broker endpoint to enable persistent event stream.
          </div>
          <table>
            <thead>
              <tr>
                <th>Event Type</th>
                <th>Aggregate</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { type: "ChangeOrderCreated", agg: "CO-2024-012", desc: "New CO record created", status: "Published" },
                { type: "PricingGenerated", agg: "CO-2024-012", desc: "Pricing recommendation generated", status: "Published" },
                { type: "SubmittedForApproval", agg: "CO-2024-012", desc: "CO submitted for PM approval", status: "Published" },
                { type: "Approved", agg: "CO-2024-012", desc: "CO approved – final $2,200", status: "Published" },
                { type: "SyncedToERP", agg: "CO-2024-012", desc: "ERP sync triggered", status: "PENDING" },
              ].map((ev, i) => (
                <tr key={i}>
                  <td className="font-medium">{ev.type}</td>
                  <td className="text-[#4a7aaa]">{ev.agg}</td>
                  <td>{ev.desc}</td>
                  <td className={ev.status === "PENDING" ? "warn-cell font-semibold" : "text-[#4a7a4a]"}>
                    {ev.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DataPanel>
      </div>
    </div>
  );
}
