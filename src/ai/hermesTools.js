/**
 * Definições das ferramentas disponíveis para a IA (Formato Hermes / OpenAI Function Calling)
 */
const tools = [
  {
    type: "function",
    function: {
      name: "verificar_disponibilidade",
      description: "Verifica se um horário está disponível na agenda para uma data específica",
      parameters: {
        type: "object",
        properties: {
          data: { type: "string", description: "Data no formato YYYY-MM-DD" },
          hora: { type: "string", description: "Hora no formato HH:MM" }
        },
        required: ["data", "hora"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "listar_horarios_disponiveis",
      description: "Lista todos os horários livres em uma data",
      parameters: {
        type: "object",
        properties: {
          data: { type: "string", description: "Data no formato YYYY-MM-DD" }
        },
        required: ["data"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "criar_agendamento",
      description: "Cria um novo agendamento na agenda",
      parameters: {
        type: "object",
        properties: {
          cliente_telefone: { type: "string", description: "Telefone do cliente (apenas números)" },
          data: { type: "string", description: "Data no formato YYYY-MM-DD" },
          hora: { type: "string", description: "Hora no formato HH:MM" },
          servico: { type: "string", description: "Nome do serviço desejado" },
          valor: { type: "number", description: "Valor do serviço (opcional)" }
        },
        required: ["cliente_telefone", "data", "hora", "servico"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "cancelar_agendamento",
      description: "Cancela um agendamento existente pelo seu ID",
      parameters: {
        type: "object",
        properties: {
          agendamento_id: { type: "integer", description: "ID numérico do agendamento" },
          motivo: { type: "string", description: "Motivo do cancelamento" }
        },
        required: ["agendamento_id"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "consultar_cobranca",
      description: "Consulta as cobranças pendentes de um cliente",
      parameters: {
        type: "object",
        properties: {
          cliente_telefone: { type: "string", description: "Telefone do cliente" }
        },
        required: ["cliente_telefone"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "registrar_pagamento",
      description: "Registra que um pagamento foi realizado (baixa de cobrança)",
      parameters: {
        type: "object",
        properties: {
          cobranca_id: { type: "integer", description: "ID da cobrança" },
          forma_pagamento: { type: "string", enum: ["pix", "dinheiro", "cartao", "transferencia"] }
        },
        required: ["cobranca_id", "forma_pagamento"]
      }
    }
  }
];

module.exports = {
  tools
};
