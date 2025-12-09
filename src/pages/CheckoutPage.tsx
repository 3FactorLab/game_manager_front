import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGameDetails } from "../features/games/hooks/useGameDetails";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { formatCurrency } from "../utils/format";
import { useCheckout } from "../features/checkout/hooks/useCheckout";
import styles from "./CheckoutPage.module.css";
import { clsx } from "clsx";

const CheckoutPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: game, isLoading } = useGameDetails(id);
  const { mutate: purchase, isPending } = useCheckout();
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (isLoading)
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        Loading Checkout...
      </div>
    );
  if (!game)
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>Game not found</div>
    );

  const hasOffer = game.isOffer && game.offerPrice !== undefined;
  const finalPrice = hasOffer ? game.offerPrice : game.price;

  const handlePurchase = () => {
    purchase(game._id, {
      onSuccess: () => {
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
          <div className={styles.productRow}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <img
                src={
                  game.assets?.cover || "https://placehold.co/100x60/101010/FFF"
                }
                alt={game.title}
                style={{ width: "80px", borderRadius: "4px" }}
              />
              <span>{game.title}</span>
            </div>
            <span>{formatCurrency(finalPrice || 0, game.currency)}</span>
          </div>

          <div className={styles.totalRow}>
            <span>Total</span>
            <span style={{ color: "var(--accent-primary)" }}>
              {formatCurrency(finalPrice || 0, game.currency)}
            </span>
          </div>
        </div>

        <h3 style={{ marginBottom: "1rem" }}>Payment Method</h3>
        <div className={styles.paymentMethods}>
          <div
            className={clsx(
              styles.method,
              selectedMethod === "card" && styles.selected
            )}
            onClick={() => setSelectedMethod("card")}
          >
            Credit Card
          </div>
          <div
            className={clsx(
              styles.method,
              selectedMethod === "paypal" && styles.selected
            )}
            onClick={() => setSelectedMethod("paypal")}
          >
            PayPal
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            style={{ flexGrow: 1 }}
            onClick={handlePurchase}
            isLoading={isPending}
          >
            Confirm Purchase
          </Button>
        </div>
      </Card>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.successIcon}>✓</div>
            <h2>Purchase Successful!</h2>
            <p>
              <strong>{game.title}</strong> has been added to your library.
            </p>
            <Button onClick={handleCloseModal}>Go to Library</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
