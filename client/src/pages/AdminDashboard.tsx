import { useAuth } from "@/_core/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import {
  BarChart3,
  Package,
  MessageSquare,
  Plus,
  LogOut,
  Edit,
  Trash2,
  LayoutGrid,
  Globe,
  Image,
  Percent,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  addFirebaseProduct,
  updateFirebaseProduct,
  deleteFirebaseProduct,
  getFirebaseOrders,
  updateFirebaseOrderStatus,
  addFirebaseCategory,
  updateFirebaseCategory,
  deleteFirebaseCategory,
  addFirebaseWorldCollection,
  updateFirebaseWorldCollection,
  deleteFirebaseWorldCollection,
  addFirebaseBanner,
  updateFirebaseBanner,
  deleteFirebaseBanner,
  addFirebaseCoupon,
  updateFirebaseCoupon,
  deleteFirebaseCoupon,
  getFirebaseDeliverySettings,
  updateFirebaseDeliverySettings,
} from "@/lib/firebase";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useWorldCollections } from "@/hooks/useWorldCollections";
import { useBanners } from "@/hooks/useBanners";
import { useCoupons } from "@/hooks/useCoupons";
import { useDeliverySettings } from "@/hooks/useDeliverySettings";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { WorldCollection, HeroBanner, Coupon } from "@/types";

type AdminTab = "dashboard" | "products" | "categories" | "inquiries" | "world" | "banners" | "coupons" | "settings";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  const { products, loading: productsLoading, refetch: refetchProducts } = useProducts();
  const { categories, loading: categoriesLoading, refetch: refetchCategories } = useCategories();
  const { collections: worldCollections, loading: worldLoading, refetch: refetchWorld } = useWorldCollections();
  const { banners, loading: bannersLoading, refetch: refetchBanners } = useBanners();
  const { coupons, loading: couponsLoading, refetch: refetchCoupons } = useCoupons();
  const { settings: deliverySettings, loading: settingsLoading, refetch: refetchSettings } = useDeliverySettings();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await getFirebaseOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchOrders();
    }
  }, [user]);

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center py-24">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-light">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page. Please sign in with an admin account.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/login">
                <a>
                  <Button className="luxury-button">Sign In</Button>
                </a>
              </Link>
              <Link href="/">
                <a>
                  <Button variant="outline">Go Home</Button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isLoading = productsLoading || ordersLoading || categoriesLoading || worldLoading || bannersLoading || couponsLoading || settingsLoading;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile Header / Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-white shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/">
            <a className="font-serif text-xl font-medium tracking-wide">Mayil Jewels Admin</a>
          </Link>
        </div>
        <button
          onClick={() => {
            logout();
            setLocation("/");
          }}
          className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile tab bar */}
      <div className="md:hidden flex border-b overflow-x-auto bg-white shrink-0">
        {[
          { tab: "dashboard", label: "Dashboard", icon: BarChart3 },
          { tab: "products", label: "Products", icon: Package },
          { tab: "categories", label: "Categories", icon: LayoutGrid },
          { tab: "world", label: "World", icon: Globe },
          { tab: "coupons", label: "Coupons", icon: Percent },
          { tab: "settings", label: "Settings", icon: Settings },
          { tab: "inquiries", label: "Inquiries", icon: MessageSquare },
        ].map(({ tab, label, icon: Icon }) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as AdminTab)}
            className={`flex flex-col items-center gap-1 px-4 py-3 text-xs shrink-0 border-b-2 transition-colors ${
              activeTab === tab
                ? "border-[var(--brand)] text-[var(--brand)]"
                : "border-transparent text-muted-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-secondary/30 border-r border-border/50 flex-col min-h-screen shrink-0 sticky top-0">
        <div className="p-6 space-y-2">
          <Link href="/">
            <a className="block mb-2 text-sm text-[var(--brand)] hover:underline">&larr; Back to Store</a>
          </Link>
          <h2 className="text-xl font-light">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {[
            { tab: "dashboard", label: "Dashboard", icon: BarChart3 },
            { tab: "products", label: "Products", icon: Package },
            { tab: "categories", label: "Categories", icon: LayoutGrid },
            { tab: "world", label: "Mayil World", icon: Globe },
            { tab: "coupons", label: "Coupons", icon: Percent },
            { tab: "settings", label: "Settings", icon: Settings },
            { tab: "inquiries", label: "Inquiries", icon: MessageSquare },
          ].map(({ tab, label, icon: Icon }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as AdminTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-secondary/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50 shrink-0">
          <button
            onClick={() => {
              logout();
              setLocation("/");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background/50">
        <div className="container py-6 md:py-8 max-w-6xl">
          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <Spinner className="w-8 h-8 text-[var(--brand)]" />
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && <DashboardView products={products} orders={orders} categories={categories} />}
              {activeTab === "products" && <ProductsView products={products} categories={categories} refetchProducts={refetchProducts} />}
              {activeTab === "categories" && <CategoriesView categories={categories} refetchCategories={refetchCategories} />}
              {activeTab === "world" && <WorldCollectionsView collections={worldCollections} refetch={refetchWorld} />}
              {activeTab === "banners" && <BannersView banners={banners} refetch={refetchBanners} />}
              {activeTab === "coupons" && <CouponsView coupons={coupons} refetch={refetchCoupons} />}
              {activeTab === "settings" && <SettingsView settings={deliverySettings} refetch={refetchSettings} />}
              {activeTab === "inquiries" && <InquiriesView orders={orders} fetchOrders={fetchOrders} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function DashboardView({ products, orders, categories }: { products: any[]; orders: any[]; categories: any[] }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-light mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your Mayil Jewels admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Products", value: String(products.length), icon: "📦" },
          { label: "Categories", value: String(categories.length), icon: "🏷️" },
          { label: "Total Inquiries", value: String(orders.length), icon: "💬" },
        ].map((stat, index) => (
          <div key={index} className="luxury-card p-6 space-y-4">
            <div className="text-3xl">{stat.icon}</div>
            <div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="luxury-card p-6 space-y-4">
        <h2 className="text-2xl font-light">Recent Inquiries</h2>
        <div className="space-y-3 text-sm">
          {orders.slice(0, 5).map((order: any) => (
            <div key={order.id} className="flex items-center justify-between py-2 border-b border-border/50">
              <span>Order inquiry from {order.customerName} ({formatINR(Number(order.totalAmount))})</span>
              <span className="text-muted-foreground capitalize font-medium">{order.status}</span>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-muted-foreground py-4">No recent inquiries.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CATEGORIES VIEW ─────────────────────────────────────────────────────────

function CategoriesView({ categories, refetchCategories }: { categories: any[]; refetchCategories: () => void }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", image: "" });

  const openAdd = () => {
    setSelected(null);
    setForm({ name: "", slug: "", description: "", image: "" });
    setOpen(true);
  };

  const openEdit = (cat: any) => {
    setSelected(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || "", image: cat.image || "" });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const payload = { name: form.name, slug, description: form.description, image: form.image };
    try {
      if (selected) {
        await updateFirebaseCategory(selected.id, payload);
        toast.success("Category updated successfully");
      } else {
        await addFirebaseCategory(payload);
        toast.success("Category created successfully");
      }
      refetchCategories();
      setOpen(false);
    } catch (err: any) {
      toast.error(`Error: ${err.message || "Failed to save category"}`);
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteFirebaseCategory(id);
        toast.success("Category deleted");
        refetchCategories();
      } catch (err: any) {
        toast.error(`Error: ${err.message || "Failed to delete category"}`);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light mb-2">Categories</h1>
          <p className="text-muted-foreground">Manage the homepage category grid and their images</p>
        </div>
        <Button className="luxury-button" onClick={openAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Category Image Grid Preview */}
      <div className="luxury-card p-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Live Preview — Homepage Grid
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((cat) => (
            <div key={cat.id} className="relative group cursor-pointer" onClick={() => openEdit(cat)}>
              <div className="aspect-[4/5] rounded-lg overflow-hidden border border-border shadow-sm">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1599459183761-45c31a2b2b0e?w=400&h=500&fit=crop";
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-black/40 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-semibold flex items-center gap-1">
                  <Edit className="w-3 h-3" /> Edit
                </span>
              </div>
              <p className="text-xs font-semibold text-center mt-1 uppercase tracking-wider truncate">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Table */}
      <div className="luxury-card overflow-x-auto border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 border-b border-border/50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Preview</th>
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-left font-semibold">Slug</th>
              <th className="px-6 py-4 text-left font-semibold">Description</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat: any) => (
              <tr key={cat.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-3">
                  <div className="w-12 h-14 rounded overflow-hidden border border-border">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1599459183761-45c31a2b2b0e?w=400&h=500&fit=crop";
                      }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">{cat.name}</td>
                <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{cat.slug}</td>
                <td className="px-6 py-4 text-muted-foreground text-xs">{cat.description}</td>
                <td className="px-6 py-4 space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(cat)}>
                    <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(cat.id)}>
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </Button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {selected ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              Update the category name, slug, and its image URL.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase text-muted-foreground">Category Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground"
                placeholder="e.g. Earrings"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium uppercase text-muted-foreground">Slug (URL key)</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground"
                placeholder="e.g. earrings (auto-generated if left blank)"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium uppercase text-muted-foreground">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground"
                placeholder="e.g. Studs, drops & jhumkas"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium uppercase text-muted-foreground">Image URL</label>
              <input
                type="url"
                required
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground"
                placeholder="https://images.unsplash.com/..."
              />
              {form.image && (
                <div className="mt-2 w-24 h-28 rounded overflow-hidden border border-border">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="luxury-button" disabled={isPending}>
                {isPending ? "Saving..." : selected ? "Save Changes" : "Create Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── PRODUCTS VIEW ────────────────────────────────────────────────────────────

function ProductsView({ products, categories, refetchProducts }: { products: any[]; categories: any[]; refetchProducts: () => void }) {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isPending, setIsPending] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    weight: "",
    categoryId: "",
    style: "Imitation",
    finish: "Gold-tone",
    gender: "Women",
    featured: false,
    trending: false,
    isNew: true,
    imageUrl: "",
  });

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      weight: "",
      categoryId: categories[0]?.id || "",
      style: "Imitation",
      finish: "Gold-tone",
      gender: "Women",
      featured: false,
      trending: false,
      isNew: true,
      imageUrl: "",
    });
    setOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : "",
      weight: product.weight ? String(product.weight) : "",
      categoryId: product.categoryId || categories[0]?.id || "",
      style: product.style || product.metal || "Imitation",
      finish: product.finish || product.purity || "Gold-tone",
      gender: product.gender || "Women",
      featured: Boolean(product.featured),
      trending: Boolean(product.trending),
      isNew: Boolean(product.isNew),
      imageUrl: product.image || "",
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const categorySlug = categories.find((c) => c.id === formData.categoryId)?.slug || "other";

    const payload = {
      name: formData.name,
      slug,
      description: formData.description,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      weight: formData.weight ? Number(formData.weight) : undefined,
      categoryId: formData.categoryId,
      categorySlug,
      style: formData.style as any,
      finish: formData.finish,
      gender: formData.gender as any,
      featured: formData.featured,
      trending: formData.trending,
      isNew: formData.isNew,
      image: formData.imageUrl || "https://images.unsplash.com/photo-1599459183761-45c31a2b2b0e?w=600&h=750&fit=crop",
      images: formData.imageUrl ? [formData.imageUrl] : [],
    };

    try {
      if (selectedProduct) {
        await updateFirebaseProduct(selectedProduct.id, payload);
        toast.success("Product updated successfully");
      } else {
        await addFirebaseProduct(payload);
        toast.success("Product created successfully");
      }
      refetchProducts();
      setOpen(false);
    } catch (err: any) {
      toast.error(`Error: ${err.message || "Failed to save product"}`);
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteFirebaseProduct(id);
        toast.success("Product deleted successfully");
        refetchProducts();
      } catch (err: any) {
        toast.error(`Error: ${err.message || "Failed to delete product"}`);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your jewellery collection</p>
        </div>
        <Button className="luxury-button" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="luxury-card overflow-x-auto border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 border-b border-border/50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-left font-semibold">Category</th>
              <th className="px-6 py-4 text-left font-semibold">Style</th>
              <th className="px-6 py-4 text-left font-semibold">Price</th>
              <th className="px-6 py-4 text-left font-semibold">Featured</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => {
              const categoryName = categories.find((c) => c.id === product.categoryId)?.name || "Other";
              return (
                <tr key={product.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{categoryName}</td>
                  <td className="px-6 py-4 text-muted-foreground">{product.style || product.metal || "Imitation"}</td>
                  <td className="px-6 py-4 font-medium">{formatINR(Number(product.price))}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.featured ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}>
                      {product.featured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenEdit(product)}>
                      <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {selectedProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>Provide detailed information for this jewelry item.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase text-muted-foreground">Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground" placeholder="Product name" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-muted-foreground">Original Price (INR)</label>
                <input type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground" placeholder="3000" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-muted-foreground">Discounted Price (INR)</label>
                <input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground" placeholder="2500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-muted-foreground">Weight (grams)</label>
                <input type="number" step="0.01" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground" placeholder="12.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-muted-foreground">Category</label>
                <select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground">
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-muted-foreground">Style</label>
                <select value={formData.style} onChange={(e) => setFormData({ ...formData, style: e.target.value })} className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground">
                  <option value="Antique">Antique</option>
                  <option value="Imitation">Imitation</option>
                  <option value="Temple">Temple</option>
                  <option value="Kundan">Kundan</option>
                  <option value="Oxidised">Oxidised</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-muted-foreground">Finish</label>
                <input type="text" value={formData.finish} onChange={(e) => setFormData({ ...formData, finish: e.target.value })} className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground" placeholder="e.g. Antique gold-tone" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-muted-foreground">Gender</label>
                <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground">
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium uppercase text-muted-foreground">Image URL</label>
              <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground" placeholder="https://images.unsplash.com/..." />
              {formData.imageUrl && (
                <div className="mt-2 w-16 h-20 rounded overflow-hidden border">
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium uppercase text-muted-foreground">Description</label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent h-20 resize-none bg-white text-foreground" placeholder="Product description..." />
            </div>

            <div className="flex flex-wrap gap-4">
              {[
                { key: "featured", label: "Featured (homepage)" },
                { key: "trending", label: "Trending" },
                { key: "isNew", label: "New Arrival" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(formData as any)[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                  />
                  {label}
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" className="luxury-button" disabled={isPending}>
                {isPending ? "Saving..." : selectedProduct ? "Save Changes" : "Create Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InquiriesView({ orders, fetchOrders }: { orders: any[]; fetchOrders: () => void }) {
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateFirebaseOrderStatus(id, newStatus);
      toast.success("Status updated");
      fetchOrders();
    } catch (err: any) {
      toast.error(`Error: ${err.message || "Failed to update status"}`);
    }
  };

  const statusOptions = [
    { value: "pending", label: "Pending", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { value: "contacted", label: "Contacted", color: "bg-sky-50 text-sky-700 border-sky-200" },
    { value: "completed", label: "Completed", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { value: "cancelled", label: "Cancelled", color: "bg-rose-50 text-rose-700 border-rose-200" },
  ];

  const getStatusStyle = (status: string) =>
    statusOptions.find((s) => s.value === status)?.color ?? "bg-gray-50 text-gray-600 border-gray-200";

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-light mb-2">Customer Inquiries</h1>
        <p className="text-muted-foreground">View and manage customer orders logged during WhatsApp checkout</p>
      </div>

      {orders.length === 0 ? (
        <div className="luxury-card border p-12 text-center">
          <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-lg text-muted-foreground">No inquiries yet</p>
          <p className="text-sm text-muted-foreground/60 mt-1">Orders placed via WhatsApp will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((inquiry: any) => {
            const itemsList = Array.isArray(inquiry.items)
              ? inquiry.items
              : [];
            return (
              <div
                key={inquiry.id}
                className="luxury-card border p-0 overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 bg-secondary/20 border-b border-border/40">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center text-sm font-semibold shrink-0">
                      {(inquiry.customerName || "?")[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{inquiry.customerName}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {inquiry.customerPhone || inquiry.customerEmail || "No contact"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {new Date(inquiry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      {" · "}
                      {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {/* Status dropdown */}
                    <select
                      value={inquiry.status || "pending"}
                      onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                      className={`text-xs font-medium capitalize px-3 py-1.5 rounded-full border cursor-pointer outline-none transition-colors ${getStatusStyle(inquiry.status)}`}
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Items + Total */}
                <div className="px-5 py-4">
                  {itemsList.length > 0 ? (
                    <div className="space-y-2">
                      {itemsList.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-foreground/80">
                            {item.name}
                            <span className="text-muted-foreground ml-1">×{item.quantity}</span>
                          </span>
                          <span className="font-medium text-foreground/70">
                            {formatINR(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                      
                      {/* Detailed breakdown if coupon or delivery charge is defined */}
                      <div className="pt-3 mt-2 border-t border-border/40 text-xs space-y-1">
                        {inquiry.couponCode || (inquiry.deliveryCharge !== undefined && inquiry.deliveryCharge > 0) ? (
                          <>
                            <div className="flex justify-between text-muted-foreground">
                              <span>Subtotal</span>
                              <span>{formatINR(itemsList.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0))}</span>
                            </div>
                            {inquiry.couponCode && (
                              <div className="flex justify-between text-green-700 font-medium">
                                <span>Discount ({inquiry.couponCode})</span>
                                <span>-{formatINR(inquiry.discountAmount ?? 0)}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-muted-foreground">
                              <span>Delivery</span>
                              {inquiry.deliveryCharge > 0 ? (
                                <span>{formatINR(inquiry.deliveryCharge)}</span>
                              ) : (
                                <span className="text-green-700">Complimentary</span>
                              )}
                            </div>
                          </>
                        ) : null}
                        
                        <div className="flex items-center justify-between pt-2 text-sm font-semibold border-t border-border/20">
                          <span className="text-foreground/80">Total</span>
                          <span className="text-base font-bold text-[var(--brand)]">
                            {formatINR(Number(inquiry.totalAmount))}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No items recorded</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── WORLD COLLECTIONS VIEW ───────────────────────────────────────────────────

function WorldCollectionsView({ collections, refetch }: { collections: WorldCollection[]; refetch: () => void }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<WorldCollection | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", image: "", bannerImage: "", href: "", order: 0 });

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", subtitle: "", image: "", bannerImage: "", href: "/collections", order: collections.length });
    setDialogOpen(true);
  };

  const openEdit = (item: WorldCollection) => {
    setEditing(item);
    setForm({ title: item.title, subtitle: item.subtitle, image: item.image, bannerImage: item.bannerImage || "", href: item.href, order: item.order ?? 0 });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const submissionForm = {
        ...form,
        image: form.bannerImage
      };
      if (editing) {
        await updateFirebaseWorldCollection(editing.id, submissionForm);
        toast.success("Updated!");
      } else {
        await addFirebaseWorldCollection(submissionForm);
        toast.success("Created!");
      }
      setDialogOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this collection?")) return;
    try {
      await deleteFirebaseWorldCollection(id);
      toast.success("Deleted!");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light mb-2">Mayil World</h1>
          <p className="text-muted-foreground">Manage the occasion-based collections displayed on the homepage</p>
        </div>
        <Button className="luxury-button" onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Add Collection
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {collections.map((w) => (
          <div key={w.id} className="luxury-card overflow-hidden border group">
            <div className="relative aspect-[3/4]">
              <img
                src={w.bannerImage || w.image}
                alt={w.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=800&fit=crop"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-serif text-xl">{w.title}</h3>
                <p className="text-xs text-white/80 mt-1">{w.subtitle}</p>
              </div>
              {/* Action overlay */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => openEdit(w)}
                  className="w-8 h-8 rounded-full bg-white/90 text-foreground flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(w.id)}
                  className="w-8 h-8 rounded-full bg-white/90 text-destructive flex items-center justify-center hover:bg-white transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="p-3 text-xs text-muted-foreground truncate">
              Link: {w.href}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Collection" : "New Collection"}</DialogTitle>
            <DialogDescription>This appears in the "Mayil World" section of the homepage.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Banner Image URL (Landscape)</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.bannerImage} onChange={(e) => setForm({ ...form, bannerImage: e.target.value })} placeholder="https://..." required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Link</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} placeholder="/collections?world=wedding" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order</label>
              <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="luxury-button" disabled={isPending}>
                {isPending ? "Saving..." : editing ? "Save Changes" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── BANNERS VIEW ─────────────────────────────────────────────────────────────

function BannersView({ banners, refetch }: { banners: HeroBanner[]; refetch: () => void }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HeroBanner | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", image: "", ctaText: "Shop Now", ctaHref: "/collections", active: true, order: 0 });

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", subtitle: "", image: "", ctaText: "Shop Now", ctaHref: "/collections", active: true, order: banners.length });
    setDialogOpen(true);
  };

  const openEdit = (item: HeroBanner) => {
    setEditing(item);
    setForm({ title: item.title, subtitle: item.subtitle, image: item.image, ctaText: item.ctaText, ctaHref: item.ctaHref, active: item.active, order: item.order ?? 0 });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      if (editing) {
        await updateFirebaseBanner(editing.id, form);
        toast.success("Updated!");
      } else {
        await addFirebaseBanner(form);
        toast.success("Created!");
      }
      setDialogOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      await deleteFirebaseBanner(id);
      toast.success("Deleted!");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed");
    }
  };

  const toggleActive = async (item: HeroBanner) => {
    try {
      await updateFirebaseBanner(item.id, { active: !item.active });
      toast.success(item.active ? "Deactivated" : "Activated");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light mb-2">Hero Banners</h1>
          <p className="text-muted-foreground">Manage the hero carousel shown at the top of the homepage</p>
        </div>
        <Button className="luxury-button" onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Add Banner
        </Button>
      </div>

      <div className="space-y-4">
        {banners.map((b) => (
          <div key={b.id} className="luxury-card border overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-64 shrink-0">
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-40 sm:h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=300&fit=crop"; }}
                />
              </div>
              <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{b.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${b.active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>
                      {b.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{b.subtitle}</p>
                  <p className="text-xs text-muted-foreground mt-1">CTA: "{b.ctaText}" → {b.ctaHref}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleActive(b)}>
                    {b.active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openEdit(b)}>
                    <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleDelete(b.id)}>
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="luxury-card border p-12 text-center">
            <Image className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-lg text-muted-foreground">No banners yet</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Add a hero banner to display at the top of the homepage</p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Banner" : "New Banner"}</DialogTitle>
            <DialogDescription>This appears in the hero carousel at the top of the homepage.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Button Text</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Button Link</label>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" value={form.ctaHref} onChange={(e) => setForm({ ...form, ctaHref: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Order</label>
                <input type="number" className="w-full border rounded-lg px-3 py-2 text-sm" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 rounded" />
                  <span className="text-sm">Active</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="luxury-button" disabled={isPending}>
                {isPending ? "Saving..." : editing ? "Save Changes" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── COUPONS VIEW ─────────────────────────────────────────────────────────────

function CouponsView({ coupons, refetch }: { coupons: Coupon[]; refetch: () => void }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState({ id: "", discountType: "percentage" as "percentage" | "fixed", discountValue: 0, active: true });

  const openNew = () => {
    setEditing(null);
    setForm({ id: "", discountType: "percentage", discountValue: 0, active: true });
    setDialogOpen(true);
  };

  const openEdit = (item: Coupon) => {
    setEditing(item);
    setForm({ id: item.id, discountType: item.discountType, discountValue: item.discountValue, active: item.active });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const code = form.id.toUpperCase().trim();
      if (!code) throw new Error("Coupon code cannot be empty");

      if (editing) {
        await updateFirebaseCoupon(editing.id, {
          discountType: form.discountType,
          discountValue: Number(form.discountValue),
          active: form.active
        });
        toast.success("Coupon updated successfully!");
      } else {
        await addFirebaseCoupon({
          id: code,
          discountType: form.discountType,
          discountValue: Number(form.discountValue),
          active: form.active
        });
        toast.success("Coupon created successfully!");
      }
      setDialogOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to save coupon");
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await deleteFirebaseCoupon(id);
      toast.success("Coupon deleted!");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete coupon");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light mb-2">Coupons</h1>
          <p className="text-muted-foreground">Create and manage discount codes for checkout</p>
        </div>
        <Button className="luxury-button" onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" /> Add Coupon
        </Button>
      </div>

      <div className="luxury-card overflow-x-auto border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 border-b border-border/50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Code</th>
              <th className="px-6 py-4 text-left font-semibold">Type</th>
              <th className="px-6 py-4 text-left font-semibold">Value</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4 font-bold uppercase tracking-wider text-[var(--brand)]">{c.id}</td>
                <td className="px-6 py-4 capitalize">{c.discountType === "percentage" ? "Percentage (%)" : "Fixed Amount (₹)"}</td>
                <td className="px-6 py-4 font-medium">
                  {c.discountType === "percentage" ? `${c.discountValue}%` : formatINR(c.discountValue)}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${c.active ? "bg-green-100 text-green-800 animate-pulse" : "bg-muted text-muted-foreground"}`}>
                    {c.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(c)}>
                    <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDelete(c.id)}>
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </Button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">No coupons found. Click "Add Coupon" to create one.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{editing ? "Edit Coupon" : "Add Coupon"}</DialogTitle>
            <DialogDescription>Create a discount code that customers can apply at checkout.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Coupon Code</label>
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm uppercase bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                placeholder="e.g. MAYIL10"
                required
                disabled={!!editing}
              />
              {editing && <p className="text-xs text-muted-foreground mt-1">Coupon code cannot be changed once created.</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Discount Type</label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value as any })}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Discount Value {form.discountType === "percentage" ? "(%)" : "(₹)"}
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.discountValue || ""}
                  onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  placeholder={form.discountType === "percentage" ? "10" : "150"}
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              Active (Available for use)
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" className="luxury-button" disabled={isPending}>
                {isPending ? "Saving..." : editing ? "Save Changes" : "Create Coupon"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── SETTINGS VIEW ────────────────────────────────────────────────────────────

function SettingsView({ settings, refetch }: { settings: any; refetch: () => void }) {
  const [isPending, setIsPending] = useState(false);
  const [form, setForm] = useState<{ itemCharges: { count: number; charge: number }[], freeThreshold: number }>({
    itemCharges: [{ count: 1, charge: 0 }],
    freeThreshold: 0
  });

  useEffect(() => {
    if (settings) {
      // Fallback for previous schema if baseCharge exists instead of itemCharges
      const charges = settings.itemCharges?.length 
        ? settings.itemCharges 
        : [{ count: 1, charge: settings.baseCharge ?? 0 }];
      
      setForm({
        itemCharges: charges.sort((a: any, b: any) => a.count - b.count),
        freeThreshold: settings.freeThreshold ?? 0
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      // Ensure it is sorted and valid before saving
      const validCharges = form.itemCharges
        .filter(c => c.count > 0 && c.charge >= 0)
        .sort((a, b) => a.count - b.count);

      if (validCharges.length === 0) {
        throw new Error("You must specify at least one valid item charge rule.");
      }

      await updateFirebaseDeliverySettings({
        itemCharges: validCharges,
        freeThreshold: Number(form.freeThreshold)
      });
      toast.success("Delivery settings updated successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to update settings");
    } finally {
      setIsPending(false);
    }
  };

  const addChargeRow = () => {
    const nextCount = form.itemCharges.length > 0 
      ? Math.max(...form.itemCharges.map(c => c.count)) + 1 
      : 1;
    setForm({
      ...form,
      itemCharges: [...form.itemCharges, { count: nextCount, charge: 0 }]
    });
  };

  const updateChargeRow = (index: number, field: 'count' | 'charge', value: number) => {
    const newCharges = [...form.itemCharges];
    newCharges[index] = { ...newCharges[index], [field]: value };
    setForm({ ...form, itemCharges: newCharges });
  };

  const removeChargeRow = (index: number) => {
    setForm({
      ...form,
      itemCharges: form.itemCharges.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-4xl font-light mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure delivery charges based on the number of items</p>
      </div>

      <div className="luxury-card p-6 border bg-card text-card-foreground">
        <h3 className="font-serif text-2xl mb-4 border-b pb-2">Delivery Charges Settings</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-muted-foreground">
                Item-Based Delivery Charges
              </label>
              <Button type="button" variant="outline" size="sm" onClick={addChargeRow}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Rule
              </Button>
            </div>
            
            <div className="bg-secondary/20 border rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                <div className="col-span-5">Number of Items (From)</div>
                <div className="col-span-5">Delivery Charge (₹)</div>
                <div className="col-span-2 text-center">Action</div>
              </div>
              
              {form.itemCharges.map((rule, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-5">
                    <input
                      type="number"
                      min="1"
                      required
                      value={rule.count || ""}
                      onChange={(e) => updateChargeRow(index, 'count', Number(e.target.value))}
                      className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="e.g. 1"
                    />
                  </div>
                  <div className="col-span-5">
                    <input
                      type="number"
                      min="0"
                      required
                      value={rule.charge || ""}
                      onChange={(e) => updateChargeRow(index, 'charge', Number(e.target.value))}
                      className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                      placeholder="e.g. 100"
                    />
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-9 p-0"
                      onClick={() => removeChargeRow(index)}
                      disabled={form.itemCharges.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-3">
                Rules apply to the specified quantity and any quantities above it, until the next higher rule. (e.g. Rule for 2 items will apply to 2 and 3 items if the next rule is for 4 items).
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Free Delivery Threshold (₹)
            </label>
            <input
              type="number"
              min="0"
              required
              value={form.freeThreshold || ""}
              onChange={(e) => setForm({ ...form, freeThreshold: Number(e.target.value) })}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="e.g. 2000 (Enter 0 to disable)"
            />
            <p className="text-xs text-muted-foreground mt-1">Orders with a subtotal above this amount will get free delivery. Enter 0 to disable free delivery.</p>
          </div>

          <div className="pt-2">
            <Button type="submit" className="luxury-button w-full" disabled={isPending}>
              {isPending ? "Saving..." : "Save Delivery Settings"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
