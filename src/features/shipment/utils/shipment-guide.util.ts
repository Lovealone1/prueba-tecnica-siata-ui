import type { Shipment } from "../types/shipment.types";

interface GuideNames {
  customerName: string;
  productName: string;
  originName: string;
}

export function generateShipmentGuide(shipment: Shipment, names: GuideNames) {
  const date = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Guía de Envío - ${shipment.guide_number}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f0f2f5;
            display: flex;
            justify-content: center;
            padding: 40px 20px;
            margin: 0;
            color: #1a1c1e;
        }

        .ticket {
            width: 100%;
            max-width: 650px;
            background: white;
            border-radius: 24px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.1);
            overflow: hidden;
            position: relative;
            border: 1px solid #e1e3e5;
        }

        .top-bar {
            height: 10px;
            background: #1b73cd;
        }

        .content {
            padding: 40px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }

        .logo-area .brand-img {
            height: 45px;
            width: auto;
        }

        .logo-area .tagline {
            font-size: 9px;
            font-weight: 800;
            color: #74777f;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin: 4px 0 0 0;
        }

        .guide-id {
            text-align: right;
        }

        .guide-id .label {
            font-size: 10px;
            font-weight: 800;
            color: #74777f;
            text-transform: uppercase;
        }

        .guide-id .number {
            font-size: 22px;
            font-weight: 900;
            color: #1a1c1e;
            margin: 0;
        }

        .divider {
            border-top: 2px dashed #e1e3e5;
            margin: 30px 0;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 40px;
        }

        .info-item .item-label {
            font-size: 10px;
            font-weight: 800;
            color: #74777f;
            text-transform: uppercase;
            margin-bottom: 6px;
            letter-spacing: 0.5px;
        }

        .info-item .item-value {
            font-size: 15px;
            font-weight: 700;
            color: #1a1c1e;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 100px;
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            background: #fdf2d0;
            color: #7d6400;
            border: 1px solid #f9e195;
        }

        .pricing-box {
            background: #f8f9fa;
            border-radius: 16px;
            border: 1px solid #e1e3e5;
            overflow: hidden;
            margin-bottom: 30px;
        }

        .pricing-header {
            display: flex;
            justify-content: space-between;
            padding: 12px 20px;
            border-bottom: 1px solid #e1e3e5;
            font-size: 10px;
            font-weight: 800;
            color: #74777f;
            text-transform: uppercase;
        }

        .pricing-rows {
            padding: 20px;
        }

        .pricing-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 14px;
        }

        .pricing-row:last-child {
            margin-bottom: 0;
        }

        .pricing-row .row-label {
            color: #44474e;
            font-weight: 500;
        }

        .pricing-row .row-value {
            font-weight: 700;
            color: #1a1c1e;
        }

        .pricing-row.discount .row-value {
            color: #1a8a3a;
        }

        .pricing-row.extra .row-value {
            color: #ba1a1a;
        }

        .total-banner {
            background: #1b73cd;
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .total-banner .total-label {
            font-size: 11px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .total-banner .total-value {
            font-size: 26px;
            font-weight: 900;
        }

        .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 10px;
        }

        .footer .meta-item .meta-label {
            font-size: 8px;
            font-weight: 800;
            color: #74777f;
            text-transform: uppercase;
        }

        .footer .meta-item .meta-value {
            font-size: 12px;
            font-weight: 700;
            color: #1a1c1e;
        }

        .timestamp {
            font-size: 9px;
            color: #74777f;
            font-style: italic;
        }

        .no-print {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 100;
        }

        .btn {
            background: #1b73cd;
            color: white;
            border: none;
            padding: 14px 28px;
            border-radius: 14px;
            font-weight: 800;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 10px 20px rgba(27, 115, 205, 0.3);
            transition: all 0.2s;
        }

        .btn:hover {
            background: #005fb8;
        }

        @media print {
            .no-print { display: none !important; }
            body { background: white; padding: 0; }
            .ticket { box-shadow: none; border: none; max-width: 100%; }
        }

        .scallop {
            display: flex;
            justify-content: space-between;
            padding: 0 10px;
            margin-top: -8px;
        }

        .scallop div {
            width: 16px;
            height: 16px;
            background: #f0f2f5;
            border-radius: 50%;
        }
        @media print {
            .scallop div { background: white; }
        }
    </style>
</head>
<body>
    <div class="no-print">
        <button class="btn" onclick="window.print()">Imprimir o Guardar PDF</button>
    </div>

    <div class="ticket">
        <div class="top-bar"></div>
        <div class="content">
            <div class="header">
                <div class="logo-area">
                    <img src="${window.location.origin}/logo.png" class="brand-img" alt="Logo" />
                    <p class="tagline">Sistema de Gestión Oficial</p>
                </div>
                <div class="guide-id">
                    <p class="label">Guía de Envío</p>
                    <p class="number">#${shipment.guide_number}</p>
                </div>
            </div>

            <div class="divider"></div>

            <div class="info-grid">
                <div class="left-col">
                    <div class="info-item" style="margin-bottom: 20px;">
                        <p class="item-label">Cliente</p>
                        <p class="item-value">${names.customerName}</p>
                    </div>
                    <div class="info-item" style="margin-bottom: 20px;">
                        <p class="item-label">Producto</p>
                        <p class="item-value">${names.productName}</p>
                    </div>
                    <div class="info-item">
                        <p class="item-label">Cantidad</p>
                        <p class="item-value">${shipment.product_quantity} Unidades</p>
                    </div>
                </div>
                <div class="right-col">
                    <div class="info-item" style="margin-bottom: 20px;">
                        <p class="item-label">Origen Operativo</p>
                        <p class="item-value">${names.originName}</p>
                    </div>
                    <div class="info-item" style="margin-bottom: 20px;">
                        <p class="item-label">Destino Final</p>
                        <p class="item-value">${shipment.dispatch_location} (${shipment.dispatch_continent})</p>
                    </div>
                    <div class="info-item">
                        <p class="item-label">Estado</p>
                        <p class="status-badge">${shipment.shipping_status}</p>
                    </div>
                </div>
            </div>

            <div class="pricing-box">
                <div class="pricing-header">
                    <span>Concepto Liquidación</span>
                    <span>Monto</span>
                </div>
                <div class="pricing-rows">
                    <div class="pricing-row">
                        <span class="row-label">Costo Base de Transporte</span>
                        <span class="row-value">$${shipment.base_price.toLocaleString()}</span>
                    </div>
                    <div class="pricing-row discount">
                        <span class="row-label">Descuento Aplicado (${shipment.discount_percentage}%)</span>
                        <span class="row-value">-$${(shipment.base_price - shipment.total_price).toLocaleString()}</span>
                    </div>
                    <div class="pricing-row extra">
                        <span class="row-label">Tarifa Logística Adicional</span>
                        <span class="row-value">+$${(shipment.applied_extra_fee || 0).toLocaleString()}</span>
                    </div>
                </div>
                <div class="total-banner">
                    <span class="total-label">Total Liquidado</span>
                    <span class="total-value">$${(shipment.total_price + (shipment.applied_extra_fee || 0)).toLocaleString()}</span>
                </div>
            </div>

            <div class="footer">
                <div style="display: flex; gap: 20px;">
                    ${shipment.vehicle_plate ? `
                    <div class="meta-item">
                        <p class="meta-label">Vehículo</p>
                        <p class="meta-value">${shipment.vehicle_plate}</p>
                    </div>` : ''}
                    ${shipment.fleet_number ? `
                    <div class="meta-item">
                        <p class="meta-label">N° Flota</p>
                        <p class="meta-value">${shipment.fleet_number}</p>
                    </div>` : ''}
                </div>
                <p class="timestamp">Generado: ${date}</p>
            </div>
        </div>
        <div class="scallop">
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        </div>
    </div>
</body>
</html>
  `;

  // Fallback to absolute manual open
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, "_blank");
  if (!win || win.closed || typeof win.closed === "undefined") {
    // If popup blocked or failed, use location.assign as last resort (not ideal as it leaves current page)
    // but better than nothing for a tester
    window.location.assign(url);
  }
}
