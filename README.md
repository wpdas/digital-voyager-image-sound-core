# WAV File Header

Checar aqui: https://wiki.fileformat.com/audio/wav/

A header de um arquivo WAV leva 44 bytes;
Cada tom registrado pelo programa usa 176 bytes de informação (DIVISOR = 176 bytes, ZERO = 176 bytes, ONE = 176 bytes);

- Lendo o cabeçalho (gerado por este software)

Assim sendo, para se ler a Header (gerado por este software em ondas de bits), deve-se ler os 44 bytes do formato WAV a fim de ter o arquivo decodificado + 176 bytes x a quantidade de bits do `typeId`(8 bits). Ou seja: 44 + (176 x 8);

# Sobre

A ideia geral começou a partir do momento que o Disco de Ouro do Voyager foi assunto de interesse. Eu começei a tentar entender como os dados foram guardados e como poderiam ser interpretados. Bem, essa é uma versão diferente que se baseia em bits.

Padrão na arquitetura de escrita e leitura: CD's digitais. Colocam um divisor entre cada bit. O projeto inteiro trata apenas bits, isto é '0' e '1' literalmente.

## Principais Recursos

feature/Recorder:

- Este módulo é responsável por estruturar e filtrar os bits a serem processados e no fim, gerar um arquivo de audio WAV contendo uma frequência com manipulações no volume. O volume da frequência só registram 3 valores, são eles representados por 0, 1, DIVISOR. O divisor é o elemento que permite entender a pausa entre cada bit tornando possível entender que após cada pausa existe um novo bit de informação. Essa ideia foi baseada na forma que CD's digitais funcionam.

É possível passar a informação de Header a ser reistrado no arquivo a fim de saber como ser lido posteriormente.

feature/Reader:

- O Reader tem a função de ler o arquivo de audio WAV e extrair as informações da frequência/volume e converter cada onda em bit no valor de 0 ou 1. Os divisores são ignorados restando apenas os bits 0 e 1 no fim.

É possível solicitar a informação do Header do arquivo gerado. Para isso você deve chamar o método `loadFileHeaderTypeId(<diretorio para arquivo>)`, então, o Reader vai ler a posição definida para guardar os bits que correspondem ao `typeId` do arquivo. O dado do `typeId` retornado será do tipo numérico (number) e você pode usar o módulo `loadersTypesId.ts` para checar qual Loader deve ser usado para interpretar os bits.

feature/Loaders:

- São responsáveis por definir o tipo de leitor para cada arquivo. Cada um deve ter uma Header contendo informações de como interpretar os bits do arquivo a ser lido/escrito. O dado mais básico obrigatório é o parametro `typeId` que consome um total de 1 byte (8 bits). Assim sendo, o valor máximo em decimal para o typeId é de 256. É possível informar mais dados na header usando o segundo parametro no construtor da Header `additionalParams` passando um array de dados, neste caso, a ordem importa uma vez que a ordem de escrita também será a ordem esperada de leitura.

feature/loaders/utils/Header:

- Header deve ser usado para construir o cabeçalho de cada Loader.

/loadersTypesId

- O tipo de cada loader está guardado no arquivo `loadersTypesId.ts`. Todos os tipos devem ser guardados neste módulo no intuito de padronizar o projeto. No entanto, é possível apenas gerar arquivos de bits sem cabeçalho. Quando isso acontece, é necessário que o leitor anônimo saiba interpretar os bits.

## Loaders ( Usados para interpretar os bits em informação humana como texto, número, imagem, etc )

- DecimalNumber: O primeiro tipo de arquivo suportado pelo programa criado. Pode salvar números decimais convertidos em bits dentro de uma frequência de arquivo de audio WAV. Você pode ver como usar através dos testes na pasta 'tests/loaders/DecimalNumber.test.ts'.

## Helpers

feature/DecodedChunks:

- Este é um recurso que é usado para armazenar pedaço por pedaço de um arquivo e retornar os dados de bits.

feature/BitToneBuffer:

- Usado para tratar pedaços de buffer com o recurso de concatenação. Exemplo: BitToneBuffer.concat(list: Array<Buffer>);

## Como usar

O projeto tem diversos testes. Por hora, use-os como documentação. Esse conteúdo vai ser melhorado posteriormente.

## Roadmap

- Capacidade de ler bites em tempo real. Enquanto o audio está sendo tocado.
- Recorder deve passar um Loader type no segundo parametro? Ou continuar pedindo apenas o Header type?
