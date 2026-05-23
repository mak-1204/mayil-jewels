import { useAuth } from "@/_core/hooks/useAuth";
import PageLayout from "@/components/layout/PageLayout";
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
} from "@/lib/firebase";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
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

type AdminTab = "dashboard" | "products" | "categories" | "inquiries";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  const { products, loading: productsLoading, refetch: refetchProducts } = useProducts();
  const { categories, loading: categoriesLoading, refetch: refetchCategories } = useCategories();
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
      <PageLayout>
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
      </PageLayout>
    );
  }

  const isLoading = productsLoading || ordersLoading || categoriesLoading;

  return (
    <PageLayout>
      <div className="flex-1 flex min-h-[calc(100vh-200px)]">
        {/* Mobile tab bar */}
        <div className="md:hidden flex border-b overflow-x-auto">
          {[
            { tab: "dashboard", label: "Dashboard", icon: BarChart3 },
            { tab: "products", label: "Products", icon: Package },
            { tab: "categories", label: "Categories", icon: LayoutGrid },
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
        <aside className="hidden md:flex w-64 bg-secondary/30 border-r border-border/50 flex-col">
          <div className="p-6 space-y-2">
            <h2 className="text-xl font-light">Admin Panel</h2>
            <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            {[
              { tab: "dashboard", label: "Dashboard", icon: BarChart3 },
              { tab: "products", label: "Products", icon: Package },
              { tab: "categories", label: "Categories", icon: LayoutGrid },
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

          <div className="p-4 border-t border-border/50">
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
        <main className="flex-1 overflow-auto">
          <div className="container py-8">
            {isLoading ? (
              <div className="flex justify-center items-center py-24">
                <Spinner className="w-8 h-8 text-[var(--brand)]" />
              </div>
            ) : (
              <>
                {activeTab === "dashboard" && <DashboardView products={products} orders={orders} categories={categories} />}
                {activeTab === "products" && <ProductsView products={products} categories={categories} refetchProducts={refetchProducts} />}
                {activeTab === "categories" && <CategoriesView categories={categories} refetchCategories={refetchCategories} />}
                {activeTab === "inquiries" && <InquiriesView orders={orders} fetchOrders={fetchOrders} />}
              </>
            )}
          </div>
        </main>
      </div>
    </PageLayout>
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
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
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
      <div className="luxury-card overflow-hidden border">
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
    weight: "",
    categoryId: "",
    metal: "Gold",
    purity: "22KT",
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
      weight: "",
      categoryId: categories[0]?.id || "",
      metal: "Gold",
      purity: "22KT",
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
      weight: product.weight ? String(product.weight) : "",
      categoryId: product.categoryId || categories[0]?.id || "",
      metal: product.metal || "Gold",
      purity: product.purity || "22KT",
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
      weight: formData.weight ? Number(formData.weight) : undefined,
      categoryId: formData.categoryId,
      categorySlug,
      metal: formData.metal as any,
      purity: formData.purity,
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

      <div className="luxury-card overflow-hidden border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 border-b border-border/50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-left font-semibold">Category</th>
              <th className="px-6 py-4 text-left font-semibold">Metal</th>
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
                  <td className="px-6 py-4 text-muted-foreground">{product.metal || "Gold"}</td>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-muted-foreground">Price (INR)</label>
                <input type="number" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground" placeholder="25000" />
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
                <label className="text-xs font-medium uppercase text-muted-foreground">Metal Type</label>
                <select value={formData.metal} onChange={(e) => setFormData({ ...formData, metal: e.target.value })} className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground">
                  <option value="Gold">Gold</option>
                  <option value="Diamond">Diamond</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Silver">Silver</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium uppercase text-muted-foreground">Purity</label>
                <input type="text" value={formData.purity} onChange={(e) => setFormData({ ...formData, purity: e.target.value })} className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground" placeholder="22KT" />
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

// ─── INQUIRIES VIEW ───────────────────────────────────────────────────────────

function InquiriesView({ orders, fetchOrders }: { orders: any[]; fetchOrders: () => void }) {
  const handleStatusChange = async (id: string, currentStatus: string) => {
    const statusMap: Record<string, string> = { pending: "contacted", contacted: "completed", completed: "cancelled", cancelled: "pending" };
    const nextStatus = statusMap[currentStatus] ?? "pending";
    try {
      await updateFirebaseOrderStatus(id, nextStatus);
      toast.success("Status updated successfully");
      fetchOrders();
    } catch (err: any) {
      toast.error(`Error: ${err.message || "Failed to update status"}`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-light mb-2">Customer Inquiries</h1>
        <p className="text-muted-foreground">View and manage customer orders logged during WhatsApp checkout</p>
      </div>

      <div className="luxury-card overflow-hidden border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 border-b border-border/50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Customer</th>
              <th className="px-6 py-4 text-left font-semibold">Contact</th>
              <th className="px-6 py-4 text-left font-semibold">Items</th>
              <th className="px-6 py-4 text-left font-semibold">Total</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Date</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((inquiry: any) => {
              const itemsList = Array.isArray(inquiry.items)
                ? inquiry.items.map((i: any) => `${i.name} (x${i.quantity})`).join(", ")
                : "No items";
              return (
                <tr key={inquiry.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-medium">{inquiry.customerName}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {inquiry.customerEmail && <div className="text-xs">{inquiry.customerEmail}</div>}
                    {inquiry.customerPhone && <div className="text-xs">{inquiry.customerPhone}</div>}
                    {!inquiry.customerEmail && !inquiry.customerPhone && <div className="text-xs">N/A</div>}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground truncate max-w-xs" title={itemsList}>{itemsList}</td>
                  <td className="px-6 py-4 font-semibold">{formatINR(Number(inquiry.totalAmount))}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      inquiry.status === "pending" ? "bg-yellow-100 text-yellow-700"
                      : inquiry.status === "contacted" ? "bg-blue-100 text-blue-700"
                      : inquiry.status === "completed" ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {new Date(inquiry.createdAt).toLocaleDateString()}{" "}
                    {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="outline" size="sm" onClick={() => handleStatusChange(inquiry.id, inquiry.status)}>
                      Cycle Status
                    </Button>
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">No inquiries found.</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
