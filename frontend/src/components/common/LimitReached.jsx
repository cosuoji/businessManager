import {
    LockKeyhole,
} from "lucide-react";

import { Link } from "react-router-dom";

import UpgradeButton from "./UpgradeButton";


const LimitReached = ({
    resource,
    used,
    limit,
    message,
}) => {
    return (
        <div className="rounded-command-md border border-red-400/20 bg-red-400/[0.04] p-4">
            <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-command-sm border border-red-400/20 bg-red-400/10 text-red-400">
                    <LockKeyhole
                        size={15}
                        strokeWidth={1.8}
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium text-command-white">
                            {resource} limit reached
                        </p>

                        <span className="font-mono text-[10px] text-red-400">
                            {used} / {limit}
                        </span>
                    </div>

                    <p className="mt-1.5 text-xs leading-5 text-command-muted">
                        {message ||
                            `You've reached your ${limit} ${resource.toLowerCase()} limit for this month.`}
                    </p>

                    <UpgradeButton />
                </div>
            </div>
        </div>
    );
};

export default LimitReached;
