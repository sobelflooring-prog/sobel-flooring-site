# Sobel Flooring

Landing page premium para venda e instalação de pisos vinílicos, com foco em conversão de pedidos de orçamento pelo WhatsApp.

## Recursos

- layout responsivo com prioridade para celular;
- hero WebGL com réguas de piso em geometria 3D;
- experiência de montagem controlada pelo scroll;
- sistema de piso aquecido em três camadas 3D;
- termostato interativo que altera temperatura, cor e brilho do cabo em tempo real;
- simulador de orçamento sem backend, com faixa de preço por sistema;
- mensagem dinâmica de orçamento oficial para o WhatsApp;
- seção institucional, avaliações, processo, confiança, FAQ e chamadas para ação;
- React Three Fiber, Drei e Framer Motion com suporte a `prefers-reduced-motion`.

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

## Valores do simulador

- Piso Colado 2 mm: base de R$ 150/m², faixa de R$ 140 a R$ 170/m²;
- Piso Colado 3 mm (Comercial): base de R$ 160/m², faixa de R$ 150 a R$ 175/m²;
- Piso Clicado 5 mm: base de R$ 200/m², faixa de R$ 190 a R$ 230/m².

As simulações são referências iniciais e não substituem o orçamento oficial.
