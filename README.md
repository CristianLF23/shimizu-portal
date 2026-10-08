# SHIMIZU · Portal V4.6

Atelier vivo de tinta, vento e papel. Evolução autoral do portfólio existente, mantendo as fotografias reais, os desenhos da artista, seis capítulos completos e o WhatsApp como contato principal.

Site: https://cristianlf23.github.io/shimizu-portal/?v=4.6

## Executar

Não exige instalação de pacotes. Node.js é usado apenas para o servidor local, verificação de sintaxe e build estático.

```text
npm start
npm run check
npm run build
```

Abra http://127.0.0.1:4177/?v=4.6. A pasta `dist` contém a versão estática. Use HTTP; abrir o HTML por `file://` não executa módulos. GitHub Pages publica a branch `main`.

## Experiência

- Bodoni Moda normal e itálica nos títulos; IBM Plex Sans Condensed na interface; Cormorant em detalhes editoriais. Fontes locais.
- Portal com quatro bandeiras de tecido presas à viga, rajadas, pétalas, névoa, reflexos e reação sutil ao cursor. SOPRAR cria uma rajada e ondas na água.
- Nove tatuagens, miniaturas, setas, teclado e swipe. OLHAR DE PERTO abre a fotografia completa, com navegação e consulta contextual pelo WhatsApp.
- Retrato real e texto editorial sobre a relação entre desenho, observação e pele.
- Cinco etapas clicáveis do Processo, cada uma revelando uma imagem autêntica da artista ou de seu trabalho.
- Sete estudos disponíveis em dois conjuntos de folhas, com inclinação no cursor e visualização ampliada. Disponibilidade comercial sob consulta.
- Menu em gaveta, índice lateral no desktop, retorno de foco, Escape e atalhos de navegação. WhatsApp persistente na paleta vermelha do site.

Cada capítulo ocupa uma tela, com rolagem nativa e alinhamento ao término. Galerias usam o eixo horizontal. O explorador de arte é um diálogo sobre o capítulo atual e conserva sua posição ao fechar. Não há troca de página, autoplay da galeria, interceptação de wheel/touch ou rolagem virtual.

O menu permite pausar os efeitos. Movimento reduzido, aba oculta e saída da Home interrompem a cena animada. A atmosfera usa Canvas 2D, DPR limitado a 1,5 e desenho reduzido para aproximadamente 30 atualizações/s no celular. Sem WebGL, áudio, analytics, formulário, CMS ou chamadas externas em tempo de execução.

## Conteúdo e direitos

As nove tatuagens, sete desenhos e fotografias da artista vieram dos arquivos fornecidos pelo usuário. O retrato principal é a segunda foto enviada, preparando a máquina. Os textos em primeira pessoa são rascunhos editoriais autorizados e sujeitos à revisão da artista; não inventam datas, credenciais, preços, endereço, depoimentos ou fatos de trajetória.

O cenário cinematográfico e o ramo botânico são ilustrativos e decorativos. A silhueta não representa Shimizu; a paisagem não representa o estúdio. Os desenhos e tatuagens nunca foram substituídos por arte gerada.

WhatsApp confirmado: +55 11 95371 7745. Instagram: https://www.instagram.com/shimizumo/. Os links abrem a conversa; nenhuma mensagem é enviada automaticamente.

Fontes sob SIL Open Font License, com licenças em `assets/fonts`. GSAP 3.15.0 distribuído localmente sob a licença padrão indicada em `assets/vendor/GSAP-LICENSE.txt`, preservando o cabeçalho original. Nenhum pacote pago ou serviço externo foi contratado.

## Arquivos principais

- `index.html`: conteúdo semântico, navegação, controles e diálogo.
- `styles.css`: estrutura, enquadramentos e capítulos existentes.
- `src/atelier.css` e `src/fonts.css`: direção V4, tipografia e adaptação responsiva.
- `src/app.js`: rolagem, galerias, gaveta e âncoras.
- `src/atelier.js`: revelações, explorador de arte e etapas interativas.
- `src/atmosphere.js`: névoa, reflexos e ondas de água.
- `src/ink.js`: desenho original a pincel, formado em seis etapas.
- `src/wind.js` e `src/cloth.js`: vento, pétalas e malha física das bandeiras.
- `src/content.js`: obras, descrições e contato.
- `assets/art`: arquivos reais fornecidos.

## Verificação

O pacote de entrega inclui `qa`, `project-docs`, relatórios e capturas. Esses arquivos são ignorados no repositório público.

```text
node qa/v4.2-qa.mjs
node qa/ink-safe-qa.mjs
```

O primeiro roteiro confere 13 tamanhos entre 320 e 1920 px, seis capítulos, imagens, sobreposições, galerias, toque, teclado, histórico, resize, menu, WhatsApp, movimento reduzido e conteúdo sem JavaScript. O segundo verifica a pintura progressiva, avanço e retorno das etapas, pausa, menu, diálogo e movimento reduzido. Os relatórios de execução acompanham a entrega.

Verificação em Chromium local por CDP, pois a ponte do navegador integrado estava indisponível. Safari real, aparelhos físicos e desempenho de 60 fps não estão certificados. Sem JavaScript, conteúdo e links reais continuam acessíveis; os efeitos e o explorador ampliado são melhorias progressivas.

## Referências de direção

Referências pesquisadas antes da implementação, usadas para princípios de ritmo, materialidade e tipografia, sem copiar código, assets ou composição:

- https://www.awwwards.com/sites/takafumi-senda-portfolio
- https://tympanus.net/Development/MotionTrailAnimations/
- https://www.siteinspire.com/website/13644-iwonderu-studios

Os mockups e arquivos da artista fornecidos na conversa permanecem a principal referência de identidade.

## V4.1 · Desenho a pincel ao longo da visita

A referência adicional do usuário é um caderno com lanterna e telhados desenhados a pincel. Uma ilustração própria ocupa a margem inferior esquerda e recebe novas pinceladas em cada um dos seis capítulos: primeiro gesto, lanterna, telhado, segundo telhado, estrutura e ramo florido com selo. Traços têm pressão variável, cerdas separadas e falhas de pigmento. A mudança de dobra preserva o desenho; voltar reduz à etapa anterior. O salto direto por menu completa o que veio antes e anima somente a etapa atual. No Processo, a cor muda para carvão.

A cena fica estática com pausa manual ou movimento reduzido e desaparece durante menu/visualizador; aba oculta interrompe execução. Arte original decorativa, não trabalho da tatuadora. Sem biblioteca ou asset novo. Implementação: src/ink.js, integrado ao ciclo existente em src/atelier.js, canvas decorativo em index.html e posicionamento em src/atelier.css. A versão continua com seis dobras e os mesmos contatos e obras.

## V4.2 · Desenho discreto nos espaços livres

Orientação final do usuário: o desenho mantém o tamanho discreto da versão publicada, preserva fotos, botões e textos e não aparece na abertura. A pintura começa em Trabalhos e progride em cinco etapas de aproximadamente seis segundos. Posição escolhida em cada capítulo a partir dos espaços livres, considerando as marcas reais de lanterna, telhados e ramo. Recortes de segurança garantem que não haja tinta sobre fotografias, alvos clicáveis e linhas de texto.

Escalas máximas mantidas em 0.43 no celular e 0.68 no desktop, com redução proporcional em telas baixas. Marfim suave em capítulos escuros e carvão no Processo. Sem mudanças de conteúdo, fotografias, estrutura ou contatos. A opção de pausa e o movimento reduzido mostram a etapa estática; menu e visualizador interrompem o desenho.

O roteiro qa/ink-safe-qa.mjs verifica ausência de tinta nas fotos, nos controles e nos textos visíveis, abertura sem desenho, tamanho discreto, cinco etapas lentas, retorno, menus, visualizador, reduced motion e mudança horizontal dos disponíveis. A proteção é aferida por leitura dos pixels do canvas, complementada pelas capturas representativas.


## V4.3: desenho com posição fixa

A pintura mantém o mesmo canto inferior esquerdo em todos os capítulos, com escala responsiva discreta. A abertura permanece sem desenho. Cada capítulo acrescenta uma etapa em aproximadamente seis segundos; no Processo, pilares e um segundo telhado aparecem com tinta escura sobre o fundo claro.

Uma pequena margem com transição suave nos fundos fotográficos recebe a pintura. Galerias, botões, fotografias visíveis e linhas de texto permanecem protegidos. A inscrição da artista foi afastada desse canto no desktop. A posição só muda se o tamanho da janela mudar.

Arquivos desta revisão: `src/ink.js`, `src/atelier.css`, `index.html` e versões dos módulos. Verificação: `qa/ink-fixed-qa.mjs` para posição constante, pintura do Processo, sobreposição e pausa; `qa/v4.3-qa.mjs` para navegação e responsividade. Evidências e limitações em `project-docs/V4.3_VERIFICATION.md` na entrega.

## V4.4 mobile
Pinceladas independentes no topo do Processo, folha decorativa removida da Artista e exceções explícitas de sobreposição: Processo acima dos elementos; Contato acima dos botões. Canvas sem captura de toque, posição e escala mantidas. Desktop preservado. QA em qa/mobile-v4.4.mjs.

V4.5: ramo superior no Processo mobile, crescimento da direita para esquerda e floração sequencial. Respeita pausa e movimento reduzido.

V4.6: Kaisei Tokumin400 nos títulos de seção e visualizador; Yuji Syuku400 na frase inicial e inscrição da artista. Fontes latinas locais com acentos e licença OFL. Sem itálico artificial, corpo e navegação preservados.
