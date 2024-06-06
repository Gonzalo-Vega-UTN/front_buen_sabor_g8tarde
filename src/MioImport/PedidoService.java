package com.codellege.instrumentos.service;

import com.codellege.instrumentos.Object.DetallePedido;
import com.codellege.instrumentos.Object.Pedido;
import com.codellege.instrumentos.Object.Usuario;
import com.codellege.instrumentos.repository.PedidoRepository;
import com.codellege.instrumentos.repository.IUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PedidoService {
    private final PedidoRepository pedidoRepository;
    private final IUsuarioRepository usuarioRepository;

    private final InstrumentoService instrumentoService;

    @Autowired
    public PedidoService(PedidoRepository pedidoRepository, IUsuarioRepository usuarioRepository, InstrumentoService instrumentoService) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.instrumentoService = instrumentoService;
    }

    @Transactional
    public Pedido guardarPedido(Pedido pedido) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findByNombreUsuario(pedido.getUser().getNombreUsuario());
        if (usuarioOptional.isPresent()) {
            Usuario usuario = usuarioOptional.get();
            pedido.setUser(usuario);
            usuario.getPedidos().add(pedido);
            pedido.setTitulo("Compra n° "+usuario.getPedidos().size() + " del Usuario:"+usuario.getNombreUsuario());
            for (DetallePedido detalle : pedido.getPedidoDetalle()) {
                detalle.setPedido(pedido); // Asignar el pedido guardado
            }
            Pedido pedidoGuardado = pedidoRepository.save(pedido);
            // Actualizar la cantidad vendida del instrumento
            for (DetallePedido detalle : pedidoGuardado.getPedidoDetalle()) {
                instrumentoService.actualizarCantidadVendida(detalle.getInstrumento(), Math.toIntExact(detalle.getCantidad()));
            }

            return pedidoGuardado;
        } else {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
    }

    @Transactional(readOnly = true)
    public Optional<Pedido> obtenerPedidoPorId(Long id) {
        return pedidoRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Pedido> obtenerTodosPedidos() {
        return pedidoRepository.findAll();
    }

    @Transactional
    public void eliminarPedido(Long id) {
        pedidoRepository.deleteById(id);
    }


    public List<List<Object>> obtenerCantidadPedidosPorMesYAnio() {
        List<Object[]> resultados = pedidoRepository.obtenerCantidadPedidosPorMesYAnio();
        return resultados.stream()
                .map(r -> List.of(r[0], r[1]))
                .collect(Collectors.toList());
    }

    public List<List<Object>> obtenerCantidadPedidosPorInstrumento() {
        List<Object[]> resultados = pedidoRepository.obtenerCantidadPedidosPorInstrumento();
        return resultados.stream()
                .map(r -> List.of(r[0], r[1]))
                .collect(Collectors.toList());
    }

    public List<Pedido> obtenerPedidosPorRangoDeFechas(LocalDate fechaDesde, LocalDate fechaHasta) {
        return pedidoRepository.findByFechaBetween(fechaDesde, fechaHasta);
    }
}
