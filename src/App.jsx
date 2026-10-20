import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  Menu,
  X,
  Trash2,
  Plus,
  Search,
  LogOut,
  UserRound,
  Pencil,
  Image as ImageIcon,
  Package,
  PackageCheck,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Phone,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Wallet,
  AlertCircle,
  Check,
  Tag,
  Percent,
  Bell,
} from "lucide-react";
import Swal from "sweetalert2";
import { api, fileData } from "./api";
import { useAuth } from "./context/AuthContext";
import logo from "./assets/logo.jpeg";
import logobgl from "./assets/logobgl.png";

import bkashLogo from "./assets/bkash.png";
import nagadLogo from "./assets/nagad.svg";
import rocketLogo from "./assets/rocket.webp";

const C = createContext(null);

const money = (n) => `৳${Number(n || 0).toLocaleString("en-BD")}`;

const msg = (title, icon = "success") =>
  Swal.fire({
    title,
    icon,
    confirmButtonColor: "#F54900",
  });

/* ============================================================ */
/* Reusable Loaders                                             */
/* ============================================================ */
function Loader({ text = "Loading", fullScreen = false }) {
  return (
    <div
      className={
        fullScreen
          ? "flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-[#faf9f6]"
          : "flex w-full flex-col items-center justify-center gap-4 py-16"
      }
    >
      <div className="tie-loader">
        <div className="tie-loader-ring" />
        <div className="tie-loader-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
      <p className="tie-loader-text">
        <strong>Take It Easy</strong> · {text}...
      </p>
    </div>
  );
}

function InlineLoader({ dark = false }) {
  return <span className={`tie-inline-loader ${dark ? "dark" : ""}`} />;
}

/* Hind Siliguri Font */
function FontSetup() {
  useEffect(() => {
    const fontId = "hind-siliguri-font";
    let fontLink = document.getElementById(fontId);

    if (!fontLink) {
      fontLink = document.createElement("link");
      fontLink.id = fontId;
      fontLink.rel = "stylesheet";
      fontLink.href =
        "https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap";

      document.head.appendChild(fontLink);
    }

    document.documentElement.style.fontFamily = "'Hind Siliguri', sans-serif";
    document.body.style.fontFamily = "'Hind Siliguri', sans-serif";

    const styleId = "hind-class-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent =
        '.hind { font-family: "Hind Siliguri", sans-serif !important; }';
      document.head.appendChild(style);
    }
  }, []);

  return null;
}

/* Shopping Cart */
function useCart() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tie_cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("tie_cart", JSON.stringify(cart));
  }, [cart]);

  const add = (p, size = "", notify = true) => {
    if (Number(p.stock || 0) <= 0) {
      if (notify) {
        msg("এই পণ্যটি স্টক আউট।", "warning");
      }
      return;
    }

    setCart((old) => {
      const key = p._id + ":" + size;
      const found = old.find((i) => i.key === key);

      return found
        ? old.map((i) =>
            i.key === key ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [
            ...old,
            {
              key,
              productId: p._id,
              title: p.title,
              image: p.images?.[0] || "",
              price: p.price,
              quantity: 1,
              size,
            },
          ];
    });

    if (notify) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "কার্টে যোগ হয়েছে!",
        text: `${p.title} কার্টে যোগ করা হয়েছে।`,
        showConfirmButton: false,
        timer: 3200,
        timerProgressBar: true,
        background: "#111111",
        color: "#FFFFFF",
        iconColor: "#8BC34A",
        customClass: {
          popup: "tie-cart-toast",
          title: "tie-cart-toast-title hind",
          htmlContainer: "tie-cart-toast-text hind",
          timerProgressBar: "tie-cart-toast-progress",
        },
      });
    }
  };

  const update = (key, q) =>
    setCart((old) =>
      old.map((i) =>
        i.key === key ? { ...i, quantity: Math.max(1, Number(q) || 1) } : i,
      ),
    );

  const remove = (key) => setCart((old) => old.filter((i) => i.key !== key));

  return {
    cart,
    setCart,
    add,
    update,
    remove,
    count: cart.reduce((s, i) => s + i.quantity, 0),
    total: cart.reduce((s, i) => s + i.price * i.quantity, 0),
  };
}

/* Header */
function Header() {
  const { count } = useContext(C);
  const { customer, logoutCustomer } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="wrap head">
        <Link className="" to="/">
          <img className="w-20" src={logo} alt="Take It Easy Logo" />
        </Link>

        <button
          className="menu"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>

        <nav className={open ? "nav open" : "nav"}>
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>
          <Link to="/products" onClick={() => setOpen(false)}>
            Shop all
          </Link>

          <Link to="/contact" onClick={() => setOpen(false)}>
            Contact
          </Link>
          <Link to="/track-order" onClick={() => setOpen(false)}>
            Track order
          </Link>
        </nav>

        <div className="actions">
          {customer?.user ? (
            <>
              <Link to="/profile" title="Profile">
                <UserRound size={18} />
              </Link>

              <button onClick={logoutCustomer} title="Log out">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <Link to="/login">Log in</Link>
          )}

          <Link className="bag rounded-xl" to="/cart">
            <ShoppingBag size={17} />
            <span className="hind">কার্ট</span> <b>{count}</b>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* Footer */

function Footer() {
  return (
    <footer className="w-full bg-[#111111] text-white">
      <div className="mx-auto w-full max-w-[1380px] px-5 py-10 sm:px-8 lg:px-10">
        <div className="flex w-full flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex min-w-0 flex-col items-start md:flex-1">
            <Link
              to="/"
              aria-label="Take It Easy Home"
              className="inline-flex items-center"
            >
              <img
                src={logobgl}
                alt="Take It Easy Logo"
                className="block h-auto w-[80px] object-contain sm:w-[90px]"
              />
            </Link>

            <p className="mt-3 max-w-[280px] text-xs leading-6 text-white/70 sm:text-sm">
              Good clothes. No complicated feelings.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-col items-start gap-4 text-sm font-medium sm:flex-row sm:items-center sm:gap-8 md:shrink-0"
          >
            <Link
              to="/products"
              className="whitespace-nowrap transition-colors hover:text-orange-400"
            >
              Shop all
            </Link>

            <Link
              to="/contact"
              className="whitespace-nowrap transition-colors hover:text-orange-400"
            >
              Contact
            </Link>

            <Link
              to="/track-order"
              className="whitespace-nowrap transition-colors hover:text-orange-400"
            >
              Track order
            </Link>
          </nav>
        </div>

        <div className="mt-10 flex w-full flex-col-reverse items-start justify-between gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:gap-4">
          <small className="m-0 text-xs leading-5 text-white/60 sm:text-sm">
            © {new Date().getFullYear()} Take It Easy. All rights reserved.
          </small>

          <div className="m-0 text-xs leading-5 text-white/60 sm:text-sm">
            Built by{" "}
            <a
              href="https://webbuzzbd.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#9BFB47" }}
              className="!text-[#9BFB47] font-semibold transition-colors duration-200 hover:!text-[#B5FF7A]"
            >
              Webbuzz BD
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

/* ============================================================ */
/* Discount helper                                              */
/* ============================================================ */
function getDiscountInfo(p) {
  const price = Number(p.price) || 0;
  const compare = Number(p.compareAtPrice) || 0;
  const custom = Number(p.discountPercent) || 0;

  if (custom > 0 && custom < 100) {
    const original = Math.round(price / (1 - custom / 100));
    return {
      percent: Math.round(custom),
      original: Math.max(original, price),
      source: "custom",
    };
  }

  if (compare > price && price > 0) {
    const percent = Math.round((1 - price / compare) * 100);
    return { percent, original: compare, source: "auto" };
  }

  return { percent: 0, original: 0, source: "none" };
}

/* ============================================================ */
/* Product Card                                                 */
/* ============================================================ */
function Card({ p, add }) {
  const isOutOfStock = Number(p.stock || 0) <= 0;
  const discount = getDiscountInfo(p);
  const hasSale = discount.percent > 0;

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:border-stone-300 hover:shadow-lg sm:rounded-2xl sm:hover:-translate-y-1 sm:hover:shadow-xl">
      <Link
        to={`/product/${p.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-stone-100"
        aria-label={`View ${p.title}`}
      >
        <img
          src={
            p.images?.[0] || "https://placehold.co/600x750?text=Take+It+Easy"
          }
          alt={p.title}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 ease-out sm:duration-700 sm:group-hover:scale-105 ${
            isOutOfStock ? "opacity-60 grayscale" : ""
          }`}
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

        {isOutOfStock ? (
          <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] rounded-full bg-stone-900 px-2 py-1 text-[9px] font-extrabold uppercase leading-tight tracking-wide text-white shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:text-[10px]">
            Stock Out
          </span>
        ) : (
          hasSale && (
            <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] rounded-full bg-orange-600 px-2 py-1 text-[9px] font-extrabold leading-tight text-white shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:text-[10px] sm:tracking-wide">
              Sale · {discount.percent}% off
            </span>
          )
        )}

        <span className="absolute bottom-3 right-3 hidden h-10 w-10 translate-y-2 place-items-center rounded-full bg-white text-stone-900 opacity-0 shadow-lg transition-all duration-300 sm:grid sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <ArrowUpRight size={19} aria-hidden="true" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-2.5 sm:p-4 lg:p-5">
        {p.category && (
          <p className="mb-1.5 truncate text-[9px] font-bold uppercase tracking-wider text-stone-500 sm:mb-2 sm:text-[10px] sm:tracking-[0.16em]">
            {p.category}
          </p>
        )}

        <Link
          to={`/product/${p.slug}`}
          className="line-clamp-2 min-h-[2.5rem] break-words text-[13px] font-semibold leading-5 text-stone-900 transition-colors hover:text-orange-700 sm:min-h-[3rem] sm:text-base sm:leading-6 lg:text-[17px]"
        >
          {p.title}
        </Link>

        <div className="mt-2 flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-1 sm:mt-3 sm:gap-x-2">
          <strong className="text-base font-extrabold leading-tight tracking-tight text-stone-950 sm:text-lg">
            {money(p.price)}
          </strong>

          {hasSale && (
            <del className="text-[11px] font-medium text-stone-400 sm:text-sm">
              {money(discount.original)}
            </del>
          )}
        </div>

        {isOutOfStock ? (
          <button
            type="button"
            disabled
            aria-label="স্টক শেষ"
            className="mt-3 flex min-h-10 w-full min-w-0 cursor-not-allowed items-center justify-center gap-1 rounded-lg border border-stone-200 bg-stone-100 px-1.5 py-2 text-[11px] font-semibold leading-none text-stone-400 sm:mt-5 sm:min-h-11 sm:gap-2 sm:rounded-xl sm:px-3 sm:py-3 sm:text-sm"
          >
            <span className="hind whitespace-nowrap">স্টক শেষ</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => add(p)}
            aria-label={`কার্টে যোগ করুন: ${p.title}`}
            className="mt-3 flex min-h-10 w-full min-w-0 items-center justify-center gap-1 rounded-lg bg-stone-950 px-1.5 py-2 text-[11px] font-semibold leading-none text-white transition-colors duration-200 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 active:scale-[0.98] sm:mt-5 sm:min-h-11 sm:gap-2 sm:rounded-xl sm:px-3 sm:py-3 sm:text-sm"
          >
            <ShoppingBag
              size={14}
              className="hidden shrink-0 sm:block"
              aria-hidden="true"
            />

            <span className="hind whitespace-nowrap">কার্টে যোগ করুন</span>

            <ArrowUpRight
              size={14}
              aria-hidden="true"
              className="hidden shrink-0 sm:block"
            />
          </button>
        )}
      </div>
    </article>
  );
}

/* Page Heading */
function Heading({ tag, title, desc }) {
  return (
    <div className="pagehead">
      <span
        className={`eyebrow ${/[\u0980-\u09FF]/.test(String(tag || "")) ? "hind" : ""}`}
      >
        {tag}
      </span>
      <h1 className={/[\u0980-\u09FF]/.test(String(title || "")) ? "hind" : ""}>
        {title}
      </h1>
      {desc && <p>{desc}</p>}
    </div>
  );
}

/* ============================================================ */
/* Home Page — with smooth banner dots                          */
/* ============================================================ */
function Home() {
  const { add } = useContext(C);
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [slide, setSlide] = useState(0);
  const [visible, setVisible] = useState(8);
  const [loading, setLoading] = useState(true);

  const [bannerImageLoaded, setBannerImageLoaded] = useState(false);
  const [bannerFading, setBannerFading] = useState(false);

  const sentinel = React.useRef(null);
  const bannerTimeoutRef = React.useRef(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api("/products", { auth: false }),
      api("/banners", { auth: false }),
    ])
      .then(([p, b]) => {
        setProducts(p);
        setBanners(b);
      })
      .catch((e) => msg(e.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (banners.length < 2) return;

    const id = setInterval(() => {
      goToSlide((slide + 1) % banners.length);
    }, 5000);

    return () => clearInterval(id);
  }, [banners.length, slide]);

  useEffect(() => {
    const el = sentinel.current;

    if (!el || visible >= products.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible((v) => Math.min(v + 8, products.length));
        }
      },
      { rootMargin: "250px" },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [visible, products.length]);

  function goToSlide(nextIndex) {
    if (nextIndex === slide) return;

    setBannerFading(true);

    if (bannerTimeoutRef.current) clearTimeout(bannerTimeoutRef.current);

    bannerTimeoutRef.current = setTimeout(() => {
      setSlide(nextIndex);
      setBannerImageLoaded(false);
    }, 250);

    setTimeout(() => setBannerFading(false), 600);
  }

  useEffect(() => {
    return () => {
      if (bannerTimeoutRef.current) clearTimeout(bannerTimeoutRef.current);
    };
  }, []);

  const inStockProducts = products.filter((p) => Number(p.stock || 0) > 0);

  const b = banners[slide];

  const hasTitle = Boolean(b?.title && b.title.trim());
  const hasSubtitle = Boolean(b?.subtitle && b.subtitle.trim());
  const hasEyebrow = Boolean(b?.eyebrow && b.eyebrow.trim());
  const hasButtonText = Boolean(b?.buttonText && b.buttonText.trim());

  return (
    <main>
      <section className="wrap hero">
        <div
          className="heroimg relative overflow-hidden"
          style={
            b && bannerImageLoaded
              ? {
                  backgroundImage: `linear-gradient(90deg,#000b,#0001),url("${b.imageUrl}")`,
                }
              : {
                  backgroundImage: "linear-gradient(90deg,#000b,#0001)",
                  backgroundColor: "#1c1917",
                }
          }
        >
          <div
            className={`pointer-events-none absolute inset-0 z-[5] bg-black transition-opacity duration-500 ${
              bannerFading ? "opacity-60" : "opacity-0"
            }`}
          />

          <div
            className={`herotext relative z-20 transition-all duration-700 ease-out ${
              bannerFading
                ? "translate-y-2 opacity-0"
                : "translate-y-0 opacity-100"
            }`}
          >
            {hasEyebrow && <span className="eyebrow">{b.eyebrow}</span>}
            {hasTitle && <h1>{b.title}</h1>}
            {hasSubtitle && <p>{b.subtitle}</p>}

            <Link className="btn orange" to={b?.buttonLink || "/products"}>
              {hasButtonText ? b.buttonText : "Shop collection"}{" "}
              <ArrowUpRight />
            </Link>
          </div>

          {b && !bannerImageLoaded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <Loader text="Loading banner" />
            </div>
          )}

          {b?.imageUrl && (
            <img
              key={b.imageUrl}
              src={b.imageUrl}
              alt={b.title || "Banner"}
              className="pointer-events-none absolute h-0 w-0 opacity-0"
              onLoad={() => setBannerImageLoaded(true)}
              onError={() => setBannerImageLoaded(true)}
              aria-hidden="true"
            />
          )}

          {banners.length > 1 && (
            <>
              {/* ✅ Arrow buttons */}
              <div className="slides relative z-30">
                <button
                  aria-label="Previous banner"
                  onClick={() =>
                    goToSlide((slide + banners.length - 1) % banners.length)
                  }
                >
                  ‹
                </button>
                <button
                  aria-label="Next banner"
                  onClick={() => goToSlide((slide + 1) % banners.length)}
                >
                  ›
                </button>
              </div>

              {/* ✅ Unique dot pagination — active dot is a pill */}
              <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 sm:bottom-6">
                {banners.map((_, i) => {
                  const isActive = i === slide;

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goToSlide(i)}
                      aria-label={`Go to banner ${i + 1}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`h-2 rounded-full transition-all duration-500 ease-out ${
                        isActive
                          ? "w-8 bg-white shadow-md"
                          : "w-2 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="wrap section">
        <div className="sectitle">
          <div>
            <span className="eyebrow">THE GOOD STUFF</span>
            <h2>Your everyday favourites</h2>
          </div>

          <Link to="/products">Shop all products ↗</Link>
        </div>

        {loading ? (
          <Loader text="Fetching the good stuff" />
        ) : inStockProducts.length ? (
          <>
            <div className="grid">
              {inStockProducts.slice(0, visible).map((p) => (
                <Card key={p._id} p={p} add={add} />
              ))}
            </div>

            <div ref={sentinel} className="scrollsentinel" aria-hidden="true" />

            {visible < inStockProducts.length && (
              <p className="loadmore">Loading more pieces…</p>
            )}
          </>
        ) : (
          <div className="empty">
            No products are currently in stock. Please check back soon.
          </div>
        )}
      </section>
    </main>
  );
}

/* ============================================================ */
/* Products Page                                                */
/* ============================================================ */
function Products() {
  const { add } = useContext(C);

  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [visible, setVisible] = useState(12);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let live = true;
    setLoading(true);

    api(`/products${q.trim() ? "?q=" + encodeURIComponent(q.trim()) : ""}`, {
      auth: false,
    })
      .then((data) => {
        if (live) {
          setProducts(Array.isArray(data) ? data : []);
          setVisible(12);
        }
      })
      .catch((e) => {
        if (live) msg(e.message, "error");
      })
      .finally(() => {
        if (live) setLoading(false);
      });

    return () => {
      live = false;
    };
  }, [q]);

  const categories = [
    "All",
    ...new Set(
      products
        .map((p) => p.category)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b)),
    ),
  ];

  const priceCeiling = Math.max(
    500,
    ...products.map((p) => Number(p.price) || 0),
  );

  const filteredProducts = products
    .filter((p) => {
      const price = Number(p.price) || 0;
      const categoryMatch =
        selectedCategory === "All" || p.category === selectedCategory;
      const priceMatch = price >= minPrice && price <= maxPrice;
      return categoryMatch && priceMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return Number(a.price || 0) - Number(b.price || 0);
        case "price-high":
          return Number(b.price || 0) - Number(a.price || 0);
        case "name":
          return (a.title || "").localeCompare(b.title || "");
        default:
          return 0;
      }
    });

  function resetFilters() {
    setSelectedCategory("All");
    setMinPrice(0);
    setMaxPrice(priceCeiling);
    setSortBy("featured");
    setQ("");
    setVisible(12);
  }

  const activeFilters =
    selectedCategory !== "All" ||
    minPrice > 0 ||
    maxPrice < priceCeiling ||
    sortBy !== "featured" ||
    q.trim() !== "";

  return (
    <main
      className="min-h-screen w-full text-neutral-900"
      style={{ backgroundColor: "#faf9f6" }}
    >
      <div className="mx-auto w-full max-w-[1380px] px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-orange-600 sm:text-xs">
              THE WHOLE COLLECTION
            </p>
            <h1 className="text-3xl space font-black tracking-tight sm:text-4xl lg:text-5xl">
              Shop All.
            </h1>
            <p className="mt-2 text-sm leading-6 text-neutral-500 sm:text-base">
              Find your favourites, your way.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <span className="font-bold text-neutral-900">
              {loading ? "—" : filteredProducts.length}
            </span>
            {filteredProducts.length === 1 ? "product" : "products"} found
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:p-4">
          <div className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-xl bg-neutral-50 px-4 transition focus-within:ring-2 focus-within:ring-orange-400">
            <Search size={19} className="shrink-0 text-neutral-400" />
            <input
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setVisible(12);
              }}
              placeholder="Search products..."
              className="w-full min-w-0 bg-transparent py-3 text-sm outline-none placeholder:text-neutral-400"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="shrink-0 text-xs font-bold text-neutral-500 hover:text-orange-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-1 items-center gap-2 sm:flex-none">
              <label
                htmlFor="sort"
                className="shrink-0 text-xs font-semibold text-neutral-500"
              >
                Sort:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setVisible(12);
                }}
                className="min-h-12 flex-1 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium outline-none focus:border-orange-400 sm:w-40"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 text-sm font-bold text-white transition hover:bg-neutral-800 sm:flex-none lg:hidden"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-8">
          <aside className="hidden w-[260px] shrink-0 lg:sticky lg:top-24 lg:block">
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-lg shadow-neutral-200/40">
              <div className="bg-neutral-950 px-5 py-4 text-white">
                <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-orange-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  Filters
                </h3>
              </div>
              <div className="p-5">
                <FilterBox
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  setMinPrice={setMinPrice}
                  setMaxPrice={setMaxPrice}
                  priceCeiling={priceCeiling}
                  resetFilters={resetFilters}
                  setVisible={setVisible}
                />
              </div>
            </div>
          </aside>

          <div className="min-w-0 w-full flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-neutral-500">
                {loading ? (
                  "Loading products..."
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-bold text-neutral-900">
                      {Math.min(visible, filteredProducts.length)}
                    </span>{" "}
                    of {filteredProducts.length} products
                  </>
                )}
              </p>
              {activeFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  Clear filters ×
                </button>
              )}
            </div>

            {loading ? (
              <Loader text="Fetching products" />
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
                  {filteredProducts.slice(0, visible).map((p) => (
                    <div key={p._id} className="min-w-0">
                      <Card p={p} add={add} />
                    </div>
                  ))}
                </div>

                {visible < filteredProducts.length && (
                  <div className="mt-10 flex justify-center sm:mt-14">
                    <button
                      type="button"
                      onClick={() =>
                        setVisible((v) =>
                          Math.min(v + 12, filteredProducts.length),
                        )
                      }
                      className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-neutral-300 bg-white px-8 py-3 text-sm font-bold transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                    >
                      Load More Products
                      <span aria-hidden="true">↓</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white px-5 py-12 text-center shadow-sm">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                  <Search size={32} />
                </div>
                <h3 className="mt-6 text-xl font-extrabold">
                  No products found
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
                  {products.length === 0
                    ? "There are currently no products available."
                    : "Try changing your search, category or price range to find products."}
                </p>
                {activeFilters && (
                  <button
                    onClick={resetFilters}
                    className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm lg:hidden transition-opacity">
            <div className="h-full w-full max-w-[320px] overflow-y-auto bg-white p-5 shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="mb-6 flex items-center justify-between border-b border-neutral-100 pb-4">
                <h2 className="text-lg font-black uppercase tracking-wide">
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition hover:bg-neutral-200 hover:text-black"
                >
                  <X size={18} />
                </button>
              </div>

              <FilterBox
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                minPrice={minPrice}
                maxPrice={maxPrice}
                setMinPrice={setMinPrice}
                setMaxPrice={setMaxPrice}
                priceCeiling={priceCeiling}
                resetFilters={resetFilters}
                setVisible={setVisible}
              />

              <div className="mt-8 pt-4 border-t border-neutral-100">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-orange-600 active:scale-95"
                >
                  Show {filteredProducts.length} Results
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 border-t border-neutral-200 pt-8 text-center">
          <p className="text-sm text-neutral-500">
            Good style. No extra effort.{" "}
            <span className="font-extrabold text-neutral-900">
              Take It Easy.
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}

/* Reusable Filter Box Component */
function FilterBox({
  categories,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  priceCeiling,
  resetFilters,
  setVisible,
}) {
  return (
    <div className="w-full">
      <div className="border-b border-neutral-100 pb-5">
        <h4 className="mb-3 text-sm font-extrabold text-neutral-900">
          Category
        </h4>
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setSelectedCategory(category);
                setVisible(12);
              }}
              className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-orange-50 font-bold text-orange-700 shadow-sm ring-1 ring-orange-100"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <span className="min-w-0 break-words">{category}</span>
              {selectedCategory === category && (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="border-b border-neutral-100 py-5">
        <h4 className="mb-3 text-sm font-extrabold text-neutral-900">
          Price Range
        </h4>

        <div className="mb-5 flex items-center justify-between gap-2">
          <span className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-bold text-neutral-700">
            ৳{minPrice}
          </span>
          <span className="text-[10px] font-bold uppercase text-neutral-400">
            to
          </span>
          <span className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-bold text-neutral-700">
            ৳{maxPrice}
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold text-neutral-500">
              Minimum price
            </label>
            <input
              type="range"
              min="0"
              max={priceCeiling}
              step="50"
              value={Math.min(minPrice, priceCeiling)}
              onChange={(e) => {
                const value = Number(e.target.value);
                setMinPrice(value);
                if (value > maxPrice) setMaxPrice(value);
                setVisible(12);
              }}
              className="w-full cursor-pointer accent-orange-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold text-neutral-500">
              Maximum price
            </label>
            <input
              type="range"
              min="0"
              max={priceCeiling}
              step="50"
              value={Math.max(Math.min(maxPrice, priceCeiling), minPrice)}
              onChange={(e) => {
                const value = Number(e.target.value);
                setMaxPrice(value);
                if (value < minPrice) setMinPrice(value);
                setVisible(12);
              }}
              className="w-full cursor-pointer accent-orange-500"
            />
          </div>
        </div>

        <div className="mt-2 flex justify-between text-[10px] font-bold text-neutral-400">
          <span>৳0</span>
          <span>৳{priceCeiling}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={resetFilters}
        className="mt-5 flex min-h-11 w-full items-center justify-center rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-bold transition-all duration-200 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700 active:scale-95"
      >
        Reset filters
      </button>
    </div>
  );
}

/* ============================================================ */
/* Product Details                                              */
/* ============================================================ */
function Product() {
  const { slug } = useParams();
  const { add } = useContext(C);
  const { customer } = useAuth();

  const [data, setData] = useState(null);
  const [size, setSize] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api("/products/" + slug, { auth: false })
      .then((d) => {
        setData(d);
        setSize(d.product.sizes?.[0] || "");
        setActiveImage(0);
      })
      .catch((e) => msg(e.message, "error"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading || !data) {
    return (
      <main className="wrap page">
        <Loader text="Loading product" />
      </main>
    );
  }

  const p = data.product;
  const isOutOfStock = Number(p.stock || 0) <= 0;
  const discount = getDiscountInfo(p);

  const images = p.images?.length
    ? p.images
    : ["https://placehold.co/800x900?text=Take+It+Easy"];

  const selectedImage = Math.min(activeImage, images.length - 1);

  async function review(e) {
    e.preventDefault();

    try {
      await api(`/products/${p._id}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating, comment }),
      });

      setData(await api("/products/" + slug, { auth: false }));
      setComment("");
      msg("Review saved.");
    } catch (e) {
      msg(e.message, "error");
    }
  }

  return (
    <main className="wrap page mx-auto w-full max-w-[1380px] px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <p className="crumb mb-5 break-words text-sm text-neutral-500 sm:mb-8">
        <Link to="/" className="transition hover:text-orange-600">
          Home
        </Link>{" "}
        /{" "}
        <Link to="/products" className="transition hover:text-orange-600">
          Shop
        </Link>{" "}
        / <span className="text-neutral-800">{p.title}</span>
      </p>

      <div className="flex w-full flex-col items-start gap-7 sm:gap-9 xl:grid xl:grid-cols-2 xl:gap-12">
        <div className="w-full min-w-0">
          <div className="w-full">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-[#f5f3ef] sm:rounded-2xl">
              <img
                key={images[selectedImage]}
                src={images[selectedImage]}
                alt={p.title}
                className={`h-full w-full object-contain transition-opacity duration-200 ${
                  isOutOfStock ? "opacity-70" : ""
                }`}
              />

              {images.length > 1 && (
                <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1.5 text-xs font-medium text-white">
                  {selectedImage + 1} / {images.length}
                </span>
              )}

              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/25 backdrop-blur-[1px]">
                  <span className="rotate-[-8deg] rounded-lg bg-stone-900 px-5 py-2.5 text-base font-black uppercase tracking-widest text-white shadow-xl sm:text-lg">
                    Stock Out
                  </span>
                </div>
              )}
            </div>

            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-2 sm:mt-4 sm:gap-3">
              {images.map((src, i) => (
                <button
                  type="button"
                  key={`${src}-${i}`}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View product image ${i + 1}`}
                  aria-pressed={selectedImage === i}
                  className={`relative h-[76px] w-[64px] shrink-0 overflow-hidden rounded-lg border-2 bg-[#f5f3ef] transition-all duration-200 sm:h-24 sm:w-20 ${
                    selectedImage === i
                      ? "border-orange-500 opacity-100 ring-1 ring-orange-500"
                      : "border-transparent opacity-70 hover:border-neutral-300 hover:opacity-100"
                  }`}
                >
                  <img
                    src={src}
                    alt={`${p.title} thumbnail ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow">{p.category}</span>

            {isOutOfStock && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-red-700">
                <XCircle size={11} /> Stock Out
              </span>
            )}
          </div>

          <h1 className="mt-2 break-words text-2xl font-semibold leading-tight text-neutral-900 sm:text-3xl xl:text-4xl">
            {p.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <h2 className="flex flex-wrap items-center gap-x-3 gap-y-1 text-2xl font-bold text-neutral-900 sm:text-3xl">
              {money(p.price)}

              {discount.percent > 0 && (
                <del className="text-lg font-normal text-neutral-400 sm:text-xl">
                  {money(discount.original)}
                </del>
              )}
            </h2>

            {discount.percent > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-orange-700">
                <Percent size={11} /> {discount.percent}% off
              </span>
            )}
          </div>

          <p className="description mt-4 whitespace-pre-line break-words text-sm leading-7 text-neutral-600 sm:text-base">
            {p.description}
          </p>

          {p.material && (
            <p className="mt-4 text-sm text-neutral-700 sm:text-base">
              <b>Material:</b> {p.material}
            </p>
          )}

          {p.gsm && (
            <p className="mt-2 text-sm text-neutral-700 sm:text-base">
              <b>Weight:</b> {p.gsm}
            </p>
          )}

          {p.sizes?.length > 0 && (
            <div className="sizes mt-6">
              <b className="mb-3 block text-sm text-neutral-900 sm:text-base">
                Choose size
              </b>

              <div className="flex flex-wrap gap-2">
                {p.sizes.map((s) => (
                  <button
                    type="button"
                    className={`min-w-12 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                      s === size
                        ? "selected border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-300 bg-white text-neutral-800 hover:border-neutral-900"
                    } ${isOutOfStock ? "cursor-not-allowed opacity-50" : ""}`}
                    onClick={() => {
                      if (isOutOfStock) return;
                      setSize(s);
                    }}
                    disabled={isOutOfStock}
                    key={s}
                    aria-pressed={s === size}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="buyrow mt-6 grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:mt-8">
            {isOutOfStock ? (
              <>
                <button
                  type="button"
                  disabled
                  className="flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-100 px-4 py-3 text-sm font-bold text-neutral-400"
                >
                  <XCircle size={16} />
                  <span>স্টক শেষ</span>
                </button>

                <Link
                  to="/products"
                  className="btn dark flex min-w-0 items-center justify-center gap-2"
                >
                  <span>অন্য পণ্য দেখুন</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn orange flex min-w-0 items-center justify-center gap-2"
                  onClick={() => {
                    if (p.sizes?.length && !size) {
                      return msg("Please select a size.", "warning");
                    }

                    add(p, size);
                  }}
                >
                  <span className="hind text-sm">কার্টে যোগ করুন</span>
                  <ShoppingBag className="h-4 w-4 shrink-0" />
                </button>

                <button
                  type="button"
                  className="btn dark flex min-w-0 items-center justify-center gap-2"
                  onClick={() => {
                    if (p.sizes?.length && !size) {
                      return msg("Please select a size.", "warning");
                    }

                    add(p, size, false);
                    location.href = "/checkout";
                  }}
                >
                  <span>Buy now</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
              </>
            )}
          </div>

          <section className="reviews mt-9 border-t border-neutral-200 pt-6 sm:mt-12 sm:pt-8">
            <h2 className="text-xl font-semibold text-neutral-900 sm:text-2xl">
              Customer reviews ({data.reviews.length})
            </h2>

            <div className="mt-5 space-y-4">
              {data.reviews.map((r) => (
                <article
                  className="review rounded-xl border border-neutral-200 p-4 sm:p-5"
                  key={r._id}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <b className="break-words text-sm text-neutral-900 sm:text-base">
                      {r.userName}
                    </b>

                    <span
                      className="shrink-0 text-sm tracking-wide text-amber-500"
                      aria-label={`${r.rating} out of 5 stars`}
                    >
                      {"★".repeat(r.rating)}
                      {"☆".repeat(5 - r.rating)}
                    </span>
                  </div>

                  <p className="mt-2 break-words text-sm leading-6 text-neutral-600">
                    {r.comment}
                  </p>
                </article>
              ))}
            </div>

            <form
              className="box stack mt-6 space-y-4 rounded-xl border border-neutral-200 p-4 sm:p-6"
              onSubmit={review}
            >
              <h3 className="text-lg font-semibold text-neutral-900">
                Leave a review
              </h3>

              {!customer?.token && (
                <small className="text-sm text-neutral-500">
                  Log in to submit a review.
                </small>
              )}

              <label className="block space-y-2 text-sm font-medium text-neutral-700">
                Rating
                <select
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} stars
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2 text-sm font-medium text-neutral-700">
                Review
                <textarea
                  className="min-h-28 w-full resize-y rounded-lg border border-neutral-300 bg-white px-3 py-3 text-sm font-normal outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                />
              </label>

              <button
                type="submit"
                className="btn orange w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                disabled={!customer?.token}
              >
                Submit review
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

/* Cart Page */

function Cart() {
  const { cart, remove, update, total } = useContext(C);

  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <main className="min-h-screen bg-[#faf9f6] px-3 py-6 text-neutral-900 sm:px-5 sm:py-10 lg:px-8">
      <div className="mx-auto w-full max-w-[1300px]">
        <div className="mb-7 sm:mb-10">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-px w-7 bg-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-600 sm:text-xs">
              Take It Easy
            </span>
          </div>

          <Heading tag="আপনার পছন্দ" title="আপনার কার্ট" />

          {cart.length > 0 && (
            <p className="mt-3 text-sm text-neutral-500 sm:text-base">
              আপনার পছন্দের পণ্যগুলো এখানে রাখা হয়েছে।
            </p>
          )}
        </div>

        {!cart.length ? (
          <section className="rounded-3xl border border-neutral-200 bg-white px-5 py-14 text-center shadow-sm sm:px-8 sm:py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <ShoppingBag size={36} />
            </div>

            <h2 className="mt-6 text-xl font-extrabold sm:text-2xl">
              আপনার কার্ট এখনো খালি!
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-neutral-500 sm:text-base">
              পছন্দের পণ্যটি বেছে নিন এবং আপনার স্টাইলকে আরও সুন্দর করে তুলুন।
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              কেনাকাটা শুরু করুন
              <ArrowRight size={18} />
            </Link>
          </section>
        ) : (
          <>
            <div className="hidden lg:grid lg:grid-cols-12 lg:items-start lg:gap-8">
              <section className="col-span-8 space-y-3">
                <div className="mb-2 flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-6 py-4">
                  <h2 className="text-lg font-extrabold">আপনার পণ্যসমূহ</h2>
                  <span className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-bold text-orange-600">
                    {itemCount} টি আইটেম
                  </span>
                </div>

                {cart.map((i) => (
                  <article
                    key={i.key}
                    className="group flex items-center gap-5 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-orange-200 hover:shadow-md"
                  >
                    <Link
                      to="/products"
                      className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100"
                    >
                      <img
                        src={
                          i.image || "https://placehold.co/300x360?text=Product"
                        }
                        alt={i.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-extrabold text-neutral-900">
                        {i.title}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-500">
                        সাইজ: {i.size || "One size"} · একক মূল্য{" "}
                        <span className="font-semibold text-neutral-700">
                          {money(i.price)}
                        </span>
                      </p>
                    </div>

                    <div className="inline-flex h-10 shrink-0 items-center overflow-hidden rounded-lg border border-neutral-200">
                      <button
                        type="button"
                        onClick={() =>
                          update(i.key, Math.max(1, i.quantity - 1))
                        }
                        disabled={i.quantity <= 1}
                        aria-label="পরিমাণ কমান"
                        className="h-full w-10 text-lg font-medium transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        −
                      </button>
                      <span className="flex h-full min-w-11 items-center justify-center border-x border-neutral-200 px-2 text-sm font-bold tabular-nums">
                        {i.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => update(i.key, i.quantity + 1)}
                        aria-label="পরিমাণ বাড়ান"
                        className="h-full w-10 text-lg font-medium transition hover:bg-orange-50"
                      >
                        +
                      </button>
                    </div>

                    <div className="w-28 shrink-0 text-right">
                      <p className="text-lg font-black text-orange-600 tabular-nums">
                        {money(i.price * i.quantity)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(i.key)}
                      aria-label={`${i.title} সরান`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </article>
                ))}

                <Link
                  to="/products"
                  className="inline-flex min-h-11 items-center gap-2 px-1 text-sm font-bold text-neutral-600 transition hover:text-orange-600"
                >
                  <span aria-hidden="true">←</span>
                  আরও কেনাকাটা করুন
                </Link>
              </section>

              <aside className="col-span-4 lg:sticky lg:top-6">
                <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                  <div className="bg-neutral-950 px-6 py-5 text-white">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-orange-400">
                      Take It Easy
                    </p>
                    <h2 className="mt-2 text-xl font-extrabold">
                      Order Summary
                    </h2>
                    <p className="mt-1 text-xs text-neutral-400">
                      আপনার অর্ডারের সংক্ষিপ্ত বিবরণ
                    </p>
                  </div>

                  <div className="space-y-4 p-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">পণ্যের সংখ্যা</span>
                      <span className="font-bold">{itemCount} টি</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Subtotal</span>
                      <span className="font-bold tabular-nums">
                        {money(total)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500">Delivery charge</span>
                      <span className="text-xs font-medium text-neutral-400">
                        Checkout-এ হিসাব হবে
                      </span>
                    </div>

                    <div className="border-t border-dashed border-neutral-200 pt-4">
                      <div className="flex justify-between">
                        <span className="font-bold">মোট পণ্যমূল্য</span>
                        <span className="text-2xl font-black text-orange-600 tabular-nums">
                          {money(total)}
                        </span>
                      </div>
                      <p className="mt-2 text-[11px] leading-5 text-neutral-400">
                        ডেলিভারি চার্জ ও অন্যান্য খরচ Checkout-এ নিশ্চিত করুন।
                      </p>
                    </div>

                    <Link
                      to="/checkout"
                      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-orange-600"
                    >
                      Checkout <ArrowRight size={18} />
                    </Link>

                    <div className="flex items-center justify-center gap-2 pt-1 text-center text-[11px] text-neutral-500">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4 shrink-0 text-green-600"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m9 12 2 2 4-4"
                        />
                      </svg>
                      নিরাপদ ও সহজ অর্ডার প্রক্রিয়া
                    </div>
                  </div>
                </div>
              </aside>
            </div>

            <div className="lg:hidden">
              <div className="mb-4 flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3">
                <span className="text-sm font-bold text-neutral-800">
                  আপনার পণ্যসমূহ
                </span>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">
                  {itemCount} টি আইটেম
                </span>
              </div>

              <div className="space-y-3 pb-32">
                {cart.map((i) => (
                  <article
                    key={i.key}
                    className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm transition hover:border-orange-200 sm:p-4"
                  >
                    <div className="flex gap-3 sm:gap-4">
                      <Link
                        to="/products"
                        className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-28 sm:w-24"
                      >
                        <img
                          src={
                            i.image ||
                            "https://placehold.co/300x360?text=Product"
                          }
                          alt={i.title}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="break-words text-sm font-extrabold leading-6 text-neutral-900 sm:text-base">
                              {i.title}
                            </h3>
                            <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
                              সাইজ: {i.size || "One size"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => remove(i.key)}
                            aria-label={`${i.title} সরান`}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-3">
                          <div className="inline-flex h-9 items-center overflow-hidden rounded-lg border border-neutral-200">
                            <button
                              type="button"
                              onClick={() =>
                                update(i.key, Math.max(1, i.quantity - 1))
                              }
                              disabled={i.quantity <= 1}
                              aria-label="পরিমাণ কমান"
                              className="h-full w-9 text-lg font-medium transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              −
                            </button>
                            <span className="flex h-full min-w-9 items-center justify-center border-x border-neutral-200 px-2 text-sm font-bold tabular-nums">
                              {i.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => update(i.key, i.quantity + 1)}
                              aria-label="পরিমাণ বাড়ান"
                              className="h-full w-9 text-lg font-medium transition hover:bg-orange-50"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-[10px] text-neutral-400">
                              মোট মূল্য
                            </p>
                            <p className="text-base font-black text-orange-600 tabular-nums">
                              {money(i.price * i.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}

                <Link
                  to="/products"
                  className="inline-flex min-h-11 items-center gap-2 px-1 text-sm font-bold text-neutral-600 transition hover:text-orange-600"
                >
                  <span aria-hidden="true">←</span>
                  আরও কেনাকাটা করুন
                </Link>
              </div>

              <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-3 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur sm:px-5">
                <div className="mx-auto flex w-full max-w-[1300px] items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      মোট ({itemCount} আইটেম)
                    </p>
                    <p className="truncate text-lg font-black text-orange-600 tabular-nums">
                      {money(total)}
                    </p>
                  </div>

                  <Link
                    to="/checkout"
                    className="flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-orange-600"
                  >
                    Checkout
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

/* ============================================================ */
/* Checkout                                                     */
/* ============================================================ */
function Checkout() {
  const { cart, total, setCart } = useContext(C);
  const { customer } = useAuth();

  const [method, setMethod] = useState("cod");
  const [proof, setProof] = useState("txn");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [delivery, setDelivery] = useState(80);

  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadError, setUploadError] = useState("");

  const [f, setF] = useState({
    customerName: customer?.user?.name || "",
    phone: customer?.user?.phone || "",
    email: customer?.user?.email || "",
    address: "",
    city: "Dhaka",
    transactionId: "",
  });

  const change = (e) => setF({ ...f, [e.target.name]: e.target.value });
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const methods = [
    {
      v: "cod",
      l: "Cash on delivery",
      icon: "💵",
      activeBg: "bg-orange-50",
      activeBorder: "border-orange-500",
      activeText: "text-orange-700",
      dot: "bg-orange-500",
    },
    {
      v: "bkash",
      l: "bKash",
      img: bkashLogo,
      activeBg: "bg-pink-50",
      activeBorder: "border-pink-500",
      activeText: "text-pink-700",
      dot: "bg-pink-500",
    },
    {
      v: "nagad",
      l: "Nagad",
      img: nagadLogo,
      activeBg: "bg-amber-50",
      activeBorder: "border-amber-700",
      activeText: "text-amber-800",
      dot: "bg-amber-700",
    },
    {
      v: "rocket",
      l: "Rocket",
      img: rocketLogo,
      activeBg: "bg-purple-50",
      activeBorder: "border-purple-500",
      activeText: "text-purple-700",
      dot: "bg-purple-500",
    },
  ];

  const activeMethod = methods.find((m) => m.v === method);

  async function handleFileUpload(selectedFile) {
    setFile(selectedFile || null);
    setUploadedUrl("");
    setUploadError("");

    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5 MB.");
      return;
    }

    setUploading(true);

    try {
      const imageData = await fileData(selectedFile, 500, 0.7);

      const response = await api("/public/payment-proof", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ imageData }),
      });

      setUploadedUrl(response.imageUrl);
    } catch (err) {
      setUploadError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);

    try {
      let paymentScreenshot = "";

      if (method !== "cod" && proof === "image") {
        if (!file) throw new Error("Choose a screenshot.");
        if (uploading) throw new Error("Please wait for the upload to finish.");
        if (!uploadedUrl)
          throw new Error(
            uploadError || "Image upload failed. Please try again.",
          );

        paymentScreenshot = uploadedUrl;
      }

      if (method !== "cod" && proof === "txn" && !f.transactionId.trim()) {
        throw new Error("Enter transaction ID.");
      }

      const r = await api("/orders", {
        method: "POST",
        auth: false,
        body: JSON.stringify({
          ...f,
          items: cart.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            size: i.size,
          })),
          paymentMethod: method,
          deliveryCharge: delivery,
          transactionId:
            method !== "cod" && proof === "txn" ? f.transactionId : "",
          paymentScreenshot,
          token: customer?.token || "",
        }),
      });

      setCart([]);

      await Swal.fire({
        icon: "success",
        title: "Order placed!",
        html: `Order number <b>${r.orderNumber}</b><br/>Total <b>${money(r.total)}</b>`,
        confirmButtonColor: "#F54900",
      });

      location.href = `/track-order?order=${r.orderNumber}&phone=${encodeURIComponent(
        f.phone,
      )}`;
    } catch (e) {
      msg(e.message, "error");
    } finally {
      setBusy(false);
    }
  }

  const inputCls =
    "min-h-12 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3.5 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100";

  const labelCls = "mb-1.5 block text-xs font-bold text-neutral-700";

  if (!cart.length) {
    return (
      <main className="min-h-screen bg-[#faf9f6] px-3 py-6 sm:px-5 sm:py-10 lg:px-8">
        <div className="mx-auto w-full max-w-[1100px]">
          <Heading tag="ALMOST YOURS" title="Checkout." />
          <section className="mt-6 rounded-2xl border border-neutral-200 bg-white px-5 py-14 text-center shadow-sm sm:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <ShoppingBag size={28} />
            </div>
            <h2 className="mt-5 text-lg font-extrabold sm:text-xl">
              আপনার কার্ট খালি!
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">
              Checkout করার আগে কার্টে পণ্য যোগ করুন।
            </p>
            <Link
              to="/products"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              কেনাকাটা করুন <ArrowRight size={16} />
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const renderMethodsDesktop = () => (
    <div className="grid grid-cols-4 gap-2">
      {methods.map((m) => {
        const active = method === m.v;
        return (
          <label
            key={m.v}
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg border-2 px-2 py-2.5 transition ${
              active
                ? `${m.activeBorder} ${m.activeBg}`
                : "border-neutral-200 bg-white hover:border-neutral-300"
            }`}
          >
            <input
              type="radio"
              checked={active}
              onChange={() => {
                setMethod(m.v);
                setUploadError("");
              }}
              className="sr-only"
            />
            <span className="flex h-6 w-8 shrink-0 items-center justify-center">
              {m.img ? (
                <img
                  src={m.img}
                  alt={m.l}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-sm">{m.icon}</span>
              )}
            </span>
            <span
              className={`min-w-0 flex-1 truncate text-xs font-bold ${
                active ? m.activeText : "text-neutral-800"
              }`}
            >
              {m.l}
            </span>
          </label>
        );
      })}
    </div>
  );

  const renderMethodsMobile = () => (
    <div className="flex flex-col gap-2.5">
      {methods.map((m) => {
        const active = method === m.v;
        return (
          <label
            key={m.v}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border-2 px-3 py-3.5 transition ${
              active
                ? `${m.activeBorder} ${m.activeBg}`
                : "border-neutral-200 bg-white hover:border-neutral-300"
            }`}
          >
            <input
              type="radio"
              checked={active}
              onChange={() => {
                setMethod(m.v);
                setUploadError("");
              }}
              className="sr-only"
            />
            <span className="flex h-7 w-10 shrink-0 items-center justify-center">
              {m.img ? (
                <img
                  src={m.img}
                  alt={m.l}
                  className="h-full w-full object-contain"
                />
              ) : (
                <span className="text-xl">{m.icon}</span>
              )}
            </span>
            <span
              className={`min-w-0 flex-1 text-sm font-bold ${
                active ? m.activeText : "text-neutral-800"
              }`}
            >
              {m.l}
            </span>
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                active
                  ? `${m.activeBorder} ${m.dot}`
                  : "border-neutral-300 bg-transparent"
              }`}
            >
              {active && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  className="h-3 w-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m5 13 4 4L19 7"
                  />
                </svg>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );

  const paymentBox = method !== "cod" && (
    <div
      className={`mt-3 rounded-lg border p-3 ${
        activeMethod?.v === "bkash"
          ? "border-pink-200 bg-pink-50/60"
          : activeMethod?.v === "nagad"
            ? "border-amber-200 bg-amber-50/60"
            : "border-purple-200 bg-purple-50/60"
      }`}
    >
      <p className="text-xs leading-5 text-neutral-700">
        <b>{method.toUpperCase()}</b> নম্বরে{" "}
        <b
          className={
            activeMethod?.v === "bkash"
              ? "text-pink-600"
              : activeMethod?.v === "nagad"
                ? "text-amber-700"
                : "text-purple-600"
          }
        >
          01933200699
        </b>{" "}
        সেন্ড মানি করুন, তারপর ট্রানজেকশন আইডি বা স্ক্রিনশট দিন।
      </p>
      <div className="mt-2.5 flex gap-2">
        {[
          ["txn", "ট্রানজেকশন আইডি"],
          ["image", "স্ক্রিনশট"],
        ].map(([v, l]) => (
          <button
            key={v}
            type="button"
            onClick={() => {
              setProof(v);
              if (v === "txn") {
                setFile(null);
                setUploadedUrl("");
                setUploadError("");
              }
            }}
            className={`flex-1 rounded-md border bg-white px-2 py-1.5 text-xs font-bold transition ${
              proof === v
                ? activeMethod?.v === "bkash"
                  ? "border-pink-500 text-pink-600"
                  : activeMethod?.v === "nagad"
                    ? "border-amber-700 text-amber-800"
                    : "border-purple-500 text-purple-600"
                : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="mt-2.5">
        {proof === "txn" ? (
          <input
            name="transactionId"
            value={f.transactionId}
            onChange={change}
            placeholder="যেমন: 8N7A2B4C9D"
            required
            className={inputCls}
          />
        ) : (
          <>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files?.[0])}
                disabled={uploading}
                required={!uploadedUrl}
                className="block w-full cursor-pointer rounded-lg border border-neutral-200 bg-white px-2.5 py-2 text-xs file:mr-2 file:rounded file:border-0 file:bg-neutral-900 file:px-3 file:py-1.5 file:text-[11px] file:font-bold file:text-white hover:file:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {uploading && (
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2.5">
                <span className="tie-inline-loader dark" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-orange-800">
                    Uploading screenshot...
                  </p>
                  <p className="text-[10px] text-orange-600">
                    Please wait, this may take a moment.
                  </p>
                </div>
              </div>
            )}

            {!uploading && uploadedUrl && (
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-bold text-emerald-800">
                    Screenshot uploaded successfully
                  </p>
                  <a
                    href={uploadedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-semibold text-emerald-600 underline"
                  >
                    View image ↗
                  </a>
                </div>
              </div>
            )}

            {!uploading && uploadError && (
              <div className="mt-2 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                <AlertCircle
                  size={14}
                  className="mt-0.5 shrink-0 text-red-600"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-red-700">
                    Upload failed
                  </p>
                  <p className="text-[10px] text-red-600">{uploadError}</p>
                  <button
                    type="button"
                    onClick={() => {
                      if (file) handleFileUpload(file);
                    }}
                    className="mt-1 text-[10px] font-bold text-red-700 underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#faf9f6] px-3 py-6 pb-28 text-neutral-900 sm:px-5 sm:py-10 sm:pb-28 lg:px-8 lg:pb-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <Heading tag="ALMOST YOURS" title="Checkout." />

        <form onSubmit={submit} className="mt-6">
          <div className="flex flex-col gap-5 lg:grid lg:grid-cols-12 lg:items-start lg:gap-6">
            <div className="w-full min-w-0 space-y-4 lg:order-1 lg:col-span-7">
              <div className="hidden lg:block">
                <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-extrabold text-white">
                      1
                    </span>
                    <h2 className="text-base font-extrabold">ডেলিভারি তথ্য</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block min-w-0 col-span-2">
                      <span className={labelCls}>পূর্ণ নাম</span>
                      <input
                        name="customerName"
                        value={f.customerName}
                        onChange={change}
                        placeholder="আপনার পূর্ণ নাম লিখুন"
                        required
                        className={inputCls}
                      />
                    </label>
                    <label className="block min-w-0">
                      <span className={labelCls}>ফোন নম্বর</span>
                      <input
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        value={f.phone}
                        onChange={change}
                        placeholder="01XXXXXXXXX"
                        required
                        className={inputCls}
                      />
                    </label>
                    <label className="block min-w-0">
                      <span className={labelCls}>
                        ইমেইল{" "}
                        <span className="font-normal text-neutral-400">
                          (ঐচ্ছিক)
                        </span>
                      </span>
                      <input
                        name="email"
                        type="email"
                        value={f.email}
                        onChange={change}
                        placeholder="you@example.com"
                        className={inputCls}
                      />
                    </label>
                    <label className="block min-w-0">
                      <span className={labelCls}>শহর / এলাকা</span>
                      <input
                        name="city"
                        value={f.city}
                        onChange={change}
                        placeholder="যেমন: ঢাকা, চট্টগ্রাম"
                        required
                        className={inputCls}
                      />
                    </label>
                    <label className="block min-w-0">
                      <span className={labelCls}>ডেলিভারি এরিয়া</span>
                      <select
                        value={delivery}
                        onChange={(e) => setDelivery(Number(e.target.value))}
                        className={inputCls}
                      >
                        <option value="80">ঢাকার ভিতরে — ৳80</option>
                        <option value="130">ঢাকার বাইরে — ৳130</option>
                      </select>
                    </label>
                    <label className="block min-w-0 col-span-2">
                      <span className={labelCls}>সম্পূর্ণ ঠিকানা</span>
                      <textarea
                        name="address"
                        value={f.address}
                        onChange={change}
                        placeholder="বাসা/রোড/এলাকা বিস্তারিত লিখুন"
                        required
                        rows={2}
                        className={inputCls + " resize-y"}
                      />
                    </label>
                  </div>
                </section>

                <section className="mt-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-extrabold text-white">
                      2
                    </span>
                    <h2 className="text-base font-extrabold">পেমেন্ট পদ্ধতি</h2>
                  </div>
                  {renderMethodsDesktop()}
                  {paymentBox}
                </section>
              </div>

              <div className="space-y-4 lg:hidden">
                <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-extrabold text-white">
                      1
                    </span>
                    <h2 className="text-sm font-extrabold sm:text-base">
                      ডেলিভারি তথ্য
                    </h2>
                  </div>
                  <div className="space-y-3">
                    <label className="block min-w-0">
                      <span className={labelCls}>পূর্ণ নাম</span>
                      <input
                        name="customerName"
                        value={f.customerName}
                        onChange={change}
                        placeholder="আপনার পূর্ণ নাম লিখুন"
                        required
                        className={inputCls}
                      />
                    </label>
                    <label className="block min-w-0">
                      <span className={labelCls}>ফোন নম্বর</span>
                      <input
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        value={f.phone}
                        onChange={change}
                        placeholder="01XXXXXXXXX"
                        required
                        className={inputCls}
                      />
                    </label>
                    <label className="block min-w-0">
                      <span className={labelCls}>
                        ইমেইল{" "}
                        <span className="font-normal text-neutral-400">
                          (ঐচ্ছিক)
                        </span>
                      </span>
                      <input
                        name="email"
                        type="email"
                        value={f.email}
                        onChange={change}
                        placeholder="you@example.com"
                        className={inputCls}
                      />
                    </label>
                    <label className="block min-w-0">
                      <span className={labelCls}>শহর / এলাকা</span>
                      <input
                        name="city"
                        value={f.city}
                        onChange={change}
                        placeholder="যেমন: ঢাকা, চট্টগ্রাম"
                        required
                        className={inputCls}
                      />
                    </label>
                    <label className="block min-w-0">
                      <span className={labelCls}>ডেলিভারি এরিয়া</span>
                      <select
                        value={delivery}
                        onChange={(e) => setDelivery(Number(e.target.value))}
                        className={inputCls}
                      >
                        <option value="80">ঢাকার ভিতরে — ৳80</option>
                        <option value="130">ঢাকার বাইরে — ৳130</option>
                      </select>
                    </label>
                    <label className="block min-w-0">
                      <span className={labelCls}>সম্পূর্ণ ঠিকানা</span>
                      <textarea
                        name="address"
                        value={f.address}
                        onChange={change}
                        placeholder="বাসা/রোড/এলাকা বিস্তারিত লিখুন"
                        required
                        rows={3}
                        className={inputCls + " resize-y"}
                      />
                    </label>
                  </div>
                </section>

                <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xs font-extrabold text-white">
                      2
                    </span>
                    <h2 className="text-sm font-extrabold sm:text-base">
                      পেমেন্ট পদ্ধতি
                    </h2>
                  </div>
                  {renderMethodsMobile()}
                  {paymentBox}
                </section>
              </div>
            </div>

            <aside className="w-full min-w-0 lg:order-2 lg:col-span-5 lg:sticky lg:top-6">
              <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
                <div className="flex items-center justify-between bg-neutral-950 px-4 py-3 text-white sm:px-5">
                  <h2 className="text-sm font-extrabold sm:text-base">
                    অর্ডার সারাংশ
                  </h2>
                  <span className="rounded-full bg-orange-500/20 px-2.5 py-1 text-[10px] font-bold text-orange-400">
                    {itemCount} আইটেম
                  </span>
                </div>
                <div className="p-4 sm:p-5">
                  <ul className="max-h-56 divide-y divide-neutral-100 overflow-y-auto">
                    {cart.map((i) => (
                      <li
                        key={i.key}
                        className="flex items-start justify-between gap-2 py-2.5 first:pt-0"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-neutral-900 sm:text-sm">
                            {i.title}
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            {i.quantity} × {money(i.price)}
                            {i.size ? ` · ${i.size}` : ""}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-bold tabular-nums sm:text-sm">
                          {money(i.price * i.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 space-y-1.5 border-t border-dashed border-neutral-200 pt-3 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">সাবটোটাল</span>
                      <span className="font-semibold tabular-nums">
                        {money(total)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">ডেলিভারি</span>
                      <span className="font-semibold tabular-nums">
                        {money(delivery)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-neutral-200 pt-2">
                      <span className="text-sm font-extrabold">সর্বমোট</span>
                      <span className="text-lg font-black text-orange-600 tabular-nums sm:text-xl">
                        {money(total + delivery)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={busy || uploading}
                    className="mt-4 hidden min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
                  >
                    {uploading ? (
                      <>
                        <InlineLoader /> Uploading...
                      </>
                    ) : busy ? (
                      <>
                        <InlineLoader /> Placing...
                      </>
                    ) : (
                      <>
                        Place order <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </aside>
          </div>

          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-3 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur sm:px-5 lg:hidden">
            <div
              className="mx-auto flex w-full max-w-[1100px] items-center gap-3"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            >
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  সর্বমোট ({itemCount})
                </p>
                <p className="truncate text-base font-black text-orange-600 tabular-nums">
                  {money(total + delivery)}
                </p>
              </div>
              <button
                type="submit"
                disabled={busy || uploading}
                className="flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? (
                  <>
                    <InlineLoader /> Uploading...
                  </>
                ) : busy ? (
                  <>
                    <InlineLoader /> Placing...
                  </>
                ) : (
                  <>
                    Place order <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

/* Track Order */

function Track() {
  const params = new URLSearchParams(location.search);

  const [orderNumber, setOrderNumber] = useState(params.get("order") || "");
  const [phone, setPhone] = useState(params.get("phone") || "");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const result = await api("/orders/track", {
        method: "POST",
        auth: false,
        body: JSON.stringify({
          orderNumber: orderNumber.trim(),
          phone: phone.trim(),
        }),
      });

      setOrder(result);
    } catch (e) {
      setError(e.message || "Order not found. Please check your details.");
    } finally {
      setLoading(false);
    }
  }

  const statusColors = {
    pending: "bg-amber-100 text-amber-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    in_transit: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const status = String(order?.status || "");
  const paymentStatus = String(order?.paymentStatus || "");

  const statusLabel = status.replaceAll("_", " ");
  const paymentLabel = paymentStatus.replaceAll("_", " ");

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-7 text-center">
          <p className="text-sm font-bold tracking-wide text-orange-600">
            TAKE IT EASY
          </p>

          <h1 className="mt-2 text-3xl font-black text-neutral-900 sm:text-4xl">
            Track Your Order
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-500 sm:text-base">
            আপনার অর্ডারের বর্তমান অবস্থা জানতে নিচের তথ্যগুলো দিন।
          </p>
        </div>

        <form
          onSubmit={submit}
          className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-neutral-800">
                Order Number
              </span>

              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="আপনার Order Number লিখুন"
                autoComplete="off"
                required
                className="min-h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-neutral-800">
                Phone Number
              </span>

              <input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="যে নম্বর দিয়ে অর্ডার করেছেন"
                autoComplete="tel"
                required
                className="min-h-12 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-100"
              />
            </label>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm leading-6 text-red-600"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <InlineLoader /> Searching...
              </>
            ) : (
              "Track Order"
            )}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-neutral-400">
            সঠিক Order Number ও Phone Number ব্যবহার করুন।
          </p>
        </form>

        {order && (
          <section
            aria-live="polite"
            className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 p-5 sm:p-6">
              <div className="min-w-0">
                <p className="text-xs text-neutral-500">Order Number</p>
                <h2 className="mt-1 break-all text-lg font-extrabold text-neutral-900">
                  {order.orderNumber}
                </h2>
              </div>

              <span
                className={`rounded-full px-3 py-2 text-xs font-bold capitalize ${
                  statusColors[status.toLowerCase()] ||
                  "bg-neutral-100 text-neutral-700"
                }`}
              >
                {statusLabel || "Unavailable"}
              </span>
            </div>

            <div className="p-5 sm:p-6">
              <h3 className="mb-4 text-base font-extrabold">Order Details</h3>

              <div className="divide-y divide-neutral-100">
                {order.items.map((item, index) => (
                  <div
                    key={item.key || `${item.title}-${index}`}
                    className="flex items-start justify-between gap-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-neutral-800">
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        Qty: {item.quantity}
                        {item.size ? ` · Size: ${item.size}` : ""}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-bold">
                      {money(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 border-t border-neutral-200 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-neutral-500">
                    Payment Status
                  </span>

                  <span className="text-sm font-semibold capitalize">
                    {paymentLabel || "Unavailable"}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-black text-orange-600">
                    {money(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        <p className="mt-6 text-center text-sm text-neutral-500">
          সাহায্য প্রয়োজন?{" "}
          <a
            href="https://wa.me/8801933200699"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-orange-600 underline decoration-orange-200 underline-offset-4 hover:text-orange-700"
          >
            WhatsApp-এ যোগাযোগ করুন
          </a>
        </p>
      </div>
    </main>
  );
}

/* Contact  page */

function Contact() {
  const supportOptions = [
    {
      icon: "📦",
      title: "Order & Delivery",
      description:
        "অর্ডারের অবস্থা, ডেলিভারি বা অর্ডার সংক্রান্ত যেকোনো সাহায্য নাও।",
      message: "Hi Take It Easy! I need help with my order and delivery.",
    },
    {
      icon: "👕",
      title: "Product Information",
      description:
        "সাইজ, ফিটিং, প্রোডাক্টের ডিটেইলস বা কালেকশন সম্পর্কে জানতে চাও?",
      message: "Hi Take It Easy! I want to know more about your products.",
    },
    {
      icon: "💳",
      title: "Payment Support",
      description:
        "পেমেন্ট, Cash on Delivery বা অর্ডার কনফার্মেশন নিয়ে সাহায্য নাও।",
      message: "Hi Take It Easy! I need help with payment.",
    },
  ];

  const openWhatsApp = (message) => {
    window.open(
      `https://wa.me/8801933200699?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <main className="mx-auto w-full min-w-0 max-w-[1300px] box-border px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <section className="relative isolate overflow-hidden rounded-3xl bg-neutral-950 px-5 py-12 text-white sm:px-8 sm:py-16 md:px-10 md:py-20 lg:px-14 lg:py-24">
        <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl sm:h-96 sm:w-96" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 -z-10 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl sm:h-96 sm:w-96" />

        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="relative z-10 w-full max-w-3xl">
          <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-[10px] font-extrabold tracking-[0.15em] text-orange-400 sm:text-xs sm:tracking-[0.2em]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-orange-400 animate-pulse" />
            TAKE IT EASY · CUSTOMER CARE
          </span>

          <h1 className="mt-6 break-words text-[clamp(2.2rem,8vw,4.5rem)] font-black leading-[1.1] tracking-tight sm:mt-8">
            Need a Help?
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-200">
              We're here for you.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-400 sm:mt-6 sm:text-base sm:leading-8">
            অর্ডার, ডেলিভারি কিংবা পছন্দের প্রোডাক্ট নিয়ে কোনো প্রশ্ন আছে? Take
            It Easy টিম তোমাকে সাহায্য করতে প্রস্তুত।
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap sm:mt-10">
            <button
              type="button"
              onClick={() =>
                openWhatsApp(
                  "Hi Take It Easy! I need assistance with my order.",
                )
              }
              className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-neutral-950 min-[480px]:w-auto"
            >
              Chat on WhatsApp
              <span
                aria-hidden="true"
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                ↗
              </span>
            </button>

            <a
              href="tel:01933200699"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-orange-400/50 hover:bg-white/10 min-[480px]:w-auto"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 5a2 2 0 0 1 2-2h2.3a1 1 0 0 1 .95.68l1.1 3.3a1 1 0 0 1-.48 1.2l-1.7.94a11 11 0 0 0 4.7 4.7l.94-1.7a1 1 0 0 1 1.2-.48l3.3 1.1a1 1 0 0 1 .69.95V16a2 2 0 0 1-2 2h-1C9.93 18 4 12.07 4 5.9V5Z"
                />
              </svg>
              01933200699
            </a>
          </div>
        </div>

        <div className="relative z-10 mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:gap-x-6 min-[420px]:gap-y-3 sm:mt-16 sm:pt-8">
          {["Friendly Support", "Easy Ordering", "Cash on Delivery"].map(
            (item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-xs font-medium text-neutral-300 sm:text-sm"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-400/20 text-[10px] text-orange-400">
                  ✓
                </span>
                {item}
              </div>
            ),
          )}
        </div>
      </section>

      <section className="mt-12 min-w-0 sm:mt-16 lg:mt-20">
        <div className="mb-8 flex min-w-0 flex-col gap-2 sm:mb-10">
          <span className="text-[10px] font-extrabold tracking-[0.2em] text-orange-500 sm:text-xs">
            HOW CAN WE HELP?
          </span>

          <h2 className="break-words text-2xl font-black leading-tight tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">
            What do you need help with?
          </h2>

          <p className="max-w-xl text-sm leading-7 text-neutral-500 sm:text-base">
            তোমার প্রয়োজন অনুযায়ী একটি অপশন বেছে নাও। সরাসরি WhatsApp-এ আমাদের
            সাথে কথা বলতে পারবে।
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {supportOptions.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => openWhatsApp(item.message)}
              className="group relative flex h-full min-w-0 flex-col items-start overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-950/5 focus:outline-none focus:ring-2 focus:ring-orange-400 sm:p-7"
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-50/0 to-orange-50/0 transition-colors duration-300 group-hover:from-orange-50/50 group-hover:to-transparent" />

              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-2xl transition-colors group-hover:bg-orange-100 sm:h-14 sm:w-14 sm:rounded-2xl">
                {item.icon}
              </span>

              <h3 className="mt-5 break-words text-lg font-extrabold text-neutral-900 sm:mt-6">
                {item.title}
              </h3>

              <p className="mt-2 w-full break-words text-sm leading-7 text-neutral-500">
                {item.description}
              </p>

              <span className="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-bold text-orange-600 transition-all group-hover:gap-3">
                Get help
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                >
                  ↗
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

/* Customer Login */
function Login() {
  const { customerLogin } = useAuth();
  const [f, setF] = useState({ email: "", password: "" });

  async function submit(e) {
    e.preventDefault();

    try {
      await customerLogin(f);
      location.href = "/profile";
    } catch (e) {
      msg(e.message, "error");
    }
  }

  return (
    <main className="wrap page narrow">
      <Heading tag="WELCOME BACK" title="Log in." />

      <form className="box stack" onSubmit={submit}>
        <label>
          Email
          <input
            type="email"
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={f.password}
            onChange={(e) => setF({ ...f, password: e.target.value })}
            required
          />
        </label>

        <button className="btn orange wide">Log in</button>

        <p>
          New here?{" "}
          <Link
            className="!text-orange-600 font-bold hover:!text-orange-700"
            to="/register"
          >
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}

/* Customer Registration */
function Register() {
  const { registerCustomer } = useAuth();

  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  async function submit(e) {
    e.preventDefault();

    try {
      await registerCustomer(f);
      location.href = "/profile";
    } catch (e) {
      msg(e.message, "error");
    }
  }

  return (
    <main className="wrap page narrow">
      <Heading tag="JOIN THE EASY SIDE" title="Create account." />

      <form className="box stack" onSubmit={submit}>
        {["name", "email", "phone", "password"].map((k) => (
          <label key={k}>
            {k === "name" ? "Full name" : k[0].toUpperCase() + k.slice(1)}

            <input
              type={
                k === "email" ? "email" : k === "password" ? "password" : "text"
              }
              minLength={k === "password" ? 8 : undefined}
              required={k !== "phone"}
              value={f[k]}
              onChange={(e) => setF({ ...f, [k]: e.target.value })}
            />
          </label>
        ))}

        <button className="btn orange wide">Create account</button>

        <p>
          Already registered?{" "}
          <Link
            className="text-orange-500! font-bold hover:text-orange-900!"
            to="/login"
          >
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}

/* Customer Profile */
function Profile() {
  const { customer, updateProfile, logoutCustomer } = useAuth();

  const [f, setF] = useState({
    name: customer?.user?.name || "",
    email: customer?.user?.email || "",
    phone: customer?.user?.phone || "",
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    if (!customer?.token) {
      setLoadingOrders(false);
      return;
    }

    let active = true;

    api("/orders/mine")
      .then((data) => {
        if (active) {
          setOrders(Array.isArray(data) ? data : []);
          setOrderError("");
        }
      })
      .catch((error) => {
        if (active) {
          setOrderError(error.message || "Unable to load your orders.");
        }
      })
      .finally(() => {
        if (active) setLoadingOrders(false);
      });

    return () => {
      active = false;
    };
  }, [customer?.token]);

  if (!customer?.token) {
    return <Navigate to="/login" replace />;
  }

  async function save(e) {
    e.preventDefault();

    try {
      await updateProfile(f);
      msg("Profile updated successfully.");
    } catch (error) {
      msg(error.message, "error");
    }
  }

  const statusStyles = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    confirmed: "bg-blue-50 text-blue-700 ring-blue-200",
    processing: "bg-violet-50 text-violet-700 ring-violet-200",
    shipped: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    cancelled: "bg-red-50 text-red-700 ring-red-200",
  };

  const paymentLabels = {
    cod: "Cash on Delivery",
    bkash: "bKash",
    nagad: "Nagad",
    rocket: "Rocket",
  };

  return (
    <main className="wrap page tie-account-page">
      <Heading
        tag="YOUR ACCOUNT"
        title="My account."
        desc="Manage your personal information and track your purchases."
      />

      <div className="tie-account-layout">
        <aside className="tie-account-sidebar">
          <form className="box stack tie-profile-form" onSubmit={save}>
            <div className="tie-profile-heading">
              <div className="tie-profile-avatar">
                <UserRound size={23} />
              </div>

              <div>
                <h2>Account details</h2>
                <p>Manage your profile</p>
              </div>
            </div>

            <label>
              Full name
              <input
                type="text"
                value={f.name}
                onChange={(e) => setF({ ...f, name: e.target.value })}
                required
              />
            </label>

            <label>
              Email address
              <input
                type="email"
                value={f.email}
                onChange={(e) => setF({ ...f, email: e.target.value })}
                required
              />
            </label>

            <label>
              Phone number
              <input
                type="tel"
                value={f.phone}
                onChange={(e) => setF({ ...f, phone: e.target.value })}
              />
            </label>

            <button type="submit" className="btn orange wide">
              Save changes
            </button>

            <button
              type="button"
              className="btn outline wide"
              onClick={logoutCustomer}
            >
              <LogOut size={16} />
              Log out
            </button>
          </form>
        </aside>

        <section className="tie-orders-section">
          <div className="tie-orders-heading">
            <div>
              <span className="eyebrow">YOUR PURCHASES</span>
              <h2>My orders</h2>
              <p>Your orders, products and delivery information.</p>
            </div>

            <span className="tie-order-count">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </span>
          </div>

          {loadingOrders ? (
            <Loader text="Loading your orders" />
          ) : orderError ? (
            <div className="tie-orders-message">
              <p className="text-red-600">{orderError}</p>

              <button
                type="button"
                className="btn outline"
                onClick={() => {
                  setLoadingOrders(true);
                  setOrderError("");

                  api("/orders/mine")
                    .then((data) => {
                      setOrders(Array.isArray(data) ? data : []);
                    })
                    .catch((error) => {
                      setOrderError(error.message || "Unable to load orders.");
                    })
                    .finally(() => setLoadingOrders(false));
                }}
              >
                Try again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="tie-orders-message">
              <ShoppingBag size={36} />

              <h3>No orders yet</h3>

              <p>
                Your purchases will appear here after you place an order while
                logged in.
              </p>

              <Link to="/products" className="btn orange">
                Shop now <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            <div className="tie-orders-grid">
              {orders.map((order) => {
                const status = String(order.status || "pending").toLowerCase();

                return (
                  <article className="tie-order-card" key={order._id}>
                    <div className="tie-order-card-header">
                      <div className="tie-order-number">
                        <span>ORDER NUMBER</span>

                        <h3>{order.orderNumber || order._id}</h3>

                        {order.createdAt && (
                          <p>
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        )}
                      </div>

                      <span
                        className={`tie-status ${
                          statusStyles[status] ||
                          "bg-stone-100 text-stone-700 ring-stone-200"
                        }`}
                      >
                        {status.replaceAll("_", " ")}
                      </span>
                    </div>

                    <div className="tie-order-items">
                      {(order.items || []).map((item, index) => (
                        <div
                          className="tie-order-item"
                          key={`${order._id}-${index}`}
                        >
                          <div className="tie-order-image">
                            <img
                              src={
                                item.image ||
                                "https://placehold.co/300x375?text=Take+It+Easy"
                              }
                              alt={item.title || "Ordered product"}
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src =
                                  "https://placehold.co/300x375?text=Product";
                              }}
                            />
                          </div>

                          <div className="tie-order-product-info">
                            <h4>{item.title || "Product"}</h4>

                            <p>Quantity: {item.quantity || 1}</p>

                            {item.size && <p>Size: {item.size}</p>}

                            <span>{money(item.price)} each</span>
                          </div>

                          <strong className="tie-item-total">
                            {money(
                              Number(item.price || 0) *
                                Number(item.quantity || 1),
                            )}
                          </strong>
                        </div>
                      ))}
                    </div>

                    <div className="tie-order-summary">
                      <div>
                        <span>Subtotal</span>
                        <span>{money(order.subtotal)}</span>
                      </div>

                      <div>
                        <span>Delivery charge</span>
                        <span>{money(order.deliveryCharge)}</span>
                      </div>

                      <div className="tie-total-row">
                        <strong>Total</strong>
                        <strong>{money(order.total)}</strong>
                      </div>
                    </div>

                    <div className="tie-order-bottom">
                      <div className="tie-payment">
                        <span>PAYMENT METHOD</span>

                        <strong>
                          {paymentLabels[order.paymentMethod] ||
                            order.paymentMethod ||
                            "Not specified"}
                        </strong>
                      </div>

                      <Link
                        className="tie-track-button"
                        to={`/track-order?order=${encodeURIComponent(
                          order.orderNumber || "",
                        )}&phone=${encodeURIComponent(order.phone || "")}`}
                      >
                        Track order <ArrowRight size={15} />
                      </Link>
                    </div>

                    {(order.address || order.city) && (
                      <div className="tie-delivery-address">
                        <span>DELIVERY ADDRESS</span>

                        <p>
                          {order.address}
                          {order.city ? `, ${order.city}` : ""}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* ============================================================ */
/* Admin Login                                                  */
/* ============================================================ */
function AdminLogin() {
  const { adminToken, loginAdmin } = useAuth();
  const [f, setF] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (adminToken) {
    return <Navigate to="/admin" />;
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      await loginAdmin(f);
      location.href = "/admin";
    } catch (e) {
      const message =
        e?.message && !/invalid|credential|login/i.test(e.message)
          ? e.message
          : "Invalid admin credentials. Please check your email and password.";

      setError(message);

      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: message,
        confirmButtonColor: "#F54900",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-login">
      <form className="box stack" onSubmit={submit}>
        <Link className="logo" to="/">
          take it easy
          <small>ADMIN PANEL</small>
        </Link>

        <h1>Admin login.</h1>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <label>
          Email
          <input
            type="email"
            value={f.email}
            onChange={(e) => {
              setF({ ...f, email: e.target.value });
              setError("");
            }}
            autoComplete="username"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={f.password}
            onChange={(e) => {
              setF({ ...f, password: e.target.value });
              setError("");
            }}
            autoComplete="current-password"
          />
        </label>

        <button className="btn orange wide" disabled={busy}>
          {busy ? (
            <>
              <InlineLoader /> Logging in...
            </>
          ) : (
            "Log in"
          )}
        </button>
      </form>
    </main>
  );
}

/* ============================================================ */
/* Admin Navigation — with New Orders badge                     */
/* ============================================================ */
function AdminNav() {
  const { logoutAdmin } = useAuth();
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchNewCount() {
      try {
        const data = await api("/admin/orders/new");
        if (!cancelled) setNewCount(Array.isArray(data) ? data.length : 0);
      } catch {
        // silent fail
      }
    }

    fetchNewCount();
    const id = setInterval(fetchNewCount, 30000);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <aside className="adminnav">
      <Link className="logo" to="/">
        take it easy
        <small>ADMIN PANEL</small>
      </Link>

      <Link to="/admin">Overview</Link>

      <Link to="/admin/new-orders" className="relative">
        <span className="flex items-center gap-2">
          <Bell size={14} />
          New Orders
          {newCount > 0 && (
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-black text-white">
              {newCount > 99 ? "99+" : newCount}
            </span>
          )}
        </span>
      </Link>

      <Link to="/admin/products">Products</Link>
      <Link to="/admin/banners">Banners</Link>
      <Link to="/admin/orders">Orders</Link>

      <Link to="/" target="_blank">
        View store ↗
      </Link>

      <button className="btn dark wide" onClick={logoutAdmin}>
        Log out
      </button>
    </aside>
  );
}

function AdminLayout() {
  return (
    <div className="adminlayout">
      <AdminNav />
      <Outlet />
    </div>
  );
}

/* Admin Dashboard */
function Dashboard() {
  const [counts, setCounts] = useState([0, 0, 0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [products, banners, orders] = await Promise.all([
          api("/admin/products"),
          api("/admin/banners"),
          api("/admin/orders"),
        ]);

        if (cancelled) return;

        setCounts([
          Array.isArray(products) ? products.length : 0,
          Array.isArray(banners) ? banners.length : 0,
          Array.isArray(orders) ? orders.length : 0,
        ]);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load dashboard data");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="adminmain">
      <Heading
        tag="STORE CONTROL"
        title="Overview."
        desc="Your store, in one place."
      />

      {error && (
        <div className="error">
          {error}

          <button
            type="button"
            className="btn outline"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      )}

      {loading ? (
        <Loader text="Loading dashboard" />
      ) : (
        <div className="stats">
          {["Products", "Banners", "Orders"].map((name, index) => (
            <Link
              className="stat"
              to={["/admin/products", "/admin/banners", "/admin/orders"][index]}
              key={name}
            >
              {name}
              <strong>{counts[index]}</strong>
            </Link>
          ))}
        </div>
      )}

      <p>
        Use the navigation to manage the catalogue, homepage banners, orders and
        payment verification.
      </p>
    </section>
  );
}

/* ============================================================ */
/* Admin Products                                               */
/* ============================================================ */
function AdminProducts() {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const [files, setFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    title: "",
    price: "",
    compareAtPrice: "",
    discountPercent: "",
    category: "Oversized T-shirt",
    description: "",
    sizes: "M, L, XL, XXL",
    colors: "",
    stock: "0",
    sku: "",
    material: "Cotton",
    gsm: "220 GSM",
    tags: "",
    imageUrls: "",
  };

  const [f, setF] = useState(emptyForm);

  async function refresh() {
    setItems(await api("/admin/products"));
  }

  useEffect(() => {
    refresh()
      .catch((e) => msg(e.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  function resetForm() {
    setF(emptyForm);
    setFiles([]);
    setEditingId(null);
  }

  function startEdit(p) {
    setEditingId(p._id);
    setFiles([]);
    setF({
      title: p.title || "",
      price: String(p.price ?? ""),
      compareAtPrice: String(p.compareAtPrice ?? ""),
      discountPercent: String(p.discountPercent ?? ""),
      category: p.category || "",
      description: p.description || "",
      sizes: (p.sizes || []).join(", "),
      colors: (p.colors || []).join(", "),
      stock: String(p.stock ?? 0),
      sku: p.sku || "",
      material: p.material || "",
      gsm: p.gsm || "",
      tags: (p.tags || []).join(", "),
      imageUrls: (p.images || []).join("\n"),
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const previewDiscount = useMemo(() => {
    const price = Number(f.price) || 0;
    const compare = Number(f.compareAtPrice) || 0;
    const custom = Number(f.discountPercent) || 0;

    if (custom > 0 && custom < 100) {
      const original = Math.round(price / (1 - custom / 100));
      return {
        percent: Math.round(custom),
        original: Math.max(original, price),
        source: "custom",
      };
    }

    if (compare > price && price > 0) {
      return {
        percent: Math.round((1 - price / compare) * 100),
        original: compare,
        source: "auto",
      };
    }

    return { percent: 0, original: 0, source: "none" };
  }, [f.price, f.compareAtPrice, f.discountPercent]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);

    try {
      let images = f.imageUrls
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      if (files.length > 0) {
        const base64List = await Promise.all(
          files.map((file) => fileData(file, 1000, 0.8)),
        );

        const { imageUrls: uploaded } = await api("/uploads/images", {
          method: "POST",
          body: JSON.stringify({ images: base64List }),
        });

        images = [...uploaded, ...images];
      }

      const payload = {
        title: f.title,
        price: Number(f.price),
        compareAtPrice: Number(f.compareAtPrice || 0),
        discountPercent: Number(f.discountPercent || 0),
        category: f.category,
        description: f.description,
        stock: Number(f.stock || 0),
        sku: f.sku,
        material: f.material,
        gsm: f.gsm,
        images,
        sizes: f.sizes
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        colors: f.colors
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        tags: f.tags
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      };

      if (editingId) {
        await api("/admin/products/" + editingId, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        msg("Product updated");
      } else {
        await api("/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        msg("Product added");
      }

      resetForm();
      await refresh();
    } catch (e) {
      msg(e.message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="adminmain">
      <Heading
        tag="CATALOGUE"
        title="Products."
        desc={
          editingId
            ? "Editing product — make changes and save."
            : "Add a product, then manage the list below."
        }
      />

      <form className="box stack" onSubmit={submit}>
        <div className="flex items-center justify-between">
          <h2>{editingId ? "Edit product" : "Add product"}</h2>

          {editingId && (
            <button
              type="button"
              className="btn outline"
              onClick={resetForm}
              disabled={busy}
            >
              Cancel edit
            </button>
          )}
        </div>

        <div className="formgrid">
          {[
            ["title", "Title"],
            ["price", "Price (৳)"],
            ["compareAtPrice", "Compare-at price (original)"],
            ["discountPercent", "Discount % (auto or custom)"],
            ["category", "Category"],
            ["stock", "Stock"],
            ["sku", "SKU"],
            ["sizes", "Sizes (comma separated)"],
            ["colors", "Colors (comma separated)"],
            ["material", "Material"],
            ["gsm", "GSM / weight"],
            ["tags", "Tags (comma separated)"],
          ].map(([k, l]) => (
            <label key={k}>
              {l}

              <input
                value={f[k]}
                type={
                  [
                    "price",
                    "compareAtPrice",
                    "stock",
                    "discountPercent",
                  ].includes(k)
                    ? "number"
                    : "text"
                }
                onChange={(e) => setF({ ...f, [k]: e.target.value })}
                required={["title", "price"].includes(k)}
                placeholder={
                  k === "discountPercent"
                    ? "Leave empty to auto-calc"
                    : undefined
                }
              />
            </label>
          ))}

          <label className="span">
            Description
            <textarea
              value={f.description}
              onChange={(e) => setF({ ...f, description: e.target.value })}
            />
          </label>

          <div className="span rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-3">
            <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-orange-700">
              <Tag size={12} /> Discount preview
            </div>

            {previewDiscount.percent > 0 ? (
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-600 px-3 py-1 text-xs font-extrabold text-white">
                  <Percent size={11} /> {previewDiscount.percent}% off
                </span>
                <span className="text-xs font-semibold text-neutral-700">
                  {money(f.price)}{" "}
                  <del className="text-neutral-400">
                    {money(previewDiscount.original)}
                  </del>
                </span>
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase text-orange-600 ring-1 ring-orange-200">
                  {previewDiscount.source === "custom"
                    ? "Manual override"
                    : "Auto-calculated"}
                </span>
              </div>
            ) : (
              <p className="mt-2 text-xs text-neutral-500">
                Enter a compare-at price higher than the sale price to auto-show
                a discount badge, or set a custom % manually.
              </p>
            )}
          </div>

          <label className="span">
            Upload images (multiple, 5 MB each max)
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
            />
            {files.length > 0 && (
              <small className="text-green-600">
                ✓ {files.length} image{files.length > 1 ? "s" : ""} selected
                {editingId ? " (will be added to existing images)" : ""}
              </small>
            )}
          </label>

          <label className="span">
            Image URLs, one per line
            <textarea
              value={f.imageUrls}
              onChange={(e) => setF({ ...f, imageUrls: e.target.value })}
            />
          </label>
        </div>

        <button className="btn orange" disabled={busy}>
          {busy ? (
            <>
              <InlineLoader dark /> Saving...
            </>
          ) : (
            <>
              {editingId ? "Save changes" : "Save product"}{" "}
              {editingId ? <Pencil size={16} /> : <Plus size={16} />}
            </>
          )}
        </button>
      </form>

      {loading ? (
        <Loader text="Loading products" />
      ) : (
        <div className="box">
          <h2>All products ({items.length})</h2>

          {items.map((p) => {
            const discount = getDiscountInfo(p);

            return (
              <div className="adminrow" key={p._id}>
                <img
                  src={p.images?.[0] || "https://placehold.co/80x90"}
                  alt=""
                />

                <div>
                  <b>{p.title}</b>
                  <small>
                    {money(p.price)} · {p.category} ·{" "}
                    {Number(p.stock || 0) <= 0 ? (
                      <span className="font-bold text-red-600">STOCK OUT</span>
                    ) : (
                      <>Stock {p.stock}</>
                    )}
                    {discount.percent > 0 && (
                      <>
                        {" "}
                        ·{" "}
                        <span className="font-bold text-orange-600">
                          {discount.percent}% off
                        </span>
                      </>
                    )}
                    {p.images?.length > 1 && (
                      <>
                        {" "}
                        · <ImageIcon size={11} className="inline" />{" "}
                        {p.images.length} images
                      </>
                    )}
                  </small>
                </div>

                <button
                  className="btn outline"
                  onClick={() => startEdit(p)}
                  type="button"
                >
                  <Pencil size={14} /> Edit
                </button>

                <button
                  className="remove"
                  type="button"
                  onClick={async () => {
                    if (!confirm("Delete " + p.title + "?")) return;

                    try {
                      await api("/admin/products/" + p._id, {
                        method: "DELETE",
                      });

                      await refresh();

                      if (editingId === p._id) resetForm();

                      msg("Product deleted");
                    } catch (e) {
                      msg(e.message, "error");
                    }
                  }}
                >
                  <Trash2 /> Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ============================================================ */
/* Admin Banners                                                */
/* ============================================================ */
function AdminBanners() {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [f, setF] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    buttonText: "Shop collection",
    buttonLink: "/products",
    sortOrder: "0",
  });

  async function refresh() {
    setItems(await api("/admin/banners"));
  }

  useEffect(() => {
    refresh()
      .catch((e) => msg(e.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);

    try {
      let imageUrl = f.imageUrl.trim();

      if (file) {
        imageUrl = (
          await api("/uploads/image", {
            method: "POST",
            body: JSON.stringify({
              imageData: await fileData(file, 1600, 0.75),
            }),
          })
        ).imageUrl;
      }

      if (!imageUrl) {
        throw new Error("Please upload an image or paste an image URL.");
      }

      await api("/admin/banners", {
        method: "POST",
        body: JSON.stringify({
          title: f.title.trim(),
          subtitle: f.subtitle.trim(),
          imageUrl,
          buttonText: f.buttonText.trim() || "Shop collection",
          buttonLink: f.buttonLink.trim() || "/products",
          sortOrder: Number(f.sortOrder || 0),
          active: true,
        }),
      });

      setF({
        title: "",
        subtitle: "",
        imageUrl: "",
        buttonText: "Shop collection",
        buttonLink: "/products",
        sortOrder: "0",
      });
      setFile(null);

      await refresh();
      msg("Banner added");
    } catch (e) {
      msg(e.message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="adminmain">
      <Heading
        tag="HOMEPAGE EDITOR"
        title="Banners."
        desc="Manage the homepage carousel images. Only an image is required — heading and subheading are optional."
      />

      <form className="box stack" onSubmit={submit}>
        <h2>Add banner</h2>

        <div className="formgrid">
          <label className="span">
            Upload banner image <span className="text-orange-600">*</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file && <small className="text-green-600">✓ {file.name}</small>}
          </label>

          <label className="span">
            Or paste image URL{" "}
            <span className="font-normal text-neutral-400">
              (optional if file uploaded)
            </span>
            <input
              value={f.imageUrl}
              onChange={(e) => setF({ ...f, imageUrl: e.target.value })}
              placeholder="https://example.com/banner.jpg"
            />
          </label>

          <label>
            Headline{" "}
            <span className="font-normal text-neutral-400">(optional)</span>
            <input
              value={f.title}
              onChange={(e) => setF({ ...f, title: e.target.value })}
              placeholder="Leave empty to hide"
            />
          </label>

          <label>
            Subheading{" "}
            <span className="font-normal text-neutral-400">(optional)</span>
            <input
              value={f.subtitle}
              onChange={(e) => setF({ ...f, subtitle: e.target.value })}
              placeholder="Leave empty to hide"
            />
          </label>

          <label>
            Button text
            <input
              value={f.buttonText}
              onChange={(e) => setF({ ...f, buttonText: e.target.value })}
            />
          </label>

          <label>
            Button link
            <input
              value={f.buttonLink}
              onChange={(e) => setF({ ...f, buttonLink: e.target.value })}
            />
          </label>

          <label>
            Sort order
            <input
              type="number"
              value={f.sortOrder}
              onChange={(e) => setF({ ...f, sortOrder: e.target.value })}
            />
          </label>
        </div>

        <button className="btn orange" disabled={busy}>
          {busy ? (
            <>
              <InlineLoader dark /> Adding...
            </>
          ) : (
            <>
              Add banner <Plus size={16} />
            </>
          )}
        </button>
      </form>

      {loading ? (
        <Loader text="Loading banners" />
      ) : (
        <div className="box">
          <h2>Current banners</h2>

          {items.map((b) => (
            <div className="bannerrow" key={b._id}>
              <img src={b.imageUrl} alt={b.title || "Banner"} />

              <div>
                <b>{b.title || "Untitled banner"}</b>
                <p>{b.subtitle || "—"}</p>
                <button
                  className="btn outline"
                  onClick={async () => {
                    const imageUrl = prompt("New banner image URL", b.imageUrl);

                    if (!imageUrl) return;

                    try {
                      await api("/admin/banners/" + b._id, {
                        method: "PATCH",
                        body: JSON.stringify({ imageUrl }),
                      });

                      await refresh();
                      msg("Banner image updated");
                    } catch (e) {
                      msg(e.message, "error");
                    }
                  }}
                >
                  Change image
                </button>{" "}
                <button
                  className="btn outline"
                  onClick={async () => {
                    await api("/admin/banners/" + b._id, {
                      method: "PATCH",
                      body: JSON.stringify({ active: !b.active }),
                    });

                    await refresh();
                  }}
                >
                  {b.active ? "Hide" : "Show"}
                </button>{" "}
                <button
                  className="btn outline"
                  onClick={async () => {
                    if (confirm("Delete banner?")) {
                      await api("/admin/banners/" + b._id, {
                        method: "DELETE",
                      });

                      await refresh();
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ============================================================ */
/* New Orders — notification page                               */
/* ============================================================ */
function NewOrders() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function refresh(showSpinner = false) {
    if (showSpinner) setRefreshing(true);

    try {
      const data = await api("/admin/orders/new");
      setItems(Array.isArray(data) ? data : []);
      setError("");
    } catch (e) {
      setError(e.message || "Failed to load new orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    refresh();
    const id = setInterval(() => refresh(), 30000);
    return () => clearInterval(id);
  }, []);

  async function processOrder(id, nextStatus) {
    try {
      await api("/admin/orders/" + id, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      msg(`Order marked as ${nextStatus}`);
      await refresh();
    } catch (e) {
      msg(e.message, "error");
    }
  }

  return (
    <section className="adminmain">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-red-600">
            NOTIFICATIONS
          </span>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">
            New Orders
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            New orders waiting to be processed. Process/cancel and they'll move
            to the Orders page.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refresh(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-bold text-neutral-700 transition hover:border-orange-400 hover:text-orange-600 disabled:opacity-60"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white">
          <Loader text="Loading new orders" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <CheckCircle2 size={26} />
          </div>
          <h3 className="mt-4 text-lg font-extrabold text-neutral-900">
            All caught up!
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            No new orders waiting. New orders will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((o) => (
            <article
              key={o._id}
              className="overflow-hidden rounded-2xl border-2 border-red-200 bg-white shadow-md ring-1 ring-red-100"
            >
              <div className="flex flex-col gap-3 border-b border-red-100 bg-red-50/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500 text-white shadow-sm">
                    <Clock size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-500 sm:text-sm">
                        {o.orderNumber}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700 ring-1 ring-red-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        NEW
                      </span>
                      {o.paymentStatus !== "not_required" && (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 ring-1 ring-amber-200">
                          {o.paymentStatus.replaceAll("_", " ")}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-sm font-extrabold text-neutral-900 sm:text-base">
                      {o.customerName}
                    </p>
                    {o.createdAt && (
                      <p className="text-xs text-neutral-400">
                        {new Date(o.createdAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Total
                    </p>
                    <p className="text-lg font-black text-neutral-900 tabular-nums">
                      {money(o.total)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                      Customer
                    </p>
                    <p className="flex items-center gap-2 text-sm text-neutral-700">
                      <Phone size={13} className="shrink-0 text-neutral-400" />
                      <a
                        href={`tel:${o.phone}`}
                        className="font-mono hover:text-orange-600"
                      >
                        {o.phone}
                      </a>
                    </p>
                    {(o.address || o.city) && (
                      <p className="mt-1 flex items-start gap-2 text-sm text-neutral-700">
                        <MapPin
                          size={13}
                          className="mt-0.5 shrink-0 text-neutral-400"
                        />
                        <span>
                          {o.address}
                          {o.city ? `, ${o.city}` : ""}
                        </span>
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                      Items ({o.items?.length || 0})
                    </p>
                    <p className="text-sm text-neutral-600">
                      {(o.items || [])
                        .map((i) => `${i.title} ×${i.quantity}`)
                        .join(", ")}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => processOrder(o._id, "confirmed")}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                  >
                    <CheckCircle2 size={14} /> Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => processOrder(o._id, "processing")}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-violet-700"
                  >
                    <Package size={14} /> Process
                  </button>
                  <button
                    type="button"
                    onClick={() => processOrder(o._id, "shipped")}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-indigo-700"
                  >
                    <Truck size={14} /> Ship
                  </button>
                  <button
                    type="button"
                    onClick={() => processOrder(o._id, "cancelled")}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-700"
                  >
                    <XCircle size={14} /> Cancel
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

/* ============================================================ */
/* Admin Orders                                                 */
/* ============================================================ */
const ORDER_STATUS_META = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-50 text-blue-700 ring-blue-200",
    dot: "bg-blue-500",
    icon: PackageCheck,
  },
  processing: {
    label: "Processing",
    color: "bg-violet-50 text-violet-700 ring-violet-200",
    dot: "bg-violet-500",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    color: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    dot: "bg-indigo-500",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-50 text-red-700 ring-red-200",
    dot: "bg-red-500",
    icon: XCircle,
  },
};

const PAYMENT_STATUS_META = {
  not_required: {
    label: "Pay on delivery",
    color: "bg-stone-100 text-stone-600 ring-stone-200",
  },
  pending_verification: {
    label: "Pending verification",
    color: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  verified: {
    label: "Verified",
    color: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-50 text-red-700 ring-red-200",
  },
};

function AdminOrders() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  async function refresh(showSpinner = false) {
    if (showSpinner) setRefreshing(true);

    try {
      const data = await api("/admin/orders");
      setItems(Array.isArray(data) ? data : []);
      setError("");
    } catch (e) {
      setError(e.message || "Failed to load orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function update(id, patch) {
    try {
      await api("/admin/orders/" + id, {
        method: "PATCH",
        body: JSON.stringify(patch),
      });
      msg("Order updated");
      await refresh();
    } catch (e) {
      msg(e.message, "error");
    }
  }

  const stats = useMemo(() => {
    const total = items.length;
    const pending = items.filter((o) => o.status === "pending").length;
    const processing = items.filter((o) =>
      ["confirmed", "processing", "shipped"].includes(o.status),
    ).length;
    const delivered = items.filter((o) => o.status === "delivered").length;
    const cancelled = items.filter((o) => o.status === "cancelled").length;

    const totalRevenue = items
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + Number(o.total || 0), 0);

    const successRevenue = items
      .filter((o) => o.status === "delivered")
      .reduce((s, o) => s + Number(o.total || 0), 0);

    const pendingPayment = items.filter(
      (o) => o.paymentStatus === "pending_verification",
    ).length;

    return {
      total,
      pending,
      processing,
      delivered,
      cancelled,
      totalRevenue,
      successRevenue,
      pendingPayment,
    };
  }, [items]);

  const tabs = [
    { id: "all", label: "All", count: stats.total },
    { id: "pending", label: "Pending", count: stats.pending },
    { id: "active", label: "Active", count: stats.processing },
    { id: "delivered", label: "Delivered", count: stats.delivered },
    { id: "cancelled", label: "Cancelled", count: stats.cancelled },
    {
      id: "payment_due",
      label: "Payment due",
      count: stats.pendingPayment,
    },
  ];

  const filtered = useMemo(() => {
    let list = items;

    if (activeTab === "pending")
      list = list.filter((o) => o.status === "pending");
    else if (activeTab === "active")
      list = list.filter((o) =>
        ["confirmed", "processing", "shipped"].includes(o.status),
      );
    else if (activeTab === "delivered")
      list = list.filter((o) => o.status === "delivered");
    else if (activeTab === "cancelled")
      list = list.filter((o) => o.status === "cancelled");
    else if (activeTab === "payment_due")
      list = list.filter((o) => o.paymentStatus === "pending_verification");

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (o) =>
          String(o.orderNumber || "")
            .toLowerCase()
            .includes(q) ||
          String(o.customerName || "")
            .toLowerCase()
            .includes(q) ||
          String(o.phone || "")
            .toLowerCase()
            .includes(q),
      );
    }

    return list;
  }, [items, activeTab, query]);

  return (
    <section className="adminmain">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-orange-600">
            FULFILMENT
          </span>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">
            Orders
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage deliveries, verify payments and keep customers happy.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refresh(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-bold text-neutral-700 transition hover:border-orange-400 hover:text-orange-600 disabled:opacity-60"
        >
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4 ring-1 ring-inset ring-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-orange-700">
                Total order revenue
              </p>
              <p className="mt-1 text-2xl font-black text-orange-900 tabular-nums sm:text-3xl">
                {money(stats.totalRevenue)}
              </p>
              <p className="mt-1 text-[11px] text-orange-700/70">
                All orders excluding cancelled ({stats.total - stats.cancelled}{" "}
                orders)
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white shadow-sm">
              <Wallet size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 ring-1 ring-inset ring-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                Total success revenue
              </p>
              <p className="mt-1 text-2xl font-black text-emerald-900 tabular-nums sm:text-3xl">
                {money(stats.successRevenue)}
              </p>
              <p className="mt-1 text-[11px] text-emerald-700/70">
                Delivered orders only ({stats.delivered} orders)
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
              <TrendingUp size={22} />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="Total orders"
          value={stats.total}
          tone="neutral"
          icon={Package}
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          tone="amber"
          icon={Clock}
        />
        <StatCard
          label="Active"
          value={stats.processing}
          tone="violet"
          icon={Truck}
        />
        <StatCard
          label="Delivered"
          value={stats.delivered}
          tone="emerald"
          icon={CheckCircle2}
        />
        <StatCard
          label="Cancelled"
          value={stats.cancelled}
          tone="red"
          icon={XCircle}
        />
        <StatCard
          label="Payment due"
          value={stats.pendingPayment}
          tone="red"
          icon={CreditCard}
        />
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:p-4">
        <div className="-mx-1 flex flex-1 gap-1.5 overflow-x-auto px-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${
                activeTab === t.id
                  ? "bg-neutral-950 text-white"
                  : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                  activeTab === t.id
                    ? "bg-white/20 text-white"
                    : "bg-white text-neutral-500"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-xl bg-neutral-50 px-3 transition focus-within:ring-2 focus-within:ring-orange-400 sm:max-w-xs">
          <Search size={16} className="shrink-0 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search order, name, phone..."
            className="w-full min-w-0 bg-transparent py-2 text-sm outline-none placeholder:text-neutral-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="shrink-0 text-[11px] font-bold text-neutral-500 hover:text-orange-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-neutral-200 bg-white">
          <Loader text="Loading orders" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500">
            <Package size={26} />
          </div>
          <h3 className="mt-4 text-lg font-extrabold text-neutral-900">
            No orders found
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            {query
              ? "Try a different search term or clear filters."
              : "New orders will appear here as they come in."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const statusMeta =
              ORDER_STATUS_META[o.status] || ORDER_STATUS_META.pending;
            const paymentMeta =
              PAYMENT_STATUS_META[o.paymentStatus] ||
              PAYMENT_STATUS_META.not_required;
            const StatusIcon = statusMeta.icon;
            const expanded = expandedId === o._id;

            return (
              <article
                key={o._id}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:border-neutral-300"
              >
                <div className="flex flex-col gap-3 border-b border-neutral-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white">
                      <StatusIcon size={20} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-neutral-500 sm:text-sm">
                          {o.orderNumber}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${statusMeta.color}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`}
                          />
                          {statusMeta.label}
                        </span>
                        {o.paymentStatus !== "not_required" && (
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${paymentMeta.color}`}
                          >
                            {paymentMeta.label}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 truncate text-sm font-extrabold text-neutral-900 sm:text-base">
                        {o.customerName}
                      </p>
                      {o.createdAt && (
                        <p className="text-xs text-neutral-400">
                          {new Date(o.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Total
                      </p>
                      <p className="text-lg font-black text-neutral-900 tabular-nums">
                        {money(o.total)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : o._id)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 text-neutral-600 transition hover:border-orange-400 hover:text-orange-600"
                      aria-expanded={expanded}
                      aria-label={expanded ? "Collapse" : "Expand"}
                    >
                      {expanded ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-2">
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                          Customer
                        </h4>
                        <div className="space-y-1.5 text-sm">
                          <p className="flex items-center gap-2 text-neutral-700">
                            <UserRound
                              size={14}
                              className="shrink-0 text-neutral-400"
                            />
                            <span className="font-semibold text-neutral-900">
                              {o.customerName}
                            </span>
                          </p>
                          <p className="flex items-center gap-2 text-neutral-700">
                            <Phone
                              size={14}
                              className="shrink-0 text-neutral-400"
                            />
                            <a
                              href={`tel:${o.phone}`}
                              className="font-mono hover:text-orange-600"
                            >
                              {o.phone}
                            </a>
                          </p>
                          {(o.address || o.city) && (
                            <p className="flex items-start gap-2 text-neutral-700">
                              <MapPin
                                size={14}
                                className="mt-0.5 shrink-0 text-neutral-400"
                              />
                              <span>
                                {o.address}
                                {o.city ? `, ${o.city}` : ""}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                          Items ({o.items?.length || 0})
                        </h4>
                        <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-200">
                          {(o.items || []).map((it, n) => (
                            <div
                              key={n}
                              className="flex items-center gap-3 p-2.5 text-sm"
                            >
                              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                                <img
                                  src={
                                    it.image ||
                                    "https://placehold.co/80x80?text=Item"
                                  }
                                  alt={it.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold text-neutral-900">
                                  {it.title}
                                </p>
                                <p className="text-xs text-neutral-500">
                                  Qty {it.quantity}
                                  {it.size ? ` · ${it.size}` : ""} ·{" "}
                                  {money(it.price)} each
                                </p>
                              </div>
                              <p className="shrink-0 font-bold text-neutral-900 tabular-nums">
                                {money(
                                  Number(it.price || 0) *
                                    Number(it.quantity || 1),
                                )}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-3 space-y-1 rounded-xl bg-neutral-50 p-3 text-sm">
                          <div className="flex justify-between text-neutral-600">
                            <span>Subtotal</span>
                            <span className="tabular-nums">
                              {money(o.subtotal)}
                            </span>
                          </div>
                          <div className="flex justify-between text-neutral-600">
                            <span>Delivery</span>
                            <span className="tabular-nums">
                              {money(o.deliveryCharge)}
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-neutral-200 pt-1.5 font-black text-neutral-900">
                            <span>Total</span>
                            <span className="tabular-nums">
                              {money(o.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                          Payment
                        </h4>
                        <div className="rounded-xl border border-neutral-200 p-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-neutral-500">Method</span>
                            <span className="font-semibold capitalize">
                              {o.paymentMethod || "—"}
                            </span>
                          </div>
                          <div className="mt-1.5 flex items-center justify-between">
                            <span className="text-neutral-500">
                              Transaction ID
                            </span>
                            <span className="font-mono text-xs">
                              {o.transactionId || "—"}
                            </span>
                          </div>
                          <div className="mt-1.5 flex items-center justify-between">
                            <span className="text-neutral-500">Status</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${paymentMeta.color}`}
                            >
                              {paymentMeta.label}
                            </span>
                          </div>
                          {o.paymentScreenshot && (
                            <a
                              href={o.paymentScreenshot}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline"
                            >
                              <ImageIcon size={12} /> View screenshot ↗
                            </a>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                          Update status
                        </h4>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <label className="block">
                            <span className="mb-1 block text-xs font-bold text-neutral-600">
                              Order status
                            </span>
                            <select
                              value={o.status}
                              onChange={(e) =>
                                update(o._id, { status: e.target.value })
                              }
                              className="min-h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            >
                              {[
                                "pending",
                                "confirmed",
                                "processing",
                                "shipped",
                                "delivered",
                                "cancelled",
                              ].map((s) => (
                                <option key={s} value={s}>
                                  {ORDER_STATUS_META[s]?.label || s}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className="block">
                            <span className="mb-1 block text-xs font-bold text-neutral-600">
                              Payment status
                            </span>
                            <select
                              value={o.paymentStatus}
                              onChange={(e) =>
                                update(o._id, {
                                  paymentStatus: e.target.value,
                                })
                              }
                              className="min-h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                            >
                              {[
                                "not_required",
                                "pending_verification",
                                "verified",
                                "rejected",
                              ].map((s) => (
                                <option key={s} value={s}>
                                  {PAYMENT_STATUS_META[s]?.label || s}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* Small stat card used in AdminOrders */
function StatCard({ label, value, tone = "neutral", icon: Icon }) {
  const tones = {
    neutral: "bg-neutral-50 text-neutral-900 ring-neutral-200",
    amber: "bg-amber-50 text-amber-800 ring-amber-200",
    violet: "bg-violet-50 text-violet-800 ring-violet-200",
    emerald: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    red: "bg-red-50 text-red-800 ring-red-200",
    orange: "bg-orange-50 text-orange-800 ring-orange-200",
  };

  return (
    <div
      className={`rounded-2xl border bg-white p-3 ring-1 ring-inset ${tones[tone] || tones.neutral}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-extrabold uppercase tracking-wider opacity-80">
          {label}
        </p>
        {Icon && <Icon size={14} className="opacity-70" />}
      </div>
      <p className="mt-1.5 text-xl font-black tabular-nums">{value}</p>
    </div>
  );
}

/* 404 Page */
function NotFound() {
  return (
    <main className="wrap page">
      <Heading tag="404" title="Page not found." />

      <Link className="btn orange" to="/">
        Back home
      </Link>
    </main>
  );
}

/* Main App */
export default function App() {
  const cart = useCart();

  return (
    <C.Provider value={cart}>
      <FontSetup />

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track-order" element={<Track />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<AdminGuard />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="new-orders" element={<NewOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </C.Provider>
  );
}

/* Admin Route Protection */
function AdminGuard() {
  const { adminToken } = useAuth();

  return adminToken ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
