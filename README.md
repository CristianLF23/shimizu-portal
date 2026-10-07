# SHIMIZU · Portal V3.0

Refatoração visual do mesmo projeto a partir do novo mockup mobile de 07/10/2026. Seis composições de uma tela cada, em uma única página vertical contínua. Versões anteriores preservadas nas entregas.

## Abrir

Sem instalar pacotes. Requer Node.js apenas para servir localmente.

```text
npm start
```

Abra http://127.0.0.1:4177/?v=3.0. Se o servidor já estiver rodando, basta atualizar o navegador.

```text
npm run check
npm run build
node qa/v3-qa.mjs
```

Site online: https://cristianlf23.github.io/shimizu-portal/. Publicado pelo GitHub Pages a partir da branch main. A pasta dist contém os arquivos estáticos para outras hospedagens. Abrir index.html por file:// não executa os módulos; use o servidor HTTP acima.

## Navegação

A rolagem vertical passa entre seis dobras completas: Home, Trabalhos, A artista, Processo, Disponíveis e Contato. Cada seção ocupa exatamente 100dvh com fallback 100svh e alinhamento nativo de scroll; nenhuma exige scroll vertical interno. O rodapé faz parte de Contato. Papéis da Home são cenográficos, sem texto de menu ou interatividade.

Trabalhos preserva nove fotografias reais: imagem dominante, três detalhes visíveis por vez, sequência horizontal, seleção, teclado e swipe. Controles textuais de carrossel e indicador lateral foram removidos. Disponíveis apresenta quatro estudos originais como folhas físicas; o botão alterna para os três restantes na mesma dobra. A rolagem horizontal também funciona sem JavaScript. As folhas abrem seus arquivos originais. A disponibilidade comercial deve ser confirmada com a artista.

O menu contém o controle de pausa do movimento. Movimento reduzido desativa vento, partículas e câmera; a composição permanece. Não há interceptação de wheel/touch, pin ou transição entre páginas. O único canal de orçamento é o Instagram real @shimizumo; nenhum envio automático de mensagem.

## O que foi reaproveitado

Mesma stack HTML/CSS/ES modules, fonte Cormorant Garamond local, fotografias e desenhos em WebP, dados do portfólio, modelo físico do vento mais contido, servidor e build sem dependências. A lógica de modal, bloqueio de body e pergaminhos como navegação foi removida.

## Editar

- index.html: estrutura semântica, textos e narrativa contínua.
- styles.css: enquadramentos desktop/mobile, materialidade, proporções e capítulos.
- src/content.js: obras, descrições e repertório.
- src/app.js: direção do scroll, galeria, menu e âncoras.
- src/wind.js: intensidade, turbulência, mola, amortecimento, paralaxe e partículas.
- assets/art: imagens reais fornecidas.
- assets/torii-cinematic.webp e assets/torii-cinematic-mobile.webp: cenários cinematográficos ilustrativos horizontal e vertical.
- assets/plum-branch.webp: detalhe botânico decorativo com transparência.
- qa/artifacts-v3: evidências, comparação visual e capturas da V3.
- project-docs: decisões, proveniência e limitações.

## Fidelidade e conteúdo

O novo blueprint codex-clipboard-10c40256 define as seis composições mobile. A correção mais recente do usuário exige uma tela inteira por dobra e supera o min-height flexível do brief. Preto, fotografia dominante, serif editorial, UI contida e Processo claro como sketchbook. Composição própria para desktop e celular deitado. Os estudos reais aparecem em HTML sobre o cenário cinematográfico, sem tatuagens fictícias atribuídas à artista.

Não foram inventados endereço, preços, biografia, premiações, clientes ou depoimentos. O retrato principal usa a segunda fotografia real enviada em 07/10/2026, preparando a máquina. As outras fotos entram em Processo e no cotidiano do estúdio. A V3 apenas reduz os rascunhos editoriais existentes, sem inventar nova copy ou fatos comerciais. Textos continuam sujeitos a revisão pela artista. O tratamento negativo foi removido; os desenhos aparecem no papel original. A galeria inclui a nova foto do tigre colorido.

Fontes sob SIL OFL em assets/fonts/OFL.txt. Não há serviços externos, analytics, CMS, coleta de dados ou áudio em tempo de execução. A conversão abre apenas o Instagram. Cenário ilustrativo: a silhueta anônima não representa Shimizu, e a paisagem não representa o estúdio. O ramo decorativo não é flash da artista. Processo usa a foto real de desenho, pincel e tinta; não foi fabricada fotografia dela desenhando.

A validação automatizada usa Chromium local. Safari real, aparelhos físicos e taxa medida de 60 fps não estão certificados.




