import { app } from '@/app'; // 4.2.1 importando a aplicação do app.ts

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`O SERVIDOR ESTA RODANDO: PORTA ${PORT}`);
});