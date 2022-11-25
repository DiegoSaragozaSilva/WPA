# WPA (Web Privacy Analyser)

WPA ou Web Privacy Analyser, é uma simples extensão construída para Firefox que tem como objetivo principal analisar a aba atualmente aberta de seu navegador e lhe apresentar uma pontuação de privacidade, com base em diversos aspectos presentes no contexto.
Esta extensão não tem a intenção de fazer uma análise profunda de fatores que podem comprometer sua experiência enquanto navega a web. Ela é um simples exemplo de coleta de informações e construção de uma métrica de segurança.

## Dados coletados

### Requisições a terceiros
O primeiro dado que representa algum valor significativo para a métrica de segurança são as third party requests ou requisições a terceiros.
Essas requisições são feitas a partir da página aberta atualmente em direção a domínios que não fazem parte do domínio do contexto atual.
A presença de inúmeras requisições a terceiros pode representar uma ameaça a sua segurança já que podem ser feitas sobre cunho malicioso com o intuito de buscar ferramental ilegal em servidores web de maneira que passe despercebido pelo usuário.
A coleta é feita através de um listener de requisições, que as intercepta e as classifica como de primeira ou terceira parte.

![Diagrama 01](/images/diagram01.jpeg)

### Conexão SSL segura
O segundo dado coletado é a presença de uma conexão SSL segura com o web site. Essa conexão segura se dá quando há a presença do protocolo "https" junto a um certificado de segurança válido.
A presença de uma conexão segura com o web site aberto garante a privacidade de informações sensíveis como senhas quando estas são enviadas ao web server para autenticações ou cadastros.
Essa informações é checada em duas partes, primeiro é checado a presença do protocolo "https" via URL do site aberto e, por ultimo, é checado a presença do protocolo válido no armazenamento do site.

### Cookies
Os cookies são parte fundamental dos web sites atualmente, contudo, é fato que muitos hosts utilizam estes de maneira maliciosa.
Existem diversos tipos de cookies que podem estar presentes durante seu acesso ao site. Existem cookies de sessão, aqueles que são classificados como cookies seguros, aqueles que vem de fontes de terceiros e etc.
Para a métrica de segurança, levo em conta todos estes citados, contudo, levo em consideração a presença de cookies mais do que necessários ponderados pela presença de cookies de terceiros e não seguros.

![Diagrama 02](/images/diagram02.jpeg)

### Local Storage
O local storage é um armazenamento local que pode ser utilizado pelo web site acessado para armazenar informações temporárias que servirão minimamente para o funcionamento do processo de uso do usuário.
Esse armazenamento possui um limite que varia de acordo com seu navegador e, também varia no que tange o conteúdo que pode ser armazenado.
Para minha métrica, levo em conta o tamanho em kilobytes do armazenamento utilizado, caso este seja abusivo a ponto de não fazer sentido para usos temporários, pode representar algum risco a segurança do usuário.

## Métrica de segurança
A métrica de segurança leva em conta todos os conceitos antes apresentados e, segue as seguintes regras matemáticas:
$$ S(n, m, k, H) = 1 - \left(\frac{0.25 \cdot T(n) + 0.15 \cdot L(m) + 0.2 \cdot C(k) + 0.4 \cdot H}{4} \right) $$
$$ T(n) = n^2$$
$$ L(m) = m^4$$
$$ C(k) = k^8$$
$$
H = \left\{\begin{array}{lr}
        1, & \text{caso a conexão não seja segura}\\
        0, & \text{caso a conexão seja segura}\\
        \end{array}\right\}
$$
Sendo $S$ o score de segurança da página, $T$ o score parcial sobre as requisições a terceiros, $L$ o score parcial sobre o tamanho calculado do local storage, $C$ o score parcial calculado sobre os cookies injetados na página e $H$ a presença de uma conexão SSL segura.
O comportamento da função de score final se comporta da seguinte maneira. Lembre-se que para visualizarmos a função de maneira consistente precisaríamos plota-la em um gráfico com 5 dimensões. O gráfico abaixo somente representa o comportamento do polinômio semelhante a ela.

![Graph](/images/graph.jpeg)

### Exemplos de scores

![Example](/images/twitter.jpeg)
![Example](/images/youtube.jpeg)
![Example](/images/github.jpeg)
![Example](/images/arch.jpeg)



