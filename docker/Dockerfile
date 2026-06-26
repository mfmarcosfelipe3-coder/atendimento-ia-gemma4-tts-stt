FROM node:20-alpine

# Instalar FFmpeg para manipulação de áudio
RUN apk update && apk add --no-cache ffmpeg tzdata

# Definir timezone
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

# Copiar package.json e package-lock.json (se existir)
COPY package*.json ./

# Instalar dependências (apenas produção)
RUN npm install --omit=dev

# Copiar código fonte
COPY src ./src
COPY config ./config

# Criar diretórios necessários
RUN mkdir -p /app/temp /app/logs /app/segundo-cerebro /app/prompts

# Expor porta
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]
