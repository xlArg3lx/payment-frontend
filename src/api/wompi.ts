export interface CardData {
  number: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  cardHolder: string;
}

export interface CardToken {
  id: string;
  brand: "VISA" | "MASTERCARD" | "AMEX" | "UNKNOWN";
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
}

export const wompiApi = {
  tokenizeCard: async (card: CardData): Promise<CardToken> => {
    const response = await fetch(`${import.meta.env.VITE_WOMPI_API_URL}/tokens/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_WOMPI_PUBLIC_KEY}`,
      },
      body: JSON.stringify({
        number: card.number,
        exp_month: card.expMonth,
        exp_year: card.expYear,
        cvc: card.cvc,
        card_holder: card.cardHolder,
      }),
    });

    if (!response.ok) {
      throw new Error("Error tokenizing card");
    }

    const data = await response.json();
    return {
      id: data.data.id,
      brand: data.data.brand,
      lastFour: data.data.last_four,
      expiryMonth: data.data.exp_month,
      expiryYear: data.data.exp_year,
    };
  },
};
