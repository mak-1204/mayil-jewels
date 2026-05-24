import PageLayout from "@/components/layout/PageLayout";
import { useShop } from "@/contexts/ShopContext";
import { formatINR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { WHATSAPP_NUMBER } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { addFirebaseOrder, validateFirebaseCoupon } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { useDeliverySettings } from "@/hooks/useDeliverySettings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Cart() {
  const { user } = useAuth();
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } =
    useShop();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isPending, setIsPending] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidating(true);
    setCouponError("");
    try {
      const coupon = await validateFirebaseCoupon(couponCode);
      if (coupon) {
        setAppliedCoupon(coupon);
        setCouponError("");
        toast.success(`Coupon "${coupon.id}" applied successfully!`);
      } else {
        setCouponError("Invalid or inactive coupon code.");
        setAppliedCoupon(null);
      }
    } catch (err: any) {
      console.error(err);
      setCouponError("Failed to validate coupon.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast.info("Coupon removed.");
  };

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === "percentage"
      ? Math.round((cartTotal * appliedCoupon.discountValue) / 100)
      : appliedCoupon.discountValue
    : 0;

  const discountedTotal = Math.max(0, cartTotal - discountAmount);

  const { settings: deliverySettings } = useDeliverySettings();
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const deliveryCharge = (() => {
    if (!deliverySettings || totalItemsCount === 0) return 0;
    
    // Check free threshold first
    const freeThreshold = deliverySettings.freeThreshold || 0;
    if (freeThreshold > 0 && cartTotal >= freeThreshold) {
      return 0;
    }

    // Support new schema (itemCharges array)
    if (deliverySettings.itemCharges && Array.isArray(deliverySettings.itemCharges) && deliverySettings.itemCharges.length > 0) {
      // Find the applicable rule by sorting descending (highest count first)
      const sortedCharges = [...deliverySettings.itemCharges].sort((a: any, b: any) => b.count - a.count);
      const applicableRule = sortedCharges.find((r: any) => totalItemsCount >= r.count);
      return applicableRule ? applicableRule.charge : 0;
    }
    
    // Fallback for old schema
    const baseCharge = deliverySettings.baseCharge || 0;
    const additionalCharge = deliverySettings.additionalItemCharge || 0;
    return baseCharge + (totalItemsCount - 1) * additionalCharge;
  })();

  const grandTotal = discountedTotal + deliveryCharge;

  useEffect(() => {
    if (user) {
      setCustomerName(user.name || "");
      setCustomerEmail(user.email || "");
    }
  }, [user]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      toast.error("Please fill in your Name and Phone number.");
      return;
    }
    setIsPending(true);

    try {
      await addFirebaseOrder({
        customerName,
        customerEmail: customerEmail || undefined,
        customerPhone: customerPhone || undefined,
        items: cartItems.map(({ product, quantity }) => ({
          productId: product.id,
          quantity,
          price: product.price,
          name: product.name,
        })),
        totalAmount: grandTotal,
        couponCode: appliedCoupon?.id || undefined,
        discountAmount: appliedCoupon ? discountAmount : undefined,
        deliveryCharge: deliveryCharge,
      } as any);

      const itemsList = cartItems
        .map(
          ({ product, quantity }, i) =>
            `${i + 1}. *${product.name}* (Qty: ${quantity}) - ${formatINR(product.price * quantity)}\n   Link: ${window.location.origin}/product/${product.id}`
        )
        .join("\n\n");

      const discountStr = appliedCoupon
        ? `\n*Coupon Applied:* ${appliedCoupon.id} (-${appliedCoupon.discountType === "percentage" ? `${appliedCoupon.discountValue}%` : formatINR(appliedCoupon.discountValue)})\n*Discount Amount:* -${formatINR(discountAmount)}`
        : "";

      const deliveryStr = deliveryCharge > 0
        ? `\n*Delivery:* ${formatINR(deliveryCharge)}`
        : `\n*Delivery:* Complimentary`;

      const message = `Hello Mayil Jewels! I would like to place an order for the following items:\n\n${itemsList}\n\n*Subtotal:* ${formatINR(cartTotal)}${discountStr}${deliveryStr}\n*Total Amount:* ${formatINR(grandTotal)}\n\n*My Details:*\nName: ${customerName}\nPhone: ${customerPhone}${customerEmail ? `\nEmail: ${customerEmail}` : ""}\n\nPlease let me know the payment and delivery details.`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      
      setCheckoutOpen(false);
      window.open(url, "_blank");
      toast.success("Redirecting to WhatsApp to complete your order!");
      clearCart();
    } catch (error) {
      console.error("Failed to log order inquiry:", error);
      toast.error("Could not log your inquiry. Attempting to open WhatsApp directly...");
      
      const itemsList = cartItems
        .map(
          ({ product, quantity }, i) =>
            `${i + 1}. *${product.name}* (Qty: ${quantity}) - ${formatINR(product.price * quantity)}\n   Link: ${window.location.origin}/product/${product.id}`
        )
        .join("\n\n");

      const discountStr = appliedCoupon
        ? `\n*Coupon Applied:* ${appliedCoupon.id} (-${appliedCoupon.discountType === "percentage" ? `${appliedCoupon.discountValue}%` : formatINR(appliedCoupon.discountValue)})\n*Discount Amount:* -${formatINR(discountAmount)}`
        : "";

      const deliveryStr = deliveryCharge > 0
        ? `\n*Delivery:* ${formatINR(deliveryCharge)}`
        : `\n*Delivery:* Complimentary`;

      const message = `Hello Mayil Jewels! I would like to place an order for the following items:\n\n${itemsList}\n\n*Subtotal:* ${formatINR(cartTotal)}${discountStr}${deliveryStr}\n*Total Amount:* ${formatINR(grandTotal)}\n\n*My Details:*\nName: ${customerName}\nPhone: ${customerPhone}${customerEmail ? `\nEmail: ${customerEmail}` : ""}\n\nPlease let me know the payment and delivery details.`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
      clearCart();
    } finally {
      setIsPending(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <PageLayout>
        <div className="container py-24 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/40 mb-6" />
          <h1 className="font-serif text-2xl mb-2">Your bag is empty</h1>
          <p className="text-muted-foreground mb-8">
            Discover exquisite jewellery crafted for every occasion
          </p>
          <Button asChild className="bg-[var(--brand)] hover:bg-[var(--brand-dark)]">
            <Link href="/collections">Continue Shopping</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container py-8 md:py-12">
        <h1 className="font-serif text-3xl mb-8">Shopping Bag</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-4 border-b border-border pb-6"
              >
                <Link
                  href={`/product/${product.id}`}
                  className="w-28 h-36 shrink-0 bg-secondary/30 rounded-sm overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${product.id}`}
                    className="font-medium hover:text-[var(--brand)] line-clamp-2"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.style}
                    {product.finish ? ` · ${product.finish}` : ""}
                  </p>
                  <p className="font-semibold text-[var(--brand)] mt-2">
                    {formatINR(product.price)}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border rounded-sm">
                      <button
                        type="button"
                        className="p-1.5 hover:bg-secondary"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm">{quantity}</span>
                      <button
                        type="button"
                        className="p-1.5 hover:bg-secondary"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="text-muted-foreground hover:text-destructive p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-sm p-6 bg-secondary/20 sticky top-32">
              <h2 className="font-medium mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatINR(cartTotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-700 font-medium animate-fade-in">
                    <span>Discount ({appliedCoupon.id})</span>
                    <span>-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  {deliveryCharge > 0 ? (
                    <span>{formatINR(deliveryCharge)}</span>
                  ) : (
                    <span className="text-green-700">Complimentary</span>
                  )}
                </div>
              </div>

              {/* Coupon Form */}
              <div className="mt-4 pt-4 border-t border-border/60">
                <label className="text-xs font-semibold uppercase text-muted-foreground block mb-2">Apply Coupon</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50/50 text-green-800 px-3 py-2 rounded-sm border border-green-200/60">
                    <div>
                      <span className="font-bold text-xs uppercase">{appliedCoupon.id}</span>
                      <span className="text-xs ml-1.5 font-medium">
                        (-{appliedCoupon.discountType === "percentage" ? `${appliedCoupon.discountValue}%` : formatINR(appliedCoupon.discountValue)})
                      </span>
                    </div>
                    <button type="button" onClick={handleRemoveCoupon} className="text-green-800 hover:text-red-700 font-bold text-xs transition-colors">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                      placeholder="e.g. MAYIL10"
                      className="flex-1 px-3 py-1.5 border rounded-sm text-sm uppercase focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleApplyCoupon}
                      disabled={isValidating}
                      className="bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white text-xs h-auto py-1 px-4 rounded-sm uppercase tracking-wider"
                    >
                      {isValidating ? "Validating..." : "Apply"}
                    </Button>
                  </div>
                )}
                {couponError && <p className="text-xs text-red-600 mt-1">{couponError}</p>}
              </div>

              <div className="flex justify-between font-semibold text-lg mt-4 pt-4 border-t border-border/60">
                <span>Total</span>
                <span className="text-[var(--brand)]">
                  {formatINR(grandTotal)}
                </span>
              </div>
              <Button
                className="w-full mt-6 h-12 bg-[var(--brand)] hover:bg-[var(--brand-dark)] rounded-sm uppercase tracking-wider text-xs"
                onClick={() => setCheckoutOpen(true)}
              >
                Checkout via WhatsApp
              </Button>
              <Button
                variant="ghost"
                className="w-full mt-2 text-sm"
                onClick={clearCart}
              >
                Clear bag
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Enter Checkout Details</DialogTitle>
            <DialogDescription>
              Please enter your contact details to complete the order via WhatsApp. We will log your inquiry so our support team can assist you.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCheckoutSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium uppercase text-muted-foreground">Full Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground"
                placeholder="e.g. Rahul Sharma"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium uppercase text-muted-foreground">Phone Number *</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground"
                placeholder="e.g. +91 9876543210"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium uppercase text-muted-foreground">Email Address (Optional)</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-accent bg-white text-foreground"
                placeholder="e.g. rahul@example.com"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setCheckoutOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="luxury-button" disabled={isPending}>
                {isPending ? "Connecting..." : "Open WhatsApp Order"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
