import {
    ArrowLeft,
    Home,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-command-black px-6">
            <div className="w-full max-w-md text-center">

                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-command-lg border border-command-border bg-command-surface">
                    <span className="font-mono text-lg font-bold text-command-green">
                        B
                    </span>
                </div>

                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-command-green">
                    Error 404
                </p>

                <h1 className="mt-3 text-4xl font-semibold tracking-tight text-command-white">
                    Page not found
                </h1>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-command-muted">
                    The page you're looking for doesn't exist
                    or may have been moved.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

                    <Link
                        to="/dashboard"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-command-md bg-command-green px-4 text-xs font-semibold text-[#061008] transition hover:brightness-110"
                    >
                        <Home size={14} />
                        Go to dashboard
                    </Link>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-command-md border border-command-border px-4 text-xs text-command-muted transition hover:bg-command-surface hover:text-command-white"
                    >
                        <ArrowLeft size={14} />
                        Go back
                    </button>

                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
