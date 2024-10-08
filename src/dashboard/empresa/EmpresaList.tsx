import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Empresa } from "../../entities/DTO/Empresa/Empresa";
import { EmpresaService } from "../../services/EmpresaService";
import { useAuth0Extended } from "../../Auth/Auth0ProviderWithNavigate";
import "./styles.css";
interface EmpresaListProps {
  refresh: boolean;
  onEditEmpresa: (empresa: Empresa) => void;
}

const EmpresaList: React.FC<EmpresaListProps> = ({
  refresh,
  onEditEmpresa,
}) => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { activeEmpresa, selectEmpresa } = useAuth0Extended();

  const fetchEmpresas = async () => {
    try {
      const empresasData = await EmpresaService.getAll();
      setEmpresas(empresasData);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, [refresh]);

  const handleCardClick = (empresaId: number) => {
    selectEmpresa(empresaId);
    navigate(`/sucursales`);
  };

  const handleStatusChange = async (empresa: Empresa, alta: boolean) => {
    try {
      if (empresa) {
        const updatedEmpresa = await EmpresaService.update(empresa.id, {
          ...empresa,
          alta,
        });
        setEmpresas(
          empresas.map((emp) => (emp.id === empresa.id ? updatedEmpresa : emp))
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  return (
    <Container>
      <h2>Empresas</h2>
      {error && <p>{error}</p>}
      <Row>
        {empresas.map((empresa) => (
          <Col key={empresa.id} sm={12} md={6} lg={4} className="mb-4">
            <Card
              className={
                activeEmpresa == String(empresa.id) ? "selected-card" : ""
              }
              onClick={() => {
                if (empresa.alta) {
                  handleCardClick(empresa.id);
                }
              }}
              style={{ backgroundColor: empresa.alta ? "white" : "darkgrey" }}
            >
              <Card.Img
                variant="top"
                src={
                  empresa.imagenes[0]
                    ? empresa.imagenes[0].url
                    : "https://via.placeholder.com/150"
                }
              />
              <Card.Body>
                <Card.Title>{empresa.nombre}</Card.Title>
                <Card.Text>
                  <strong>ID:</strong> {empresa.id} <br />
                  <strong>Razón Social:</strong> {empresa.razonSocial} <br />
                  <strong>CUIL:</strong> {empresa.cuil}
                </Card.Text>
                <Button
                  variant="warning"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditEmpresa(empresa);
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
                <DropdownButton
                  id="dropdown-basic-button"
                  title={empresa.alta ? "Alta" : "Baja"}
                  variant={empresa.alta ? "success" : "danger"}
                  className="ml-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Dropdown.Item
                    onClick={() => handleStatusChange(empresa, true)}
                  >
                    Alta
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleStatusChange(empresa, false)}
                  >
                    Baja
                  </Dropdown.Item>
                </DropdownButton>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default EmpresaList;
