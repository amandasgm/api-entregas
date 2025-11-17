import { app } from '@/app'; // 4.2.1 importando a aplicação do app.ts
import { env } from './env'; // 3. importando a variavel de ambiente do env.ts

// utilizando a variavel de ambiente para definir a porta do servidor
const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`O SERVIDOR ESTA RODANDO: PORTA ${PORT}`);
});