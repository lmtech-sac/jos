# Novo site — J.O.S Engenharia

Site institucional responsivo, feito em HTML/CSS/JS puro e pronto para hospedagem estática.

## Como visualizar

Abra `index.html` no navegador. Para testar como servidor local:

```bash
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Recursos incluídos

- Identidade visual baseada no preto/grafite, branco e vermelho da marca.
- Hero focado em posicionamento e orçamento.
- História, missão, visão, valores e objetivo.
- Serviços detalhados.
- Portfólio com filtros e lightbox.
- Processo de atendimento.
- Equipe.
- Credenciais institucionais.
- Formulário que monta mensagem e abre o WhatsApp.
- SEO básico, canonical e Schema.org.
- Layout mobile-first e menu responsivo.

## Observação sobre imagens

As imagens são carregadas a partir do acervo público atual da própria J.O.S Engenharia hospedado no Wix. Se o site for migrado definitivamente, recomenda-se baixar os arquivos originais da conta da empresa e substituir as URLs remotas por arquivos locais em `assets/images/`.

## Contato usado

O site oficial atual exibe `(73) 98239-2994`, por isso esse foi o telefone adotado nesta versão. Há fontes públicas que também associam `(73) 98124-2693` à empresa; valide qual número deve ficar definitivo antes da publicação.

## Premium polish — 24/08/2026
- Hero reconstruído com composição 3D em CSS e profundidade por movimento do mouse.
- Grid técnico/arquitetônico, glow, scan line e painéis de vidro.
- Cards com tilt 3D sutil em serviços, portfólio, equipe e formulário.
- Portfólio dark premium com lightbox e filtros.
- Seção Instagram com link oficial @jos.engenharia.
- Marquee de serviços, barra de progresso, header com blur e microinterações.
- Efeitos desativados/reduzidos automaticamente em touch e prefers-reduced-motion.
- Responsividade retrabalhada para celular e tablet.

## Atualização — sequência paramétrica por scroll
- A sequência anterior foi substituída pelo novo material paramétrico enviado.
- Foi usado o trecho coerente de construção, do frame 001 ao 110, evitando a parte do loop que desmonta o edifício novamente.
- Desktop: **110 WebPs em 1920×1080 / qualidade alta** (~10,4 MB), carregados progressivamente.
- Mobile: **110 WebPs em 1080 px** (~3,6 MB), escolhidos automaticamente em telas de até 760 px.
- A seção virou uma prancha arquitetônica clara/premium, para preservar o traço fino e o fundo branco do material.
- O efeito usa `canvas`, `requestAnimationFrame`, prefetch somente dos frames próximos e troca automática de assets conforme o tamanho da tela.
- Em `prefers-reduced-motion`, a página apresenta o estado final sem forçar animação.
- Frames desktop: `assets/frames/desktop/scene_001.webp` → `scene_110.webp`.
- Frames mobile: `assets/frames/mobile/scene_001.webp` → `scene_110.webp`.
