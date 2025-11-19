import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,       // Importado para operações de documento (update/delete)
  setDoc,    // Importado para update/merge
  deleteDoc, // Importado para delete
  getDocs,
  writeBatch,
  DocumentReference,
  CollectionReference,
  updateDoc
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ProductOption } from '../../../shared/utils/constants';
import { defer, from, Observable, switchMap } from 'rxjs';

// --- Interfaces atualizadas ---
export interface Item {
  id?: string;
  name: string;
  weight?: number | string; // Alterado para number para melhor flexibilidade em cálculos
  price?: number | string;
  checked?: boolean;
  quantity?: number | string;
  type?: ProductOption; // Tipado a partir de OPTIONS_TYPE_PRODUCTS (veja shared/utils/constants.ts)
  // Você pode adicionar mais propriedades aqui, como 'checked: boolean', 'quantity: number', etc.
}

export interface Section {
  id?: string;
  name: string;
}

// Uma constante para o ID fixo da lista de compras por usuário
// Como cada usuário terá "apenas uma lista", usamos um ID conhecido e fixo para ela.
const SHOPPING_LIST_DOCUMENT_ID = 'myShoppingList';

@Injectable({ providedIn: 'root' })
export class ListaCompraService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);

  // --- Métodos de Autenticação (Mantidos como estão, pois já funcionam bem) ---
  /** Espera o usuário autenticado (onAuthStateChanged) */
  private waitForUser(): Promise<User> {
    const current = this.auth.currentUser as User | null;
    if (current) {
      console.debug('[ListaCompraService] auth.currentUser already present', current.uid);
      return Promise.resolve(current);
    }

    return new Promise((resolve, reject) => {
      let timeoutHandle: ReturnType<typeof setTimeout> | null = null;
      const unsubscribe = onAuthStateChanged(
        this.auth,
        (user) => {
          if (user) {
            if (timeoutHandle) clearTimeout(timeoutHandle);
            console.debug('[ListaCompraService] onAuthStateChanged -> user available', user.uid);
            unsubscribe();
            resolve(user);
          }
        },
        (err) => {
          if (timeoutHandle) clearTimeout(timeoutHandle);
          console.error('[ListaCompraService] onAuthStateChanged error', err);
          unsubscribe();
          reject(err);
        }
      );

      timeoutHandle = setTimeout(() => {
        console.warn('[ListaCompraService] waitForUser timed out after 15000ms');
        unsubscribe();
        reject(new Error('Timeout waiting for auth state'));
      }, 15000);
    });
  }

  /** 🔹 Retorna UID do usuário logado */
  private getUserId(): string {
    const user = this.auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');
    return user.uid;
  }

  // --- Métodos para interagir com a nova estrutura do Firestore ---

  /**
   * Helper para construir o caminho base da lista de compras de um usuário.
   * Exemplo: `users/some-user-id/list/myShoppingList`
   */
  private getUserShoppingListPath(userId: string): string {
    return `users/${userId}/list/${SHOPPING_LIST_DOCUMENT_ID}`;
  }

  /**
   * 1. Conseguir criar seções
   * 🔹 Cria uma nova seção dentro da lista de compras do usuário.
   * O Firestore automaticamente criará os documentos pai (`list` e `user`) se não existirem.
   */
  addSection(section: Section) {
    return defer(() => from(this.waitForUser())).pipe(
      switchMap((user) => {
        const sectionsCollectionRef = collection(
          this.firestore,
          `${this.getUserShoppingListPath(user.uid)}/sections`
        ) as CollectionReference<Section>;
        return from(addDoc(sectionsCollectionRef, section));
      })
    );
  }

  /**
   * 4. Tudo criado e recuperado deve ser específico do usuário logado.
   * 🔹 Lista todas as seções da lista de compras do usuário logado.
   */
  getSections(): Observable<Section[]> {
    return defer(() => from(this.waitForUser())).pipe(
      switchMap((user) => {
        const sectionsCollectionRef = collection(
          this.firestore,
          `${this.getUserShoppingListPath(user.uid)}/sections`
        ) as CollectionReference<Section>;
        return collectionData(sectionsCollectionRef, { idField: 'id' }) as Observable<Section[]>;
      })
    );
  }

  /**
   * 2. Conseguir adicionar itens em seções específicas
   * 3. Conseguir criar itens
   * 🔹 Adiciona um item a uma seção específica dentro da lista de compras do usuário logado.
   */
  addItem(sectionId: string, item: Item) {
    return defer(() => from(this.waitForUser())).pipe(
      switchMap((user) => {
        const itemsCollectionRef = collection(
          this.firestore,
          `${this.getUserShoppingListPath(user.uid)}/sections/${sectionId}/items`
        ) as CollectionReference<Item>;
        return from(addDoc(itemsCollectionRef, item));
      })
    );
  }

  /**
   * 4. Tudo criado e recuperado deve ser específico do usuário logado.
   * 🔹 Lista os itens de uma seção específica dentro da lista de compras do usuário logado.
   */
  getItems(sectionId: string): Observable<Item[]> {
    return defer(() => from(this.waitForUser())).pipe(
      switchMap((user) => {
        const itemsCollectionRef = collection(
          this.firestore,
          `${this.getUserShoppingListPath(user.uid)}/sections/${sectionId}/items`
        ) as CollectionReference<Item>;
        return collectionData(itemsCollectionRef, { idField: 'id' }) as Observable<Item[]>;
      })
    );
  }

  // --- Métodos adicionais para funcionalidade completa (SLA do Firebase) ---

  /** 🔹 Atualiza uma seção específica */
  updateSection(sectionId: string, data: Partial<Section>): Observable<void> {
    return defer(() => from(this.waitForUser())).pipe(
      switchMap(user => {
        const sectionDocRef = doc(this.firestore, `${this.getUserShoppingListPath(user.uid)}/sections/${sectionId}`) as DocumentReference<Section>;
        return from(setDoc(sectionDocRef, data, { merge: true })); // merge: true para atualizar campos existentes sem sobrescrever o documento inteiro
      })
    );
  }

  /**
   * 🔹 Exclui uma seção específica.
   * ATENÇÃO: A exclusão de um documento no Firestore NÃO exclui automaticamente suas subcoleções.
   * Se você quiser que a exclusão de uma seção também exclua todos os seus itens,
   * você precisará implementar uma Cloud Function para realizar essa tarefa.
   * Caso contrário, os itens "órfãos" permanecerão no banco de dados.
   */
  deleteSection(sectionId: string): Observable<void> {
      return defer(() => from(this.waitForUser())).pipe(
          switchMap(user => {
              const sectionDocRef = doc(this.firestore, `${this.getUserShoppingListPath(user.uid)}/sections/${sectionId}`);
              return from(deleteDoc(sectionDocRef));
          })
      );
  }

  /** 🔹 Atualiza um item específico em uma seção */
  updateItem(sectionId: string, itemId: string, data: Partial<Item>): Observable<void> {
    return defer(() => from(this.waitForUser())).pipe(
      switchMap(user => {
        const itemDocRef = doc(this.firestore, `${this.getUserShoppingListPath(user.uid)}/sections/${sectionId}/items/${itemId}`) as DocumentReference<Item>;
        return from(setDoc(itemDocRef, data, { merge: true }));
      })
    );
  }

  /** 🔹 Exclui um item específico de uma seção */
  deleteItem(sectionId: string, itemId: string): Observable<void> {
    return defer(() => from(this.waitForUser())).pipe(
      switchMap(user => {
        const itemDocRef = doc(this.firestore, `${this.getUserShoppingListPath(user.uid)}/sections/${sectionId}/items/${itemId}`);
        return from(deleteDoc(itemDocRef));
      })
    );
  }

  /**
   * Exclui todos os itens de uma seção (em batches de até 500 operações) e, em seguida, exclui o documento da seção.
   * Observação: o Firestore não oferece um delete "recursivo" no client SDK; portanto fazemos a remoção manual
   * dos documentos da subcoleção antes de apagar o documento pai.
   */
  deleteSectionCascade(sectionId: string): Observable<void> {
    return defer(() => from(this.waitForUser())).pipe(
      switchMap(async (user) => {
        const itemsCollectionRef = collection(
          this.firestore,
          `${this.getUserShoppingListPath(user.uid)}/sections/${sectionId}/items`
        );

        // Obter todos os documentos da subcoleção
        const snapshot = await getDocs(itemsCollectionRef);

        // Se não houver itens, apenas deletamos o documento da seção
        const sectionDocRef = doc(this.firestore, `${this.getUserShoppingListPath(user.uid)}/sections/${sectionId}`);
        if (snapshot.empty) {
          await deleteDoc(sectionDocRef);
          return;
        }

        // Apagar em batches (limite 500 por batch)
        const commits: Promise<void>[] = [];
        let batch = writeBatch(this.firestore);
        let opCount = 0;

        for (const docSnap of snapshot.docs) {
          batch.delete(docSnap.ref);
          opCount++;
          if (opCount >= 500) {
            commits.push(batch.commit());
            batch = writeBatch(this.firestore);
            opCount = 0;
          }
        }

        if (opCount > 0) {
          commits.push(batch.commit().then(() => {}));
        }

        // Espera todos os commits e depois apaga o documento da seção
        await Promise.all(commits);
        await deleteDoc(sectionDocRef);
      })
    );
  }

  updateItemChecked(sectionId: string, itemId: string, checked: boolean): Observable<void> {
    return defer(() => from(this.waitForUser())).pipe(
      switchMap(user => {
        const itemDocRef = doc(this.firestore, `${this.getUserShoppingListPath(user.uid)}/sections/${sectionId}/items/${itemId}`) as DocumentReference<Item>;
        return from(updateDoc(itemDocRef, { checked }));
      })
    );
  }
}
