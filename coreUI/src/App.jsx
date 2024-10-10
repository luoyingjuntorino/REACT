import { useState } from "react";
import "@coreui/coreui/dist/css/coreui.min.css";
import {
  CNavbar,
  CContainer,
  CForm,
  CFormInput,
  CNavbarBrand,
  CButton,
} from "@coreui/react";

function App() {
  return (
    <>
      <div>
        <h1>Halo</h1>
        <CNavbar className="bg-body-tertiary">
          <CContainer fluid>
            <CNavbarBrand href="#">Navbar</CNavbarBrand>
            <CForm className="d-flex">
              <CFormInput type="search" className="me-2" placeholder="Search" />
              <CButton type="submit" color="success" variant="outline">
                Search
              </CButton>
            </CForm>
          </CContainer>
        </CNavbar>
      </div>
    </>
  );
}

export default App;
