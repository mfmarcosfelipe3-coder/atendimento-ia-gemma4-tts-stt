#!/bin/bash
# scripts/backup-vault.sh
# Script para realizar o backup compactado do Segundo Cérebro (Obsidian)

# Pega o diretório base do projeto (um nível acima deste script)
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

VAULT_PATH="$BASE_DIR/segundo-cerebro"
BACKUP_DIR="$BASE_DIR/backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "Iniciando backup do Segundo Cérebro..."
echo "Origem: $VAULT_PATH"
echo "Destino: $BACKUP_DIR"

# Cria pasta de backup se não existir
mkdir -p "$BACKUP_DIR"

# Compacta a pasta do vault
tar -czf "$BACKUP_DIR/vault_backup_$DATE.tar.gz" -C "$BASE_DIR" segundo-cerebro

echo "Backup concluído: vault_backup_$DATE.tar.gz"

# Mantém apenas os últimos 30 backups para economizar espaço
cd "$BACKUP_DIR" || exit
ls -t vault_backup_*.tar.gz | tail -n +31 | xargs -I {} rm -f {}

echo "Limpeza de backups antigos (se houver) concluída."
