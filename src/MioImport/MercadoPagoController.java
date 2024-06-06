package com.codellege.instrumentos.controller;


import com.codellege.instrumentos.Object.Pedido;
import com.codellege.instrumentos.Object.PreferenceMP;
import com.codellege.instrumentos.service.MercadoPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/MercadoPago")
public class MercadoPagoController {
    @Autowired
    private MercadoPagoService mercadoPagoService;


    @PostMapping("/crear_preference_mp")
    public PreferenceMP crearPreferenceMP(@RequestBody Pedido pedido) {
        try {
            PreferenceMP preferenceMP = mercadoPagoService.getPreferenciaIdMercadoPago(pedido);

            return preferenceMP;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}