import logo from "../../assets/images/Buen sabor logo 1.png";
import { FaTwitter, FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
export default function Footer() {
  return (
    <footer
      className="container border border-dark border-3"
      style={{ backgroundColor: "#FFB20E" }}
    >
      <div className="container p-2">
        <div className="row">
          <div className="col-lg-6 col-md-12 mb-4 mb-md-0">
            <div className="d-flex justify-content-start align-items-center">
              <img src={logo} alt="Cargando.." className="img-fluid" style={{ maxHeight: "100px" }} />
              <h4 className="fw-bold pt-2">¡GRACIAS POR ELEGIRNOS!</h4>
            </div>
          </div>

          <article className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <div>
              <h5 className="fw-bold">Contacto</h5>
            </div>
            <div className="d-flex align-items-center">
              <FaWhatsapp size={19} />
              <h5 style={{ margin: "0", marginLeft: "8px" }}>2615968435</h5>
            </div>

            <div className="mt-1">
              <h5>buensabor@gmail.com</h5>
            </div>
          </article>

          <article className="col-lg-3 col-md-6 mb-4 mb-md-0">
            <h5>Seguinos en nuestras redes</h5>
            <div className="pt-2">
              <FaInstagram size={35} className="mx-3" />
              <FaFacebook size={35} className="mx-3" />
              <FaTwitter size={35} className="mx-3" />
            </div>
          </article>
        </div>
      </div>
    </footer>
  );
}
