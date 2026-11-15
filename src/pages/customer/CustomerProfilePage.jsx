
import { useAuth } from "../../context/AuthContext";
import CustomerLayout from "../../layouts/customer/CustomerLayout";

function CustomerProfilePage() {
    const { user } = useAuth();

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <CustomerLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Profil Saya
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Informasi akun Paddle Court Booking.
                    </p>
                </div>

                <div className="max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface">
                    <div className="bg-primary p-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-28 w-28 shrink-0 aspect-square items-center justify-center rounded-full border-[5px] border-white bg-linear-to-br from-rose-100 via-rose-200 to-rose-300 text-3xl font-extrabold text-primary shadow-[0_6px_20px_rgba(0,0,0,0.3)] ring-2 ring-primary/30">
                                {user?.name
                                    ?.trim()
                                    .split(/\s+/)
                                    .slice(0, 2)
                                    .map((word) => word.charAt(0).toUpperCase())
                                    .join("") || "U"}
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-foreground">
                                    {user?.name || "-"}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Customer
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5 p-6">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Nama Lengkap
                            </p>
                            <p className="mt-1 font-medium text-foreground">
                                {user?.name || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Alamat Email
                            </p>
                            <p className="mt-1 font-medium text-foreground">
                                {user?.email || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Tanggal Bergabung
                            </p>
                            <p className="mt-1 font-medium text-foreground">
                                {formatDate(user?.created_at)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}

export default CustomerProfilePage;
