# Projeto Final InfoWeb

Este projeto é uma aplicação _web_ desenvolvida com _React_, _TypeScript_ e _Vite_, utilizando várias bibliotecas modernas para o _frontend_ e um _backend_ em _Flask_ (_Python_). O objetivo é fornecer uma base robusta para aplicações web modernas, com integração com o _Supabase_, roteamento avançado e componentes reutilizáveis.

---

## Tecnologias Utilizadas

- **Vite**: _Bundler_ e _dev server_ rápido para projetos modernos.
- **React**: _Framework_ de _frontend_.
- **TypeScript**: Tipagem estática para _JavaScript_.
- **Tailwind CSS**: Utilitário de classes _CSS_ para estilização rápida.
- **TanStack Router**: Roteamento avançado para _React_.
- **shadcn/ui**: Biblioteca de componentes _React_ flexível.
- **Supabase**: _Backend as a Service_ (autenticação, base de dados, _storage_).
- **Flask**: _Backend_ em _Python_ para _APIs_ e lógica de negócio.
- **ESLint**: _Linting_ e qualidade de código.
- **Outras**: _Radix UI_, _lucide-react_, _sonner_, etc.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [npm](https://www.npmjs.com/) (vem com o Node.js)
- [Python 3](https://www.python.org/) (para o _backend_ _Flask_)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (opcional, para geração de tipos)

---

## Instalação e Setup

### 1. Clonar o repositório

```sh
git clone https://github.com/brunaSilvestre26/projeto-final-infoweb.git
cd projeto-final-infoweb
```

### 2. Instalar dependências do frontend

```sh
npm install
```

### 3. Configurar variáveis de ambiente

- Criar `.env.local` e preencher com os valores fornecidos.
- Para o _backend_ _Flask_, criar o ficheiro `server/.env` com os mesmos valores.

### 4. Iniciar o _frontend_

```sh
npm run dev
```

A aplicação estará disponível em [http://localhost:5173](http://localhost:5173) (ou outro porto indicado).

### 5. Instalar dependências do _backend_

```sh
cd server
pip install -r requirements.txt
```

### 6. Iniciar o _backend_ _Flask_

```sh
flask --app app run
```

O backend estará disponível em [http://localhost:5000](http://localhost:5000) por predefinição.

### 7. Gerar tipos do _Supabase_

```sh
npx supabase gen types typescript --project-id "gvapmwolwbmpcrfpnjeq" --schema public > database.types.ts
```

---

## Comandos Úteis

- **Instalar dependências:**  
  `npm install`
- **Correr aplicação em modo desenvolvimento:**  
  `npm run dev`
- **_Build_ de produção:**  
  `npm run build`
- **_Commit_ e _push_:**
  ```
  git add .
  git commit -m "mensagem"
  git push
  ```

---

## Notas sobre as Bibliotecas

- **Tailwind CSS:**  
  Permite usar classes _CSS_ pré-feitas diretamente nos componentes.
- **TanStack Router:**  
  Gere as rotas da aplicação _React_.
- **shadcn/ui:**  
  Biblioteca de componentes _React_. Para adicionar componentes, usar por exemplo:  
  `npx shadcn@latest add button`  
  Se houver problemas de dependências, usar o _flag_ `--legacy-peer-deps` (React 19).
- **Supabase:**  
  Utilizado para autenticação, base de dados e _storage_.

---

## Estrutura do Projeto

```
projeto-final-infoweb/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── ...
├── server/           # Backend Flask
│   ├── app.py
│   ├── requirements.txt
│   └── ...
├── package.json
├── README.md
└── ...
```
