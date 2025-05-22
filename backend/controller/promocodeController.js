// Sample promo controller for validating promo codes
const validatePromoCode = async (req, res) => {
    try {
      const { promoCode } = req.body;
  
      // Check if the promo code exists in the database or predefined list
      const validPromoCodes = {
        "SAVE10": 5*2,   // Example promo codes with discount
        "SAVE20": 5*4,
        "SAVE50":10*5

      };
  
      if (validPromoCodes[promoCode]) {
        res.json({
          success: true,
          message: "Promo code applied successfully",
          discount: validPromoCodes[promoCode]   // Applying the discount
        });
      } else {
        res.json({
          success: false,
          message: "Invalid promo code"
        });
      }
    } catch (error) {
      console.error("Error validating promo code:", error);
      res.json({
        success: false,
        message: "Server error. Try again later."
      });
    }
  };
  
  export { validatePromoCode };
  