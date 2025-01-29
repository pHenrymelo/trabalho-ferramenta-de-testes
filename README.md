
# Guia de instalação



## Rodando localmente

Clone o projeto

```bash

  git clone https://github.com/pHenrymelo/trabalho-ferramenta-de-testes.git

```

Entre no diretório do projeto

```bash
  cd trabalho-ferramenta-de-testes
```

Instale as dependências

```bash
  pnpm install
```

ou

```bash
  npm install
```

Inicie o container do docker com o DB

```bash
  docker compose up -d
```

Execute com 

```bash
  pnpm dev
```

ou 

```bash
  npm run dev
```
## Executando os testes

```bash
  
  pnpm test

```

ou

```bash
  
  npm run test

```

