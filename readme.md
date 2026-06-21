# Scaffold Genérico — Expo + TypeScript + NativeWind + Expo Router

> Stack reutilizável para qualquer projeto React Native.
> Testado no Windows PowerShell.

---

## 1. Criar o projeto

```powershell
npx create-expo-app@latest meu-app --template tabs
cd meu-app
```

---

## 2. Instalar NativeWind

```powershell
npm install nativewind
npm install --save-dev tailwindcss@3.3.2
```

---

## 3. Criar estrutura de pastas

```powershell
New-Item -ItemType Directory -Force -Path "assets/images"
New-Item -ItemType Directory -Force -Path "constants"
New-Item -ItemType Directory -Force -Path "components"
New-Item -ItemType Directory -Force -Path "hooks"
New-Item -ItemType Directory -Force -Path "services"
New-Item -ItemType Directory -Force -Path "data"
New-Item -ItemType Directory -Force -Path "utils"
New-Item -ItemType Directory -Force -Path "types"
```

---

## 4. Arquivos de configuração

### tailwind.config.js — novo arquivo

```powershell
@'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: { extend: {} },
  plugins: [],
};
'@ | Set-Content tailwind.config.js
```

### babel.config.js — substituir o existente

```powershell
@'
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
'@ | Set-Content babel.config.js
```

### tsconfig.json — adicionar strict mode

```powershell
@'
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": { "@/*": ["./*"] }
  }
}
'@ | Set-Content tsconfig.json
```

---

## 5. Placeholders

```powershell
@'
// tipos do projeto
'@ | Set-Content "types/index.ts"
```

```powershell
@'
export const colors = {};
export const typography = {};
export const spacing = {};
'@ | Set-Content "constants/index.ts"
```

---

## 6. Commit inicial

```powershell
git add .
git commit -m "scaffold: expo tabs + typescript strict + nativewind"
```

---

## O que o template `tabs` já resolve

| Arquivo | Status |
|---|---|
| `tsconfig.json` | ✅ criado — atualizado no passo 4 |
| `babel.config.js` | ✅ criado — atualizado no passo 4 |
| `app.json` | ✅ criado |
| `app/_layout.tsx` | ✅ criado |
| `app/(tabs)/_layout.tsx` | ✅ criado |
| `tailwind.config.js` | ❌ não existe — criado no passo 4 |
| `types/index.ts` | ❌ não existe — criado no passo 5 |
| `constants/index.ts` | ❌ não existe — criado no passo 5 |

---

## Observações

- **Por que `tabs` e não `blank-typescript`?**
  O template `blank-typescript` instala React Native 0.81.x, que conflita com `expo-router` >= 6, que exige RN >= 0.82. O template `tabs` já vem com as versões compatíveis.

- **Para renomear o projeto** antes do primeiro commit, edite o campo `"name"` e `"slug"` no `app.json`.

- **Para adicionar `expo-webview` ou `AsyncStorage`** depois, use sempre `npx expo install` no lugar de `npm install` para garantir versões compatíveis com o SDK atual.

```powershell
npx expo install expo-webview @react-native-async-storage/async-storage
```
