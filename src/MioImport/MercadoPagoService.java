package com.codellege.instrumentos.service;

import com.codellege.instrumentos.Object.Pedido;
import com.codellege.instrumentos.Object.PreferenceMP;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.resources.preference.Preference;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class MercadoPagoService {
    public PreferenceMP getPreferenciaIdMercadoPago(Pedido pedido) {

// Agrega credenciales
        try {
            MercadoPagoConfig.setAccessToken("TEST-4348060094658217-052007-d8458fa36a2d40dd8023bfcb9f27fd4e-1819307913");
            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .id(String.valueOf(pedido.getId()))
                    .title(pedido.getTitulo())
                    .description("Pedido realizado desde el carrito de compras")
                    .pictureUrl("http://picture.com/instrumentos")
                    .categoryId("Instrumentos")
                    .quantity(1)
                    .currencyId("ARG")
                    .unitPrice(new BigDecimal(pedido.getTotalPedido()))
                    .build();
            List<PreferenceItemRequest> items = new ArrayList<>();
            items.add(itemRequest);

            PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                    .success("http://localhost:5173//success")
                    .failure("http://localhost:5173/failure")
                    .pending("http://localhost:5173/pending")
                    .build();

            PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                    .items(items)
                    .backUrls(backUrls)
                    .build();
            PreferenceClient client = new PreferenceClient();
            Preference preference = client.create(preferenceRequest);

            PreferenceMP mpPreference = new PreferenceMP();
            mpPreference.setStatusCode(preference.getResponse().getStatusCode());
            mpPreference.setId(preference.getId());


            return mpPreference;


        } catch (
                Exception e) {
            e.printStackTrace();
            return null;

        }

    }
}
