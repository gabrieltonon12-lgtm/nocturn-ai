# Integração Runway ML — Geração de Vídeo Profissional com Download em MP4

## CONTEXTO

Substitua o sistema atual de geração de vídeo (Pexels + GPT) pela API do Runway ML para gerar vídeos de alta qualidade. Os vídeos devem ser baixados automaticamente em formato MP4 e salvos no projeto.

**Chave de API Runway:**
```
key_db8c34b55c7890a2eb154e8a67b6befaa7e554b326601ad9dfa305a84bb88527a1975134f104cfe16cf34a792c71f4338380b221920b50f3965ee0f210239aad
```

---

## FASE 1 — LEITURA E DIAGNÓSTICO

Antes de qualquer alteração:

1. Leia todos os arquivos do projeto
2. Identifique onde atualmente é feita a geração de vídeo (qual arquivo, qual função, qual rota)
3. Identifique onde o vídeo é exibido ou entregue ao usuário
4. Me apresente um resumo do fluxo atual e pergunte se pode prosseguir

---

## FASE 2 — INSTALAÇÃO DO SDK DO RUNWAY

Instale o SDK oficial do Runway ML:

```bash
npm install @runwayml/sdk
```

Se o projeto usar Python:
```bash
pip install runwayml
```

Após instalar, me confirme e pergunte se pode prosseguir.

---

## FASE 3 — IMPLEMENTAÇÃO DA INTEGRAÇÃO

### 3.1 — Configuração da chave de API

Adicione a chave no arquivo `.env` do projeto:

```env
RUNWAY_API_KEY=key_db8c34b55c7890a2eb154e8a67b6befaa7e554b326601ad9dfa305a84bb88527a1975134f104cfe16cf34a792c71f4338380b221920b50f3965ee0f210239aad
```

Garanta que o `.env` está no `.gitignore` para não expor a chave.

---

### 3.2 — Serviço de geração de vídeo (Node.js/JavaScript)

Crie um arquivo `services/runwayService.js` (ou equivalente na estrutura do projeto):

```javascript
import RunwayML from '@runwayml/sdk';
import fs from 'fs';
import path from 'path';
import https from 'https';

const client = new RunwayML({
  apiKey: process.env.RUNWAY_API_KEY,
});

/**
 * Gera um vídeo a partir de um prompt de texto usando Runway Gen-4 Turbo
 * e faz o download do arquivo em MP4
 *
 * @param {string} prompt - Descrição do vídeo a ser gerado
 * @param {string} outputFileName - Nome do arquivo MP4 de saída (ex: "video_123.mp4")
 * @param {string} outputDir - Pasta onde o MP4 será salvo (ex: "./public/videos")
 * @returns {Promise<string>} - Caminho completo do arquivo MP4 salvo
 */
export async function generateVideoAndDownload(prompt, outputFileName, outputDir = './public/videos') {
  try {
    console.log('Iniciando geração de vídeo com Runway ML...');

    // Garante que a pasta de destino existe
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Inicia a tarefa de geração de vídeo (text-to-video)
    const imageToVideo = await client.textToVideo.create({
      model: 'gen4_turbo',
      promptText: prompt,
      ratio: '1280:720',   // Proporção 16:9 — qualidade profissional
      duration: 10,         // Duração em segundos (5 ou 10)
    });

    const taskId = imageToVideo.id;
    console.log(`Tarefa criada com ID: ${taskId}. Aguardando processamento...`);

    // Polling — aguarda o vídeo ficar pronto
    let task;
    do {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Aguarda 10 segundos entre cada verificação
      task = await client.tasks.retrieve(taskId);
      console.log(`Status atual: ${task.status}`);
    } while (!['SUCCEEDED', 'FAILED'].includes(task.status));

    if (task.status === 'FAILED') {
      throw new Error(`Geração de vídeo falhou: ${task.failure || 'Motivo desconhecido'}`);
    }

    // Obtém a URL do vídeo gerado
    const videoUrl = task.output[0];
    console.log(`Vídeo gerado com sucesso! URL: ${videoUrl}`);

    // Faz o download do vídeo em MP4
    const outputPath = path.join(outputDir, outputFileName.endsWith('.mp4') ? outputFileName : `${outputFileName}.mp4`);

    await downloadFile(videoUrl, outputPath);
    console.log(`Vídeo salvo em: ${outputPath}`);

    return outputPath;

  } catch (error) {
    console.error('Erro ao gerar vídeo com Runway ML:', error);
    throw error;
  }
}

/**
 * Faz o download de um arquivo de uma URL e salva no caminho indicado
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {}); // Remove arquivo parcial se der erro
      reject(err);
    });
  });
}
```

---

### 3.3 — Se o projeto usar Python

Crie o arquivo `services/runway_service.py`:

```python
import runwayml
import requests
import os
import time

client = runwayml.RunwayML(api_key=os.environ.get("RUNWAY_API_KEY"))

def generate_video_and_download(prompt: str, output_filename: str, output_dir: str = "./public/videos") -> str:
    """
    Gera um vídeo com Runway ML a partir de um prompt e salva em MP4.
    
    Args:
        prompt: Descrição do vídeo a ser gerado
        output_filename: Nome do arquivo de saída (ex: video_123.mp4)
        output_dir: Pasta onde salvar o vídeo
    
    Returns:
        Caminho completo do arquivo MP4 salvo
    """
    os.makedirs(output_dir, exist_ok=True)

    print("Iniciando geração de vídeo com Runway ML...")

    # Cria a tarefa de geração
    task = client.text_to_video.create(
        model="gen4_turbo",
        prompt_text=prompt,
        ratio="1280:720",
        duration=10
    )

    task_id = task.id
    print(f"Tarefa criada: {task_id}. Aguardando processamento...")

    # Polling até o vídeo ficar pronto
    while True:
        time.sleep(10)
        task = client.tasks.retrieve(task_id)
        print(f"Status: {task.status}")
        if task.status in ["SUCCEEDED", "FAILED"]:
            break

    if task.status == "FAILED":
        raise Exception(f"Geração falhou: {getattr(task, 'failure', 'Motivo desconhecido')}")

    video_url = task.output[0]
    print(f"Vídeo gerado! URL: {video_url}")

    # Download do MP4
    filename = output_filename if output_filename.endswith(".mp4") else f"{output_filename}.mp4"
    output_path = os.path.join(output_dir, filename)

    response = requests.get(video_url, stream=True)
    with open(output_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)

    print(f"Vídeo salvo em: {output_path}")
    return output_path
```

---

## FASE 4 — INTEGRAÇÃO NO FLUXO EXISTENTE

1. Localize onde o projeto atualmente chama a geração de vídeo (Pexels, GPT-video, etc.)
2. Substitua essa chamada pela função `generateVideoAndDownload` (ou equivalente em Python)
3. Passe como `prompt` o roteiro ou descrição de cena que o GPT já gera
4. Salve o MP4 na pasta `public/videos` (ou equivalente do projeto)
5. Retorne o caminho ou URL do arquivo MP4 para o frontend exibir/disponibilizar para o usuário

---

## FASE 5 — TRATAMENTO DE ERROS E LOADING

- Enquanto o vídeo está sendo gerado (pode levar de 30 segundos a 3 minutos), exiba um loading state animado na interface com mensagens como:
  - "Sua IA está criando o vídeo..."
  - "Processando cenas..."
  - "Finalizando exportação em MP4..."

- Se a geração falhar, mostre uma mensagem amigável ao usuário com opção de tentar novamente

- Adicione um timeout máximo de 5 minutos — se ultrapassar, cancele e avise o usuário

---

## FASE 6 — ENTREGA DO MP4 AO USUÁRIO

Após o vídeo ser salvo:

- Exiba um player de vídeo HTML5 na interface com o MP4 gerado
- Adicione um botão de **"Baixar vídeo"** que faz o download direto do MP4
- O botão deve ter este comportamento:

```html
<a href="/public/videos/video_123.mp4" download="meu-video.mp4">
  Baixar vídeo em MP4
</a>
```

- Se o projeto tiver backend, crie uma rota `/download/:filename` que serve o arquivo MP4 com os headers corretos:

```javascript
res.setHeader('Content-Type', 'video/mp4');
res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
```

---

## REGRAS IMPORTANTES

- NÃO remova nenhuma lógica existente do projeto — apenas substitua a parte de geração de vídeo
- A chave de API deve SEMPRE vir do `.env`, nunca hardcoded no código
- Todos os vídeos devem ser salvos em MP4
- Me mostre cada arquivo alterado após cada fase e aguarde minha aprovação antes de continuar
- Se precisar de alguma informação sobre a estrutura atual para decidir onde integrar, me pergunte antes de prosseguir

---

Comece pela FASE 1. Leia os arquivos, encontre onde a geração de vídeo acontece hoje e me apresente o diagnóstico.
