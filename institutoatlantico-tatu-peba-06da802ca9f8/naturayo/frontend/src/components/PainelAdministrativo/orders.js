const { ctx } = require("../../../../backend/produtos");

const toggleButton = document.getElementById('toggle-theme');
toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

const salesChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [{
      label: 'Vendas (R$)',
      data: [1200, 1900, 3000, 2500, 3200, 2800, 3500, 4000, 4200, 4600, 5000, 5300],
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      borderColor: 'rgba(76, 175, 80, 1)',
      borderWidth: 2,
      fill: true,
      tension: 0.3,
      pointRadius: 4,
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {color: getComputedStyle(document.body).getPropertyValue('--text-color')}
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: getComputedStyle(document.body).getPropertyValue('--text-color')
        }
      },
      x: {
        ticks: {
          color: getComputedStyle(document.body).getPropertyValue('--text-color')
        }
      }
    }
  }
});

// --- Filtro de pedidos ---
const filterInput = document.getElementById('filterInput');
const tableRows = document.querySelectorAll('tbody tr');

filterInput.addEventListener('input', () => {
  const filterValue = filterInput.value.toLowerCase();

  tableRows.forEach(row => {
    const cliente = row.cells[0].textContent.toLowerCase();
    const produto = row.cells[1].textContent.toLowerCase();

    if (cliente.includes(filterValue) || produto.includes(filterValue)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});

// Função para exibir produtos (pode expandir essa funcionalidade depois)
function mostrarProdutos() {
  // Aqui você pode criar uma seção na página para mostrar a lista de produtos dinamicamente
  // Exemplo: lista com botões para editar e excluir
  // Quer que eu faça essa parte também?
}
function updateButtonText() {
  if(body.classList.contains('dark-mode')) {
    toggleButton.textContent = 'Modo Claro';
  } else {
    toggleButton.textContent = 'Modo Escuro';
  }
}

updateButtonText();

toggleButton.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  if(body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
  updateButtonText();
});
const produtos = ['Produto A', 'Produto B', 'Produto C', 'Produto D', 'Produto E'];
const vendas = [120, 120, 120, 120, 120];

const ctx = document.getElementById('produtosMaisVendidos').getContext('2d');

const produtosChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: produtos,
    datasets: [{
      label: 'Vendas',
      data: vendas,
      backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF5722'],
      borderColor: ['#388E3C', '#1976D2', '#FFA000', '#7B1FA2', '#E64A19'],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: getComputedStyle(document.body).getPropertyValue('--text-color')
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: getComputedStyle(document.body).getPropertyValue('--text-color')
        }
      },
      x: {
        ticks: {
          color: getComputedStyle(document.body).getPropertyValue('--text-color')
        }
      }
    }
  }
});
const pedidos = [
  {
    cliente: 'João Silva',
    produto: 'Notebook Gamer',
    status: 'pendente',
    data: '2025-05-25',
    valor: 'R$ 3.500,00'
  },
  {
    cliente: 'Maria Oliveira',
    produto: 'Smartphone',
    status: 'entregue',
    data: '2025-05-27',
    valor: 'R$ 2.100,00'
  },
  {
    cliente: 'Carlos Souza',
    produto: 'Mouse',
    status: 'cancelado',
    data: '2025-05-28',
    valor: 'R$ 120,00'
  }
];

function renderPedidos(filtrados = pedidos) {
  const tbody = document.getElementById('pedidosTable');
  tbody.innerHTML = '';

  filtrados.forEach(pedido => {
    tbody.innerHTML += `
      <tr>
        <td>${pedido.cliente}</td>
        <td>${pedido.produto}</td>
        <td><span class="status ${pedido.status}">${pedido.status}</span></td>
        <td>${pedido.data}</td>
        <td>${pedido.valor}</td>
        <td>
          <button onclick="visualizarPedido('${pedido.cliente}')">👁️</button>
          <button onclick="editarPedido('${pedido.cliente}')">✏️</button>
        </td>
      </tr>
    `;
  });
}

renderPedidos(); // Exibir na carga inicial
document.getElementById('filterInput').addEventListener('input', filtrarPedidos);
document.getElementById('filterDate').addEventListener('input', filtrarPedidos);
document.getElementById('filterStatus').addEventListener('change', filtrarPedidos);

function filtrarPedidos() {
  const input = document.getElementById('filterInput').value.toLowerCase();
  const data = document.getElementById('filterDate').value;
  const status = document.getElementById('filterStatus').value;

  const resultados = pedidos.filter(p => {
    return (
      (p.cliente.toLowerCase().includes(input) || p.produto.toLowerCase().includes(input)) &&
      (!data || p.data === data) &&
      (!status || p.status === status)
    );
  });

  renderPedidos(resultados);
}
function visualizarPedido(cliente) {
  const pedido = pedidos.find(p => p.cliente === cliente);
  alert(`Cliente: ${pedido.cliente}\nProduto: ${pedido.produto}\nStatus: ${pedido.status}\nValor: ${pedido.valor}`);
}

function editarPedido(cliente) {
  const pedido = pedidos.find(p => p.cliente === cliente);
  const novoStatus = prompt(`Status atual: ${pedido.status}\nNovo status (pendente, entregue, cancelado):`);

  if (['pendente', 'entregue', 'cancelado'].includes(novoStatus)) {
    pedido.status = novoStatus;
    renderPedidos();
  } else {
    alert('Status inválido.');
  }
}
