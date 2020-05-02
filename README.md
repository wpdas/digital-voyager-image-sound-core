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

feature/Reader:

- O Reader tem a função de ler o arquivo de audio WAV e extrair as informações da frequência/volume e converter cada onda em bit no valor de 0 ou 1. Os divisores são ignorados restando apenas os bits 0 e 1 no fim.

É possível solicitar a informação do Header do arquivo gerado. Para isso você deve chamar o método `loadFileHeaderTypeId(<diretorio para arquivo>)`, então, o Reader vai ler a posição definida para guardar os bits que correspondem ao `typeId` do arquivo. O dado do `typeId` retornado será do tipo numérico (number) e você pode usar o módulo `loadersTypesId.ts` para checar qual Loader deve ser usado para interpretar os bits.

Foi implementado um recurso que força a correção na leitura dos bits. Hora ou outra foi notado em alguns arquivos gerados que alguns bits defeituosos apareceram na sequencia de bits lidos. Agora existe um algorítmo que analisa os bits e os corrige.

feature/Loaders:

- São responsáveis por definir o tipo de leitor para cada arquivo. Cada um deve ter uma Header contendo informações de como interpretar os bits do arquivo a ser lido/escrito. O dado mais básico obrigatório é o parametro `typeId` que consome um total de 1 byte (8 bits). Assim sendo, o valor máximo em decimal para o typeId é de 255. É possível informar mais dados na header usando o segundo parametro no construtor da Header `additionalParams` passando um array de dados, neste caso, a ordem importa uma vez que a ordem de escrita também será a ordem esperada de leitura.

feature/loaders/utils/Header:

- Header deve ser usado para construir o cabeçalho de cada Loader obrigatoriamente.

/loadersTypesId

- O tipo de cada loader está guardado no arquivo `loadersTypesId.ts`. Todos os tipos devem ser guardados neste módulo no intuito de padronizar o projeto. No entanto, é possível apenas gerar arquivos de bits sem cabeçalho. Quando isso acontece, é necessário que o leitor anônimo saiba interpretar os bits.

## Loaders ( Usados para interpretar os bits em informação humana como texto, número, imagem, etc )

Cada Loade deve ter obrigatoriamente Um Header e dois métodos (encode e decode). Encode exige que a saída seja do tipo `EncodeOutput`. Após receber uma instancia do `EncodeOutput` basta você chamar a propriedade `bits`. Exemplo: `myEncodedOutput.bits`.

- DecimalNumber: O primeiro tipo de arquivo suportado pelo programa criado. Pode salvar números decimais convertidos em bits dentro de uma frequência de arquivo de audio WAV. Você pode ver como usar através dos testes na pasta 'tests/loaders/DecimalNumber.test.ts'.

- Alphanumeric: Este loader pode ser usado para codificar e decodificar informações suportando uma grande maioria das caracteres usadas no mundo. Na verdade suporta qualquer um até os testes atuais baseado na arquitetura atual deste loader. Os bits de cada caractere são armazenados usando a maior quantidade de bits necessarios do maior caractere. Por exemplo, se um caractere X gasta 10 bits (em binario), todos os outros precisam usar também este espaço, mesmo que não necessite. Sempre o maior valor de bits do maior caractere será usado como padrão para as menores. Este loader já faz este tratamento.

## Helpers

feature/DecodedChunks:

- Este é um recurso que é usado para armazenar pedaço por pedaço de um arquivo e retornar os dados de bits.

feature/BitToneBuffer:

- Usado para tratar pedaços de buffer com o recurso de concatenação. Exemplo: BitToneBuffer.concat(list: Array<Buffer>);

## Como usar

O projeto tem diversos testes. Por hora, use-os como documentação. Esse conteúdo vai ser melhorado posteriormente.

## Roadmap

- Capacidade de ler bites em tempo real. Enquanto o audio está sendo tocado. (https://www.npmjs.com/package/naudiodon)
- Recorder deve passar um Loader type no segundo parametro? Ou continuar pedindo apenas o Header type?
- Capacidade para ler outros formatos de arquivos de áudio e extrair os bits, exemplo: mp3, ogg, etc.
- Usar [TypeDoc](https://typedoc.org/) para gerar documentação?
- Trocar os recursos deprecados do Buffer pelos recomendados e mais seguros.
- Trocar o deprecatedBuffer.ts pelo mais novo e não deprecado;
- Criar PR contendo os arquivos d.ts para wav-encoder e wav-decoder?;
- Melhorar os loaders de Bitmap para gerar bmp usando apenas os bits de cores e nao utilizar os nulos. Todos eles estão gerando arquivos com o mesmo tamanho mesmo que eles tenham menos dados de cor.
- Testar arquivos com 384000Hz [o mesmo do disco da voyager] ao invéz de 44100Hz (amostras por segundo);
- Estudar como gerar a lib só quando necessário (porque o código vai para o repo sem a lib contendo apenas o TypeScript).
- Configurar o binário (relacionado ao tópico acima).
- Escolher a licença apropriada.
- Postar os dados do algorítmo que está na cardeneta (o mesmo que já está sendo usado no projeto mas mais detalhado).
- Refazer o desenho da capa do disco com as informações para ler o disco:

  - Sobre o hidrogêncio e seu comprimento: https://en.wikipedia.org/wiki/Hydrogen_line

- Sampre rate vai de -1 a 1, ou seja, temos um total de 2 de cumprimento, para se achar o "SampleByte" basta fazer o cálculo
  2 / 255 (valor total de 1 byte em decimal) que vai dar 0.0078431373;

- Para guardar os valores basta fazer o seguinte cálculo:
  Ex1: 00011110 (binário) => 30 (decimal) => (SampleByte \* 30) - 1 = -0.764705881 (final SampleRate position); Onde
  "-1" é o ajuste da posição na largura do sampleRate;

- Para fazer o processo contrário (ler o dado), fazer o seguinte cálculo:
  Ex1: (-0.764705881 + 1) / SampleByte => 30 (decimal) => 0001110 (binário); Onde o primeiro valor é o sampleRate lido
  do arquivo de audio e o "+1" é o ajuste que define a posição dentro do limite de largura de um sampleRate;

- Criar o metodo de ler e escrever em Stereo (guardar os bits de forma intercalada):
  dado 01101100
  processar:
  ch1:0110
  ch2:1010

- Os decoders de bitmap estão gerando arquivos

## Melhoria

Enquanto trabalhando na ferramenta desktop, percebi que é possível ler os bytes do arquivo do buffer bruto. Ou seja, ler o arquivo .wav bruto no formato Uint8Array (que já vai converter os sampleRates para decimal entre 0 - 255) pular os bits do Header WAV (que vai do 0 ao 43) e a partir daí, já é possível ler as informações dos Loaders. Exemplo: indice 44 vai ser o TypeId e dai por diante.

Para obter a onda sonóra, basta converter Uint8Array para Float32Array.

Link sobre conversão: https://stackoverflow.com/questions/34669537/javascript-uint8array-to-float32array

Desta forma, vai ser poupado processo que tranforma os sampleRates em decimal. (Ver arquivo getBitsFromBuffer.ts)

Aqui a solução já desenvolvida:

```ts
// ---------- Modo lendo os bytes do sampleRates direto com Uint8Array (retorna decimal) ---------
// Não está sendo lido a informação de quantos canais, etc. Para saber disso, deve-se ler
// o ponteiro certo na HEADER do arquivo WAV. Aqui esta sendo usado o modo default
// do programa que é 1 canal com um sample rate de 44100
const buffer: Buffer; // Buffer do arquivo de audio .wav codificado bruto.
const decimalSampleData: Uint8Array = Uint8Array.from(buffer.slice(44)); // WAV header tem 44 bytes
// basta agora converter os valores de `decimalSampleData` para binario no Reader do programa.

// Se for necessário reproduzir o conteúdo, deve converter os valores para Float32Array que vai definir
// o comprimento do sampleRate (modelo usado para audio):
const floatSampleData: Float32Array = new Float32Array(
  decimalSampleData.length
);
decimalSampleData.forEach((uint8Value, index) => {
  floatSampleData[index] = (uint8Value - 128) / 128.0;
});

// Esse `floatSampleData` pode ser facilmente tocado usando este exemplo:
// https://developer.mozilla.org/en-US/docs/Web/API/AudioBuffer
```

Com essa solução, o moduleo `wav-decoder` pode ser descartado (a não ser que seja requerido ler o Wav Header). Mas creio que não.

**ATENÇÃO: O inverso do processo acima deve ser feito também para gravar os dados usando o Recorder.**

**ATENÇÃO 2:** O core precisará sofrer uma re-estruturação para não fazer conversões para binário representacional. Atualmente estou convertendo os valores para strings de 0s e 1s porque o processo de Gravar e Ler antigo, quando se usava tons, rigistrava o tom de acordo com o valor 0, 1 ou DIVISOR. Este processo de tons foi removido, assim sendo, o processo de se ter o binários em string também deve ser removido. Deve-se guardar os valores diretamente no formato Float32Array de cada Loader e este ser entregue ao Recorder posteriormente. O cálculo do SAMPLE BYTE vai servir apenas como referência e escrita de bytes (já que a fórmula para transformar Uint8 em Float32 está causando defeito de entregar o valor - 1)

## Util

- Gerar BMP: https://online-converting.com/image/convert2bmp/#
