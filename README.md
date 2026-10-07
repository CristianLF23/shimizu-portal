# SHIMIZU · Portal V2.1

Refatoração do projeto original para uma experiência de rolagem vertical contínua, seguindo o novo briefing de 07/10/2026. V1 preservada na entrega anterior.

## Abrir

Sem instalar pacotes. Requer Node.js apenas para servir localmente.

```text
npm start
```

Abra http://127.0.0.1:4177/?v=2.1. Se o servidor já estiver rodando, basta atualizar o navegador.

```text
npm run check
npm run build
node qa/run-qa.mjs
```

Site online: https://cristianlf23.github.io/shimizu-portal/. Publicado pelo GitHub Pages a partir da branch main. A pasta dist contém os arquivos estáticos para outras hospedagens. Abrir index.html por file:// não executa os módulos; use o servidor HTTP acima.

## Navegação

A página agora rola normalmente. Os três papéis do torii são objetos cenográficos: não são links nem botões. O primeiro percurso de scroll aproxima a cena, passa um papel pela câmera e revela a primeira tatuagem. A navegação superior usa âncoras reais.

Trabalhos, A artista, Processo, Oriental e Contato compõem uma única página, com alturas e arranjos próprios. Trabalhos tem anterior/próximo, seleção por miniatura, teclado e gesto horizontal. Oriental permite trocar a arte ampliada pelos pequenos estudos. O único CTA de orçamento aponta para o perfil real @shimizumo. Não envia mensagem automaticamente.

O rodapé permite pausar o vento. A preferência de movimento reduzido desativa câmera, passagem, partículas e retenção da cena. O scroll continua nativo, sem interceptação de wheel/touch e sem inércia artificial. Todos os capítulos essenciais existem em HTML mesmo sem JavaScript.

## O que foi reaproveitado

Mesma stack HTML/CSS/ES modules, fonte Cormorant Garamond local, fotografias e desenhos em WebP, dados do portfólio, modelo físico do vento, servidor e build sem dependências. A lógica de modal, bloqueio de body e pergaminhos como navegação foi removida.

## Editar

- index.html: estrutura semântica, textos e narrativa contínua.
- styles.css: enquadramentos desktop/mobile, materialidade, proporções e capítulos.
- src/content.js: obras, descrições e repertório.
- src/app.js: direção do scroll, galeria, menu e âncoras.
- src/wind.js: intensidade, turbulência, mola, amortecimento, paralaxe e partículas.
- assets/art: imagens reais fornecidas.
- assets/torii-v2.webp e assets/torii-mobile.webp: cenários ilustrativos.
- qa/artifacts-fidelity: evidências e capturas da V2.
- project-docs: decisões, proveniência e limitações.

## Fidelidade e conteúdo

Referência 01 define arquitetura, ordem e continuidade; Referência 02 refina recortes, contrastes e tipografia. O cenário foi refeito para camadas funcionais. Nenhuma tatuagem gerada das pranchas foi atribuída à artista.

Não foram inventados endereço, preços, biografia, premiações, clientes ou depoimentos. A imagem da artista vem do screenshot real do perfil segurando um estudo. A pose de desenhar mostrada no mockup não foi fabricada. Para equivalência fotográfica exata e maior nitidez faltam os arquivos originais dessas fotos. O tratamento de linhas no capítulo Oriental é decorativo; as obras fotografadas na galeria mantêm suas cores.

Fontes sob SIL OFL em assets/fonts/OFL.txt. Não há serviços externos, analytics, CMS, coleta de dados ou áudio em tempo de execução. A conversão abre apenas o Instagram. Cenário ilustrativo, sem alegação de representar o local de trabalho real.

A validação automatizada usa Chromium local. Safari real, aparelhos físicos e taxa medida de 60 fps não estão certificados.



