# Upload de Arquivos com MultipartFile

## Resumo das Mudanças

Implementação de upload de arquivos no feed usando `multipart/form-data` através da interface `MultipartFile` do Spring, substituindo a abordagem anterior baseada em URLs.

---

## Arquivos Modificados

### Backend (Java/Spring)

#### 1. **Entity Post** (`backend/src/main/java/.../entity/Post.java`)
- Removido: `String imageUrl` (campo de URL)
- Adicionado: 
  - `byte[] imageData` (arquivo binário com `@Lob`)
  - `String imageFileName` (nome do arquivo)
  - `String imageContentType` (tipo MIME, ex: `image/jpeg`)

#### 2. **DTO CreatePostRequest** (`backend/src/main/java/.../dto/CreatePostRequest.java`)
- Antes: `record CreatePostRequest(String imageUrl, String description)`
- Depois: `record CreatePostRequest(MultipartFile image, String description)`

#### 3. **PostService** (`backend/src/main/java/.../service/PostService.java`)
- Atualizado método `create()` para:
  - Aceitar `CreatePostRequest` com `MultipartFile`
  - Validar tipo de arquivo (apenas imagens)
  - Converter imagem para base64 na resposta
  - Lançar exceções para arquivos inválidos
- Adicionados métodos auxiliares:
  - `getImageData(postId)` - retorna dados binários
  - `getPostWithImage(postId)` - retorna post completo com imagem

#### 4. **PostController** (`backend/src/main/java/.../controller/PostController.java`)
- Alterado endpoint `POST /api/posts`:
  - De: `@RequestBody CreatePostRequest`
  - Para: `@RequestParam` multipart/form-data
  - Content-Type: `multipart/form-data`
- Adicionado endpoint `GET /api/posts/{postId}/image`:
  - Retorna arquivo binário com headers apropriados
  - Content-Disposition: `inline` (exibe no navegador)

#### 5. **Configuration** (`backend/src/main/resources/application.yml`)
- Adicionado:
```yaml
spring:
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB
```

#### 6. **Database Migrations** (`backend/src/main/resources/schema.sql`)
- Removida coluna: `image_url`
- Adicionadas colunas:
  - `image_data BYTEA` - dados binários
  - `image_file_name VARCHAR(100)` - nome do arquivo
  - `image_content_type VARCHAR(50)` - tipo MIME

#### 7. **Testes** (`backend/src/test/java/.../ApiEndpointsTest.java`)
- Atualizado `setUp()` para usar `imageData` ao invés de `imageUrl`
- Alterado `shouldCreatePost()` para:
  - Usar `.multiPart()` ao invés de `.contentType(JSON)`
  - Enviar dados binários (JPEG magic numbers)

### Frontend (Next.js/React)

#### 1. **API Wrapper** (`frontend/lib/api.js`)
- Atualizado função `request()`:
  - Detecta `FormData` e não adiciona `Content-Type`
  - Deixa navegador configurar headers automaticamente
- Atualizado `createPost()`:
  - Aceita `FormData` ao invés de objeto JSON

#### 2. **PostForm Component** (`frontend/components/PostForm.jsx`)
- Removido: input type="url" com `imageUrl`
- Adicionado: input type="file" com `imageFile` e `imagePreview`
- Novo fluxo:
  1. Usuário seleciona arquivo
  2. Preview da imagem é exibido
  3. Validação de tipo (apenas imagens)
  4. FormData é construído e enviado
  5. Imagem é convertida para base64 na resposta

#### 3. **Documentation** (`docs/API.md`)
- Atualizado exemplo de resposta GET `/api/posts` (imageUrl agora é base64)
- Atualizado endpoint `POST /api/posts`:
  - Explicação de multipart/form-data
  - Exemplo de request HTTP
  - Validações
  - Exemplo de response

---

## Como Usar

### Backend

#### Upload com cURL:
```bash
curl -X POST http://localhost:8080/api/posts \
  -H "Cookie: JSESSIONID=..." \
  -F "image=@/path/to/image.jpg" \
  -F "description=Minha legenda"
```

#### Download da Imagem:
```bash
curl http://localhost:8080/api/posts/{postId}/image \
  --output image.jpg
```

### Frontend

#### No componente PostForm:
```jsx
const [imageFile, setImageFile] = useState(null)

function handleImageChange(e) {
  const file = e.target.files[0]
  if (file && file.type.startsWith('image/')) {
    setImageFile(file)
  }
}

async function handleSubmit(e) {
  e.preventDefault()
  
  const formData = new FormData()
  formData.append('image', imageFile)
  formData.append('description', 'Minha legenda')
  
  const response = await createPost(formData)
  // response.imageUrl é agora um data URL em base64
}
```

---

## Características

✅ **Upload de arquivo binário** - Arquivo salvo como BLOB no banco de dados
✅ **Validação de tipo** - Apenas imagens são aceitas (MIME type `image/*`)
✅ **Limite de tamanho** - Máximo 10MB por arquivo (configurável)
✅ **Preview do cliente** - Imagem exibida antes de publicar
✅ **Data URL em base64** - Imagem retornada como `data:image/...;base64,...`
✅ **Endpoint de download** - `/api/posts/{postId}/image` para baixar arquivo original
✅ **Formatos suportados** - JPEG, PNG, GIF, WebP, SVG, etc.

---

## Exemplo de Resposta

### POST /api/posts (criar post)
```json
{
  "id": 21,
  "userId": 1,
  "username": "gabriel",
  "avatarUrl": "https://...",
  "imageUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "description": "Minha legenda do post",
  "likeCount": 0,
  "commentCount": 0,
  "likedByMe": false,
  "createdAt": "2026-06-02T22:46:38",
  "status": "PENDENTE"
}
```

---

## Validações

| Campo | Validação |
|-------|-----------|
| `image` | Obrigatório, tipo MIME deve começar com `image/` |
| `description` | Obrigatório, máximo 1000 caracteres |
| Tamanho do arquivo | Máximo 10MB (configurável) |

---

## Migração de Dados

Se você tinha posts com URLs:
1. Nenhuma migração automática foi feita
2. Posts sem `image_data` terão `imageUrl: null` na resposta
3. Recomenda-se deletar posts antigos ou fazer migração manual

---

## Próximas Melhorias

- [ ] Armazenar imagens em serviço de cloud (S3, GCS)
- [ ] Compressão automática de imagens
- [ ] Múltiplos formatos/resoluções
- [ ] Processamento assíncrono de upload
- [ ] Validação de dimensões de imagem
