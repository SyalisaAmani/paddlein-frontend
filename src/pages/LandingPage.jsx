import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, MessageCircle, Send, Bot } from "lucide-react";
import api from "../services/api";

function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Courts
    const [courts, setCourts] = useState([]);
    const [loadingCourts, setLoadingCourts] = useState(true);
    const [courtError, setCourtError] = useState("");

    // Search, sorting, pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("default");
    const [currentPage, setCurrentPage] = useState(1);

    const courtsPerPage = 6;

    // FAQ 
    const [openFaq, setOpenFaq] = useState(0);

    // Chatbot assistant
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState("");

    const [chatMessages, setChatMessages] = useState([
        {
            role: "assistant",
            text: "Halo! 👋 Selamat datang di Paddle.In. Ada yang bisa saya bantu seputar booking lapangan?",
        },
    ]);

    const navigationItems = [
        { label: "Home", href: "#home" },
        { label: "Lapangan", href: "#courts" },
        { label: "FAQ", href: "#faq" },
    ];

    // Frequently asked
    const faqItems = [
        {
            question: "Bagaimana cara booking lapangan?",
            answer: "Login ke akun Paddle.In, lih lapangan yang tersedia, tentukan tanggal dan jam bermain, kemudian ikuti proses booking hingga selesai.",
        },
        {
            question: "Apakah harus login untuk melakukan booking?",
            answer: "Ya. Kamu perlu login terlebih dahulu agar dapat melakukan booking dan melihat riwayat pesanan.",
        },
        {
            question: "Berapa lama durasi setiap booking?",
            answer: "Setiap sesi booking memiliki durasi bermain selama 60 menit atau 1 jam.",
        },
        {
            question: "Bagaimana cara melakukan pembayaran?",
            answer: "Pembayaran dilakukan secara manual melalui instruksi yang diberikan setelah booking. Admin akan melakukan verifikasi dan memperbarui status pembayaran.",
        },
        {
            question: "Apakah booking bisa dibatalkan?",
            answer: "Customer dapat membatalkan booking apabila waktu bermain masih lebih dari 2 jam lagi. Jika sudah kurang dari 2 jam sebelum jadwal bermain, pembatalan tidak dapat dilakukan oleh customer.",
        },
    ];

    // Fetch courts
    useEffect(() => {
        const fetchCourts = async () => {
            try {
                setLoadingCourts(true);
                setCourtError("");

                const response = await api.get("/courts");

                setCourts(response.data.data || []);
            } catch (error) {
                console.error("Error fetching courts:", error);

                setCourtError(
                    error.response?.data?.message ||
                    "Gagal mengambil data lapangan."
                );
            } finally {
                setLoadingCourts(false);
            }
        };

        fetchCourts();
    }, []);

    // Navbar scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Filter and sorting
    const filteredCourts = courts
        .filter((court) => court.is_active)
        .filter((court) =>
            String(court.name || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "price-low") {
                return (
                    Number(a.price_per_hour) -
                    Number(b.price_per_hour)
                );
            }

            if (sortBy === "price-high") {
                return (
                    Number(b.price_per_hour) -
                    Number(a.price_per_hour)
                );
            }

            return a.id - b.id;
        });

    // Pagination calculation
    const totalPages = Math.ceil(
        filteredCourts.length / courtsPerPage
    );

    const startIndex = (currentPage - 1) * courtsPerPage;

    const currentCourts = filteredCourts.slice(
        startIndex,
        startIndex + courtsPerPage
    );

    // Reset page when search or sorting changes
    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleSort = (value) => {
        setSortBy(value);
        setCurrentPage(1);
    };

    // Data chatbot assistant
    const quickQuestions = [
        "Bagaimana cara booking?",
        "Berapa harga sewa lapangan?",
        "Bagaimana cara pembayaran?",
        "Apakah booking bisa dibatalkan?",
    ];

    const getBotResponse = (message) => {
        const text = message.toLowerCase();

        if (
            text.includes("booking") ||
            text.includes("pesan") ||
            text.includes("reservasi")
        ) {
            return "Untuk booking lapangan, kamu bisa mengikuti langkah berikut:\n\n1. Login ke akun Paddle.In.\n2. Pilih lapangan yang tersedia.\n3. Tentukan tanggal dan jam bermain.\n4. Konfirmasi booking.\n\nMudah, kan? 😊";
        }

        if (
            text.includes("harga") ||
            text.includes("biaya") ||
            text.includes("tarif")
        ) {
            return "Harga sewa setiap lapangan dapat berbeda. Kamu bisa melihat daftar lapangan beserta harga per jam melalui menu Lapangan di Landing Page.";
        }

        if (
            text.includes("bayar") ||
            text.includes("pembayaran") ||
            text.includes("payment")
        ) {
            return "Pembayaran dilakukan secara manual sesuai instruksi yang diberikan setelah booking. Setelah melakukan pembayaran, admin akan memverifikasi dan memperbarui status pembayaran kamu.";
        }

        if (
            text.includes("batal") ||
            text.includes("cancel") ||
            text.includes("pembatalan")
        ) {
            return "Customer dapat membatalkan booking jika waktu bermain masih lebih dari 2 jam lagi. Jika sudah kurang dari 2 jam sebelum jadwal bermain, pembatalan tidak dapat dilakukan oleh customer.";
        }

        if (
            text.includes("durasi") ||
            text.includes("berapa lama") ||
            text.includes("lama bermain")
        ) {
            return "Durasi setiap sesi booking di Paddle.In adalah 60 menit atau 1 jam."
        }

        if (
            text.includes("login") ||
            text.includes("daftar") ||
            text.includes("register")
        ) {
            return "Untuk menggunakan layanan booking, kamu perlu memiliki akun Paddle.In. Silakan login jika sudah memiliki akun atau register untuk membuat akun baru.";
        }

        return "Maaf, saya belum memahami pertanyaan tersebut. Kamu bisa menanyakan seputar booking, harga sewa, pembayaran, durasi bermain, atau pembatalan.";
    };

    const handleSendMessage = (message = chatInput) => {
        const trimmedMessage = message.trim();

        if (!trimmedMessage) return;

        const userMessage = {
            role: "user",
            text: trimmedMessage,
        };

        const botMessage = {
            role: "assistant",
            text: getBotResponse(trimmedMessage),
        };

        setChatMessages((prev) => [
            ...prev,
            userMessage,
            botMessage,
        ]);

        setChatInput("");
    };

    return (
        <div
            data-theme="light"
            className="min-h-screen bg-background text-foreground"
        >
            {/* Navbar */}
            <nav
                className={`sticky top-0 z-50 -mb-18 border-b transition-colors duration-300 ${
                    isScrolled
                        ? "border-orange-500/30 bg-slate-900/95"
                        : "border-transparent bg-transparent"
                }`}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    {/* Desktop Menu */}
                    <div className="hidden items-center gap-10 lg:flex">
                        {navigationItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className="font-semibold text-white transition-colors duration-200 hover:text-orange-400"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    {/* Mobile & Tablet Hamburger */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="rounded-lg p-2 text-white transition hover:text-orange-400 lg:hidden"
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                    >
                        {isMenuOpen ? (
                            <X size={25} />
                        ) : (
                            <Menu size={25} />
                        )}
                    </button>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="rounded-control px-4 py-2.5 text-sm font-bold text-white transition-colors hover:text-orange-400"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="rounded-control bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-orange-600"
                        >
                            Register
                        </Link>
                    </div>
                </div>

                {/* Mobile & Tablet Dropdown */}
                {isMenuOpen && (
                    <div
                        className={`border-t px-6 py-5 lg:hidden ${
                            isScrolled
                                ? "border-orange-500/30 bg-slate-900/95"
                                : "border-white/20 bg-slate-950/80"
                        }`}
                    >
                        <div className="flex flex-col gap-5">
                            {navigationItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="font-semibold text-white transition-colors hover:text-orange-400"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            <main>
                {/* Hero */}
                <section
                    id="home"
                    className="relative flex min-h-145 items-center overflow-hidden bg-cover bg-center sm:min-h-170"
                    style={{
                        backgroundImage:
                            "url('https://redsportpadel.it/wp-content/uploads/2024/01/01_rs_VPanoramic_principal_2160px_60q-1.jpg')",
                    }}
                >
                    <div className="absolute inset-0 bg-slate-950/60" />

                    <div className="absolute inset-0 bg-linear-to-r from-slate-950/80 via-slate-950/45 to-transparent" />

                    {/* Hero Content */}
                    <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 text-center">
                        <div className="mx-auto max-w-3xl">

                            <h1 className="mt-7 font-heading text-5xl font-extrabold leading-tight text-white sm:text-6xl lg:text-7xl">
                                Play Your Game
                                <span className="block text-orange-400">
                                    With Paddle.In
                                </span>
                            </h1>

                            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
                                Temukan lapangan padel favoritmu dan pesan
                                jadwal bermain dengan mudah.
                            </p>

                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 h-1.5 w-full bg-linear-to-r from-orange-500 via-orange-400 to-transparent" />
                </section>

                {/* Courts Catalog */}
                <section
                    id="courts"
                    className="scroll-mt-24 bg-background px-6 py-20 sm:py-24"
                >
                    <div className="mx-auto max-w-7xl">

                        {/* Heading */}
                        <div className="mb-12 text-center">
                            <h2 className="mt-5 font-heading text-3xl font-extrabold text-foreground sm:text-4xl">
                                Find Your Perfect Court
                            </h2>

                            <p className="mx-auto mt-4 max-w-2xl text-muted leading-7">
                                Temukan lapangan padel terbaik untuk pengalaman
                                bermain yang lebih menyenangkan. Pilih lapangan
                                favoritmu dan pesan jadwal bermain sekarang.
                            </p>
                        </div>

                        {/* Search & Sorting */}
                        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="w-full sm:max-w-md">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
                                    }
                                    placeholder="Cari nama lapangan..."
                                    className="w-full rounded-control border border-border bg-surface px-5 py-3 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="court-sort"
                                    className="whitespace-nowrap text-sm font-medium text-muted"
                                >
                                    Urutkan:
                                </label>

                                <select
                                    id="court-sort"
                                    value={sortBy}
                                    onChange={(e) =>
                                        handleSort(e.target.value)
                                    }
                                    className="w-full rounded-control border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-accent sm:w-auto"
                                >
                                    <option value="default">
                                        Default
                                    </option>
                                    <option value="price-low">
                                        Harga terendah
                                    </option>
                                    <option value="price-high">
                                        Harga tertinggi
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Court Count */}
                        {!loadingCourts && !courtError && (
                            <p className="mb-6 text-sm text-muted">
                                Menampilkan {filteredCourts.length} lapangan aktif
                            </p>
                        )}

                        {/* Loading */}
                        {loadingCourts && (
                            <div className="py-16 text-center text-muted">
                                Memuat data lapangan...
                            </div>
                        )}

                        {/* Error */}
                        {!loadingCourts && courtError && (
                            <div className="rounded-card border border-danger bg-surface p-8 text-center">
                                <p className="text-danger">
                                    {courtError}
                                </p>
                            </div>
                        )}

                        {/* Court Cards */}
                        {!loadingCourts &&
                            !courtError &&
                            currentCourts.length > 0 && (
                                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                                    {currentCourts.map((court) => (
                                        <div
                                            key={court.id}
                                            className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                                        >
                                            {/* Image */}
                                            <div className="relative h-56 overflow-hidden bg-surface-elevated">
                                                {court.image ? (
                                                    <img
                                                        src={court.image}
                                                        alt={court.name}
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = "none";
                                                        }}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-sm text-muted">
                                                        Gambar tidak tersedia
                                                    </div>
                                                )}

                                                <span className="absolute right-4 top-4 rounded-full bg-green-500 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                                                    Available
                                                </span>
                                            </div>

                                            {/* Information */}
                                            <div className="flex flex-1 flex-col p-6">
                                                <h3 className="font-heading text-xl font-bold text-foreground">
                                                    {court.name}
                                                </h3>

                                                <p className="mt-3 min-h-18 line-clamp-3 text-sm leading-6 text-muted">
                                                    {court.description || "Tidak ada deskripsi tersedia."}
                                                </p>

                                                <div className="mt-auto border-t border-border pt-5">
                                                    <p className="text-xs font-medium uppercase tracking-wider text-muted">
                                                        Harga sewa
                                                    </p>

                                                    <p className="mt-1 font-heading text-xl font-extrabold text-accent">
                                                        Rp
                                                        {Number(
                                                            court.price_per_hour
                                                        ).toLocaleString("id-ID")}

                                                        <span className="ml-1 text-sm font-medium text-muted">
                                                            / jam
                                                        </span>
                                                    </p>
                                                </div>

                                                <Link
                                                    to="/login"
                                                    className="mt-6 block w-full rounded-control bg-accent px-5 py-3 text-center font-bold text-white transition hover:bg-accent-hover"
                                                >
                                                    Book Now
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        {/* Empty State */}
                        {!loadingCourts &&
                            !courtError &&
                            filteredCourts.length === 0 && (
                                <div className="rounded-card border border-border bg-surface px-6 py-16 text-center">
                                    <h3 className="font-heading text-xl font-bold text-foreground">
                                        Lapangan tidak ditemukan
                                    </h3>

                                    <p className="mt-3 text-sm text-muted">
                                        Coba gunakan kata kunci pencarian
                                        yang berbeda.
                                    </p>
                                </div>
                            )}

                        {/* Pagination */}
                        {!loadingCourts &&
                            !courtError &&
                            totalPages > 1 && (
                                <div className="mt-12 flex flex-wrap items-center justify-center gap-2">

                                    <button
                                        onClick={() =>
                                            setCurrentPage((page) => page - 1)
                                        }
                                        disabled={currentPage === 1}
                                        className="rounded-control border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Previous
                                    </button>

                                    {Array.from(
                                        { length: totalPages },
                                        (_, index) => index + 1
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`h-10 w-10 rounded-control border text-sm font-bold transition ${
                                                currentPage === page
                                                    ? "border-accent bg-accent text-white"
                                                    : "border-border text-foreground hover:border-accent hover:text-accent"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() =>
                                            setCurrentPage((page) => page + 1)
                                        }
                                        disabled={currentPage === totalPages}
                                        className="rounded-control border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                    </div>
                </section>


                {/* FAQ Section */}
                <section
                    id="faq"
                    className="scroll-mt-24 bg-surface px-6 py-20 sm:py-24"
                >
                    <div className="mx-auto max-w-4xl">

                        {/* Heading */}
                        <div className="mb-12 text-center">
                            <h2 className="mt-5 font-heading text-3xl font-extrabold text-foreground sm:text-4xl">
                                Frequently Asked Questions
                            </h2>

                            <p className="mx-auto mt-4 max-w-2xl text-muted leading-7">
                                Punya pertanyaan seputar Paddle.In?
                                Temukan jawabannya di sini.
                            </p>
                        </div>

                        {/* FAQ Accordion */}
                        <div className="space-y-4">
                            {faqItems.map((item, index) => (
                                <div
                                    key={index}
                                    className={`overflow-hidden rounded-card border transition-colors duration-300 ${
                                        openFaq === index
                                            ? "border-accent/50 bg-background"
                                            : "border-border bg-background"
                                    }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenFaq(
                                                openFaq === index ? null : index
                                            )
                                        }
                                        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                                    >
                                        <span className="font-semibold text-foreground">
                                            {item.question}
                                        </span>

                                        <span
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-bold transition-all duration-300 ${
                                                openFaq === index
                                                    ? "rotate-45 bg-accent text-white"
                                                    : "bg-surface-elevated text-muted"
                                            }`}
                                        >
                                            +
                                        </span>
                                    </button>

                                    {openFaq === index && (
                                        <div className="border-t border-border px-6 py-5">
                                            <p className="text-sm leading-7 text-muted">
                                                {item.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Contact CTA */}
                    </div>
                </section>


                {/* Footer */}
                <footer className="bg-slate-950 px-6 pt-16 text-white">
                    <div className="mx-auto max-w-7xl">

                        {/* Footer Content */}
                        <div className="grid grid-cols-1 gap-12 pb-12 sm:grid-cols-2 lg:grid-cols-3">

                            {/* Brand */}
                            <div>
                                <h2 className="font-heading text-2xl font-extrabold">
                                    Paddle.In
                                </h2>

                                <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
                                    Temukan lapangan padel favoritmu dan nikmati pengalaman
                                    bermain yang lebih praktis. Pesan lapangan dengan mudah
                                    bersama Paddle.In
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h3 className="font-heading text-lg font-bold">
                                    Quick Links
                                </h3>

                                <ul className="mt-5 space-y-4 text-sm text-slate-400">
                                    <li>
                                        <a
                                            href="#home"
                                            className="transition-colors hover:text-orange-400"
                                        >
                                            Home
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            href="#courts"
                                            className="transition-colors hover:text-orange-400"
                                        >
                                            Lapangan
                                        </a>
                                    </li>

                                    <li>
                                        <a
                                            href="#faq"
                                            className="transition-colors hover:text-orange-400"
                                        >
                                            FAQ
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Account */}
                            <div>
                                <h3 className="font-heading text-lg font-bold">
                                    Account
                                </h3>

                                <ul className="mt-5 space-y-4 text-sm text-slate-400">
                                    <li>
                                        <Link
                                            to="/login"
                                            className="transition-colors hover:text-orange-400"
                                        >
                                            Login
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/register"
                                            className="transition-colors hover:text-orange-400"
                                        >
                                            Register
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="border-t border-slate-800 py-6 text-center">
                            <p className="text-xs text-slate-500 sm:text-sm">
                                © {new Date().getFullYear()} Paddle.In. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </main>

            {/* Paddle Chatbot Assistant */}
            <div className="fixed bottom-6 right-6 z-100">

                {/* Chat Window */}
                {isChatOpen && (
                    <div className="mb-4 flex h-125 w-[calc(100vw-3rem)] max-w-95 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">

                        {/* Chat Header */}
                        <div className="flex items-center justify-between bg-slate-900 px-5 py-4 text-white">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500">
                                    <Bot size={23} />
                                </div>

                                <div>
                                    <h3 className="font-bold">
                                        Paddle Assistant
                                    </h3>

                                    <p className="text-xs text-green-400">
                                        Online · Ready to help
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="rounded-lg p-2 text-white transition hover:bg-white/10"
                                aria-label="Close chat"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 space-y-4 overflow-y-auto bg-background p-4">

                            {chatMessages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        message.role === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${
                                            message.role === "user"
                                                ? "rounded-br-sm bg-accent text-white"
                                                : "rounded-bl-sm border border-border bg-surface text-foreground"
                                        }`}
                                    >
                                        {message.text}
                                    </div>
                                </div>
                            ))}

                        </div>

                        {/* Quick Questions */}
                        <div className="border-t border-border bg-surface px-4 py-3">
                            <p className="mb-2 text-xs font-semibold text-muted">
                                Pertanyaan cepat
                            </p>

                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {quickQuestions.map((question) => (
                                    <button
                                        key={question}
                                        onClick={() => handleSendMessage(question)}
                                        className="shrink-0 rounded-full border border-accent/30 px-3 py-2 text-xs font-medium text-accent transition hover:bg-accent hover:text-white"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chat Input */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                            className="flex items-center gap-2 border-t border-border bg-surface p-3"
                        >
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Tulis pertanyaan..."
                                className="min-w-0 flex-1 rounded-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-accent"
                            />

                            <button
                                type="submit"
                                disabled={!chatInput.trim()}
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Send message"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                )}

                {/* Floating Chat Button */}
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-xl transition duration-300 hover:scale-110 hover:bg-accent-hover"
                    aria-label="Open Paddle Assistant"
                >
                    {isChatOpen ? (
                        <X size={25} />
                    ) : (
                        <MessageCircle size={25} />
                    )}
                </button>
            </div>
        </div>
    );
}

export default LandingPage;
