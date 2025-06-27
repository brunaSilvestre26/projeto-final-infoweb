# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

---

# projeto-final-infoweb

Como fazer commit:

1. git add . (o ponto final é para os ficheiros alterados)
2. git commit -m "mensagem"
3. git push

Tecnologias:

- Vite (corre e faz o build do projecto - package manager - hot refresh)
  - npm create vite@latest (criar o projeto React)
  - name
  - framework: React
  - variant: Typescript + SWC
- React (framework de frontend)

npm install (instalar dependências - react, vite, typescript, eslint, etc.)

npm run dev (corre a aplicação - no package.json tem dev = vite - então corre o vite)

- Tailwind (https://tailwindcss.com/docs/installation/using-vite) - permite usar classes CSS pré-feitas para aplicar estilos diretamente num componente, sem ter que utilizar ficheiros CSS
- TanStack Router (https://tanstack.com/router/latest/docs/framework/react/installation) - faz o mapeamento das rotas
- shadcn/ui (https://ui.shadcn.com/docs/installation/vite) - biblioteca de componentes (+flexivel)
  - a partir do ponto 3.
  - legacy-peer-deps (por estar a usar react 19)
  - npx shadcn@latest add button (por exemplo para gerar o componente button a partir do shadcn)

---

## Generate Supabase types

- npx supabase gen types typescript --project-id "gvapmwolwbmpcrfpnjeq" --schema public > database.types.ts;

## Run flask app

flask --app app run
