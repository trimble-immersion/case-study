"use client";

export function TopBar() {
  return (
    <div className="shrink-0 bg-[#1a3a5c] text-white flex items-center justify-between px-0" style={{ height: 32 }}>
      {/* Left: product identity */}
      <div className="flex items-center gap-0">
        <div className="flex items-center px-3 h-full bg-[#0f2a45] border-r border-[#2a4a6c]">
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#7ab0d8]">TRIMBLE</span>
        </div>
        <div className="flex items-center px-3 h-full border-r border-[#2a4a6c]">
          <span className="text-[11px] font-semibold text-white">Construction Suite</span>
          <span className="ml-2 text-[10px] text-[#7ab0d8]">/ Change Order Pricing Module</span>
        </div>
        {/* Toolbar action buttons */}
        <div className="flex items-center h-full border-r border-[#2a4a6c] px-2 gap-1">
          <button className="btn-toolbar bg-[#1e4878] border-[#2a5a8c] text-[#b8d4f0] hover:bg-[#2a5a8c]">File</button>
          <button className="btn-toolbar bg-[#1e4878] border-[#2a5a8c] text-[#b8d4f0] hover:bg-[#2a5a8c]">Edit</button>
          <button className="btn-toolbar bg-[#1e4878] border-[#2a5a8c] text-[#b8d4f0] hover:bg-[#2a5a8c]">View</button>
          <button className="btn-toolbar bg-[#1e4878] border-[#2a5a8c] text-[#b8d4f0] hover:bg-[#2a5a8c]">Tools</button>
          <button className="btn-toolbar bg-[#1e4878] border-[#2a5a8c] text-[#b8d4f0] hover:bg-[#2a5a8c]">Reports</button>
          <button className="btn-toolbar bg-[#1e4878] border-[#2a5a8c] text-[#b8d4f0] hover:bg-[#2a5a8c]">Help</button>
        </div>
      </div>
      {/* Right: system info */}
      <div className="flex items-center gap-4 px-3">
        <span className="text-[10px] text-[#7ab0d8]">ENV: PROD-US-EAST</span>
        <span className="text-[10px] text-[#7ab0d8]">DB: TRIMBLE-SQL-02</span>
        <span className="text-[10px] text-[#c8d8e8]">zara.hall@contractor.trimble.com</span>
        <div className="w-2 h-2 rounded-full bg-[#44bb44] border border-[#33aa33]" title="Connected" />
      </div>
    </div>
  );
}
