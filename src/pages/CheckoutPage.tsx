import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { clsx } from "clsx";
import { useGameDetails } from "../features/games/hooks/useGameDetails";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { formatCurrency } from "../utils/format";
import { useCheckout } from "../features/checkout/hooks/useCheckout";
import { useCart } from "../features/cart/CartContext";
import styles from "./CheckoutPage.module.css";

const CheckoutPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: game, isLoading } = useGameDetails(id);
  const { items: cartItems, clear: clearCart } = useCart();
  const { mutate: purchase, isPending } = useCheckout();
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const itemsToCheckout = useMemo(() => {
    if (id && game) {
      const hasOffer = game.isOffer && game.offerPrice !== undefined;
      return [
        {
          _id: game._id,
          title: game.title,
          price: hasOffer ? game.offerPrice ?? game.price : game.price,
          currency: game.currency,
          cover: game.assets?.cover,
        },
      ];
    }
    return cartItems;
  }, [id, game, cartItems]);

  const totalAmount = itemsToCheckout.reduce((acc, item) => acc + (item.price || 0), 0);

  if (isLoading && id) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>Loading Checkout...</div>
    );
  }

  if (!id && cartItems.length === 0) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <h2 className="text-gradient">Your cart is empty</h2>
        <Button onClick={() => navigate("/")} style={{ marginTop: "1rem" }}>
          Browse games
        </Button>
      </div>
    );
  }

  if (id && !game) {
    return <div style={{ padding: "4rem", textAlign: "center" }}>Game not found</div>;
  }

  const handlePurchase = () => {
    const ids = itemsToCheckout.map((item) => item._id);
    purchase(ids, {
      onSuccess: () => {
        if (!id) clearCart();
        // Invalidate queries to refetch data
        queryClient.invalidateQueries({ queryKey: ["library"] });
        queryClient.invalidateQueries({ queryKey: ["orders"] }); // Also refresh orders
        setShowSuccessModal(true);
      },
      onError: (error) => {
        console.error("Purchase failed:", error);
        alert("Purchase failed. Please try again.");
      },
    });
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/library");
  };

  return (
    <div className={styles.container}>
      <h1
        className="text-gradient"
        style={{ marginBottom: "2rem", textAlign: "center" }}
      >
        Checkout
      </h1>

      <Card>
        <div className={styles.summary}>
          <h3>Order Summary</h3>
          <div className={styles.productList}>
            {itemsToCheckout.map((item) => (
              <div key={item._id} className={styles.productRow}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <img
                    src={item.cover || "https://placehold.co/100x60/101010/FFF"}
                    alt={item.title}
                    style={{ width: "80px", borderRadius: "4px" }}
                  />
                  <span>{item.title}</span>
                </div>
                <span>
                  {item.price === 0
                    ? "Free"
                    : formatCurrency(item.price || 0, item.currency)}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.totalRow}>
            <span>Total</span>
            <span style={{ color: "var(--accent-primary)" }}>
              {totalAmount === 0
                ? "Free"
                : formatCurrency(totalAmount, itemsToCheckout[0]?.currency || "USD")}
            </span>
          </div>
        </div>

        <h3 style={{ marginBottom: "1rem" }}>Payment Method</h3>
        <div className={styles.paymentMethods}>
          <div
            className={clsx(styles.method, selectedMethod === "card" && styles.selected)}
            onClick={() => setSelectedMethod("card")}
          >
            Credit Card
          </div>
          <div
            className={clsx(styles.method, selectedMethod === "paypal" && styles.selected)}
            onClick={() => setSelectedMethod("paypal")}
          >
            PayPal
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <Button variant="ghost" onClick={() => navigate(-1)} disabled={isPending}>
            Cancel
          </Button>
          <Button style={{ flexGrow: 1 }} onClick={handlePurchase} isLoading={isPending}>
            Confirm Purchase
          </Button>
        </div>
      </Card>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.successIcon}>✔</div>
            <h2>Purchase Successful!</h2>
            <p>
              {itemsToCheckout.length === 1 ? (
                <>
                  <strong>{itemsToCheckout[0].title}</strong> has been added to your
                  library.
                </>
              ) : (
                <>
                  <strong>{itemsToCheckout.length}</strong> games have been added to your
                  library.
                </>
              )}
            </p>
            <Button onClick={handleCloseModal}>Go to Library</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
