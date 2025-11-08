export function initializeAppConfig(): () => Promise<void> {
  return () =>
    fetch('/assets/config/config.json')
      .then(response => {
        if (!response.ok) throw new Error('Falha ao carregar config.json');
        return response.json();
      })
      .then(config => {
        (globalThis as any).runtimeConfig = config;
        console.log('✅ Config carregado:', config);
      })
      .catch(err => {
        console.error('❌ Erro ao carregar configuração:', err);
        document.body.innerHTML = '<h3>Erro ao carregar configuração do aplicativo.</h3>';
      });
}
