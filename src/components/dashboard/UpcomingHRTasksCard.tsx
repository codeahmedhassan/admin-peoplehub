import { HR_TASKS, HR_TASK_DATES, type HRTask } from "@/lib/constants";

function TaskIcon({ type }: { type: HRTask["icon"] }) {
    const props = {
        className: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        viewBox: "0 0 24 24",
    };

    switch (type) {
        case "interview":
            return (
                <svg {...props}>
                    <path
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            );
        case "onboarding":
            return (
                <svg {...props}>
                    <path
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            );
        case "meeting":
            return (
                <svg {...props}>
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
            );
        case "review":
            return (
                <svg {...props}>
                    <path
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            );
    }
}

export default function UpcomingHRTasksCard() {
    return (
        <div className="bg-white rounded-[28px] p-6 shadow-card-sm border border-slate-200/50 flex flex-col justify-between">
            <div>
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-900 tracking-tight">
                            Upcoming HR Tasks
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Here&apos;s your HR activities for today
                        </p>
                    </div>
                    <button
                        aria-label="Task options"
                        className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="5" cy="12" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="19" cy="12" r="2" />
                        </svg>
                    </button>
                </div>

                {/* Date selector */}
                <div className="flex items-center justify-between mt-5 pb-2 border-b border-slate-100">
                    {HR_TASK_DATES.map((date) => (
                        <div
                            key={date.day}
                            className="flex flex-col items-center gap-1 cursor-pointer"
                        >
                            {date.isSelected ? (
                                <>
                                    <span className="w-7 h-7 rounded-full bg-[#1457DC] text-white flex items-center justify-center text-xs font-bold shadow-sm shadow-blue-500/30">
                                        {date.day}
                                    </span>
                                    <span className="text-[11px] font-bold text-[#1457DC]">
                                        {date.weekday}
                                    </span>
                                    <span className="w-4 h-0.5 bg-[#1457DC] rounded-full mt-0.5" />
                                </>
                            ) : (
                                <>
                                    <span className="text-xs font-semibold text-slate-700">
                                        {date.day}
                                    </span>
                                    <span className="text-[11px] font-medium text-slate-400">
                                        {date.weekday}
                                    </span>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Task list */}
            <div className="flex flex-col divide-y divide-slate-100 my-2">
                {HR_TASKS.map((task) => (
                    <div
                        key={task.title}
                        className="flex items-center justify-between py-2.5 hover:bg-slate-50/60 px-1 rounded-xl transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] font-medium text-slate-400 w-24 shrink-0">
                                {task.time}
                            </span>
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${task.bgClass} ${task.textClass}`}
                            >
                                <TaskIcon type={task.icon} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-800">
                                    {task.title}
                                </span>
                                <span className="text-[11px] text-slate-400">{task.subtitle}</span>
                            </div>
                        </div>
                        <svg
                            className="w-4 h-4 text-slate-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M9 5l7 7-7 7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                            />
                        </svg>
                    </div>
                ))}
            </div>
        </div>
    );
}