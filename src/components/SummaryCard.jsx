
function SummaryCard({ title, value, description, icon: Icon}) {
    return (
        <div className="bg-surface border border-border rounded-card p-5">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-muted">
                    {title}
                </p>

                <div className="p-2 rounded-control bg-accent/10 text-accent">
                    <Icon size={20} />
                </div>
            </div>

            <h3 className="font-heading text-2xl font-bold text-foreground">
                {value}
            </h3>

            <p className="text-sm text-muted mt-2">
                {description}
            </p>
        </div>
    )
}

export default SummaryCard