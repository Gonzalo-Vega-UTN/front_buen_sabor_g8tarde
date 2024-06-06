package com.codellege.instrumentos.controller;

import com.codellege.instrumentos.Object.Pedido;
import com.codellege.instrumentos.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    @Autowired
    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping("/guardar")
    public ResponseEntity<Long> guardarPedido(@RequestBody Pedido pedido) {
        try {
            Pedido nuevoPedido = pedidoService.guardarPedido(pedido);
            return ResponseEntity.ok(nuevoPedido.getId());
        } catch (Exception e) {
            System.err.println("Error al guardar el pedido: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(-1L); // Retorna -1 en caso de error
        }
    }

    @GetMapping("/traer/")
    public ResponseEntity<List<Pedido>> obtenerTodosLosPedidos() {
        List<Pedido> pedidos = pedidoService.obtenerTodosPedidos();
        return new ResponseEntity<>(pedidos, HttpStatus.OK);
    }

    @GetMapping("/traer/{id}")
    public ResponseEntity<Pedido> obtenerPedidoPorId(@PathVariable("id") Long id) {
        return pedidoService.obtenerPedidoPorId(id)
                .map(pedido -> new ResponseEntity<>(pedido, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/GraficoBarra")
    public List<List<Object>> obtenerGraficoBarra() {
        return pedidoService.obtenerCantidadPedidosPorMesYAnio();
    }

    @GetMapping("/GraficoTorta")
    public List<List<Object>> obtenerGraficoTorta() {
        return pedidoService.obtenerCantidadPedidosPorInstrumento();
    }
}
