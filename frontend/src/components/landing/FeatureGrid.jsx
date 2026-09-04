import { features } from "../../data/landingData";

const FeatureGrid = () => {
    return (
        <div className="grid border-l border-t border-command-border sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
                <article
                    key={feature.number}
                    className="group border-b border-r border-command-border p-7 transition-colors duration-300 hover:bg-command-surface-2 sm:p-8"
                >
                    <span className="font-mono text-[10px] text-command-subtle">
                        {feature.number}
                    </span>

                    <div className="mt-14">
                        <h3 className="text-lg font-semibold">
                            {feature.title}
                        </h3>

                        <p className="mt-3 max-w-xs text-sm leading-6 text-command-muted">
                            {feature.description}
                        </p>
                    </div>

                    <div className="mt-8 h-px w-6 bg-command-green transition-all duration-300 group-hover:w-12" />
                </article>
            ))}
        </div>
    );
};

export default FeatureGrid;
