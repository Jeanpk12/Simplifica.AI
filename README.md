# 🧠 Simplificador de Textos Técnicos

Um app web que traduz *"tecniquês"* para o bom e velho português claro. Ideal para estudantes, curiosos, profissionais multitarefa e quem mais quiser entender textos técnicos.

## ✨ Funcionalidades

- ✅ Colar ou digitar textos técnicos
- 🚀 Processamento assíncrono com feedback visual
- 📄 Renderização com suporte a Markdown
- 📱 Design responsivo, limpo e intuitivo
- 🧠 Simplicidade com inteligência (usa LLM via `@google/genai`)

---

## 🛠️ Tecnologias e Stacks

### Frontend
- **Next.js 15** – O cérebro da operação. Roteamento, SSR, e App Router.
- **React 19** – Reatividade de última geração com Server Actions.
- **TailwindCSS v4** – Estilização rápida e utilitária com suporte a dark mode.
- **lucide-react** – Ícones minimalistas para uma UI moderna.
- **react-markdown** – Para exibir o resultado da simplificação com elegância.

### Backend (server actions)
- **@google/genai** – API oficial do Google Gemini para IA generativa.
- **Server Actions** – Chamadas diretas ao backend com ergonomia de frontend.

### Dev Experience
- **TypeScript v5** – Tipagem estática que previne bugs e melhora DX.
- **ESLint + eslint-config-next** – Para manter o código cheiroso e padronizado.
- **PostCSS + Tailwind Typography** – Estilização refinada de texto, perfeita para ler.

---
