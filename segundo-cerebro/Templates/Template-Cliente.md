---
nome: "{{title}}"
telefone: 
email: 
data_cadastro: "{{date}}"
endereco: 
preferencia_horario: 
forma_pagamento: 
observacoes: 
tags: [cliente]
---

# {{title}}

## Dados Pessoais
- **Telefone**: 
- **Email**: 
- **Endereço**: 

## Preferências
- **Horário Preferido**: 
- **Forma de Pagamento**: 
- **Serviços Frequentes**: 

## Histórico
### Agendamentos
```dataview
TABLE data, servico, status
FROM "02-Agendamentos"
WHERE cliente = this.nome
SORT data DESC
```

### Cobranças
```dataview
TABLE valor, data_vencimento, status
FROM "03-Cobrancas"
WHERE cliente = this.nome
SORT data_vencimento DESC
```

## Observações da IA
<!-- A IA adiciona insights aqui automaticamente -->
