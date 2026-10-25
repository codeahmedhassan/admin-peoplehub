"use client";

export default function DevicesHeader({ onAdd }: { onAdd: () => void }) {
    return (
        <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Devices
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                    Manage attendance hardware connected to PeopleHub.
                </p>
            </div>
            <button
                onClick={onAdd}
                className="flex items-center gap-2 px-5 py-2.5 bg-text-dark rounded-full text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
            >
                <span className="text-base leading-none font-normal">+</span>
                <span>Add device</span>
            </button>
        </div>
    );
}