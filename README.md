# SHIMIZU · Portal V4.12

Atelier vivo de tinta, vento e papel. Evolução autoral do portfólio existente, mantendo as fotografias reais, os desenhos da artista, seis capítulos completos e o WhatsApp como contato principal.

Site: https://cristianlf23.github.io/shimizu-portal/?v=4.12

## Executar

Não exige instalação de pacotes. Node.js é usado apenas para o servidor local, verificação de sintaxe e build estático.

```text
npm start
npm run check
npm run build
```

Abra http://127.0.0.1:4177/?v=4.12. A pasta `dist` contém a versão estática. Use HTTP; abrir o HTML por `file://` não executa módulos. GitHub Pages publica a branch `main`.

## Experiência

- Entrada de 1,8 segundo a cada carregamento: selo, nome revelado pela tinta e rajada que descobre o portal e segue nas bandeiras. Movimento reduzido usa somente uma transição de opacidade de 160ms. Escape, Tab ou toque encerram a entrada imediatamente.

- Trabalhos desktop em uma composição central com largura limitada: título, fotografia completa, prévia clicável do próximo trabalho e galeria na faixa inferior. Ramos floridos entram pelas bordas com a base fora do enquadramento.

- Ramos de flores do próprio sistema visual preenchem as margens das dobras, sem novos desenhos de máscaras ou faixas de vento.

- Kaisei Tokumin nos títulos, Yuji Syuku na frase inicial e inscrição; IBM Plex Sans Condensed na interface e Bodoni Moda nos detalhes editoriais. Fontes locais.
- Portal com quatro bandeiras de tecido presas à viga, rajadas, pétalas, névoa, reflexos e reação sutil ao cursor. SOPRAR cria uma rajada e ondas na água.
- Nove tatuagens, miniaturas, setas, teclado e swipe. OLHAR DE PERTO abre a fotografia completa, com navegação e consulta contextual pelo WhatsApp.
- Retrato real e texto editorial sobre a relação entre desenho, observação e pele.
- Cinco etapas clicáveis do Processo, cada uma revelando uma imagem autêntica da artista ou de seu trabalho.
- Sete estudos disponíveis em dois conjuntos de folhas, com inclinação no cursor e visualização ampliada. Disponibilidade comercial sob consulta.
- Menu em gaveta, índice lateral no desktop, retorno de foco, Escape e atalhos de navegação. WhatsApp persistente na paleta vermelha do site.

Cada capítulo ocupa uma tela, com rolagem nativa e alinhamento ao término. Galerias usam o eixo horizontal. O explorador de arte é um diálogo sobre o capítulo atual e conserva sua posição ao fechar. Não há troca de página, autoplay da galeria, rolagem virtual. Wheel/touch só ficam suspensos durante a entrada, por no máximo 3,6 segundos se os módulos falharem; depois a rolagem é nativa.

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
node qa/v4.12-qa.mjs
node qa/desktop-v4.12-behavior.mjs
node qa/branches-v4.12.mjs
node qa/mobile-v4.12.mjs
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


## V4.12: composição desktop

Trabalhos tem uma área central limitada a 1440 px, com título, fotografia completa e uma prévia clicável do próximo trabalho. A galeria ocupa toda a faixa inferior e mostra cerca de sete miniaturas nas telas grandes e cinco nas menores. Contador, setas e ampliação continuam disponíveis. Os ramos partem das bordas com a base fora do enquadramento. Artista mostra o gesto e o estúdio, com inscrição menor. Processo usa uma mesa de materiais em escalas distintas, preservando as cinco etapas clicáveis. Disponíveis reúne instrução, contador de folhas e ação, com composição assimétrica próxima ao texto. Contato tem foto reenquadrada, rodapé mais simples e WhatsApp persistente compacto nessa dobra. A abertura mantém a cena, com convite de vento refinado.

Ajustes de layout restritos a desktop acima de 1000 px. Mobile preserva a composição anterior, a pintura fixa e as exceções de sobreposição autorizadas. Sem novas dependências. Verificação: qa/v4.12-qa.mjs, qa/mobile-v4.12.mjs e qa/desktop-v4.12-behavior.mjs.

## V4.12: ritual de entrada

A cada abertura ou recarga real, o selo é estampado, o nome surge com uma máscara e um traço de tinta, e uma rajada abre a camada escura. O vento segue na cena e nas bandeiras enquanto a frase da Home aparece. A sequência dura aproximadamente1,8s; não se repete durante navegação entre capítulos ou restauração do histórico. Hashes diretos continuam no capítulo solicitado.

Escape, Tab e toque encerram a entrada. Movimento reduzido recebe somente fade de160ms. Conteúdo é carregado em paralelo; temporizadores independentes evitam bloqueio se o módulo ou a timeline falhar. Sem JavaScript a camada decorativa permanece oculta. Arquivos: `src/entrance.js`, `src/entrance.css`, bootstrap defensivo em `index.html` e sincronização de revelação em `src/atelier.js`. Verificação específica: `qa/entrance-v4.12.mjs`; evidências na entrega.
