import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"; // Importa useHistory desde React Router

interface Props {
  preferenceId: string;
}

function CheckoutMP({ preferenceId }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    initMercadoPago("TEST-41b327fc-a375-4756-a0af-e30b0344a817", {
      locale: "es-AR",
    });
    if (preferenceId && preferenceId !== "") {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [preferenceId]);


  return (
    <div>
      <div className={isVisible ? "divVisible" : "divInvisible"}>
        <Wallet
          initialization={{ preferenceId: preferenceId, redirectMode: "modal" }}
          customization={{ texts: { valueProp: "smart_option" } }}
          
        />
      </div>
    </div>
  );
}
export default CheckoutMP;
