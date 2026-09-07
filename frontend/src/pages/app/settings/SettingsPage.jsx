import {
    Settings,
} from "lucide-react";

import {
    useAuth,
} from "../../../context/AuthContext";

import BusinessProfileSection from "./BusinessProfileSection";
import AccountSection from "./AccountSection";
import SubscriptionSection from "./SubscriptionSection";


const SettingsPage = () => {
    const {
        user,
        loading,
        refreshUser,
    } = useAuth();

    if (loading) {
        return (
            <div className="mx-auto max-w-5xl">
                <div className="animate-pulse">
                    <div className="h-3 w-20 rounded bg-command-black" />

                    <div className="mt-3 h-7 w-40 rounded bg-command-black" />

                    <div className="mt-2 h-4 w-80 max-w-full rounded bg-command-black" />
                </div>

                <div className="mt-8 space-y-6">
                    {/* Subscription */}
                    <div className="h-72 animate-pulse rounded-command-lg border border-command-border bg-command-surface" />

                    {/* Business Profile */}
                    <div className="h-80 animate-pulse rounded-command-lg border border-command-border bg-command-surface" />

                    {/* Account */}
                    <div className="h-64 animate-pulse rounded-command-lg border border-command-border bg-command-surface" />
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8">
                <div className="flex items-center gap-2">
                    <Settings
                        size={14}
                        strokeWidth={1.5}
                        className="text-command-green"
                    />

                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-command-green">
                        Settings
                    </p>
                </div>

                <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                    Settings
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-command-muted">
                    Manage your account and business information.
                </p>
            </div>

            <div className="space-y-6">
                <SubscriptionSection
                    user={user}
                    onUpdated={refreshUser}
                />

                <BusinessProfileSection
                    user={user}
                    onUpdated={refreshUser}
                />

                <AccountSection
                    user={user}
                    onUpdated={refreshUser}
                />
            </div>
        </div>
    );
};

export default SettingsPage;
