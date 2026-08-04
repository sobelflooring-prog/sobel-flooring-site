# Sobel Flooring

Landing page premium para venda e instalação de pisos, com foco em piso vinílico e conversão de pedidos de orçamento pelo WhatsApp.

## Recursos

- layout responsivo com prioridade para celular;
- hero WebGL com réguas de piso em geometria 3D real;
- experiência sticky de 320vh controlada pelo scroll;
- montagem das réguas em cinco fases, com movimento de câmera;
- calculadora de estimativa sem backend;
- mensagem dinâmica de orçamento para o WhatsApp;
- React Three Fiber, Drei e Framer Motion com suporte a `prefers-reduced-motion`;
- seções de serviços, processo, confiança, FAQ e chamadas para ação.

## Requisitos

- Node.js 22.13 ou superior;
- npm.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra o endereço exibido no terminal, normalmente `http://localhost:3000`.

## Validar a versão de produção

```bash
npm run build
npm test
```

## Valores da calculadora

- com instalação: R$ 100 por m²;
- sem instalação: R$ 70 por m².

Os valores são apenas uma estimativa inicial e podem variar após avaliação técnica.
