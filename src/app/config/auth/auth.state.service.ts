// auth-utils.ts
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';

/** Retorna uma Promise que resolve com o User assim que o auth confirmar. */
export function waitForUser(auth: Auth, timeoutMs = 5000): Promise<User> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      unsubscribe();
      reject(new Error('Timeout ao aguardar autenticação'));
    }, timeoutMs);

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        clearTimeout(timer);
        unsubscribe();
        if (user) resolve(user);
        else reject(new Error('Usuário não autenticado'));
      },
      (err) => {
        clearTimeout(timer);
        unsubscribe();
        reject(err);
      }
    );
  });
}
