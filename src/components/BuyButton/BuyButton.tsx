import { FilePlusFill } from "react-bootstrap-icons";

interface BuyButtonProps {
  onClick: () => void;
}

export default function BuyButton({ onClick }: BuyButtonProps) {
  return (
    <FilePlusFill
      color="#008F39"
      size={24}
      onClick={onClick}
      onMouseEnter={() => {
        document.body.style.cursor = "pointer";
      }}
      onMouseLeave={() => {
        document.body.style.cursor = "default";
      }}
    />
  );
}
