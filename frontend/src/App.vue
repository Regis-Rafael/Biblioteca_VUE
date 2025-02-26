<template>
  <div class="max-w-4xl mx-auto p-6 bg-gradient-to-b from-gray-100 to-white rounded-lg shadow-lg">
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">📚 Biblioteca</h1>

    <div class="p-4 bg-white rounded-lg shadow-md mb-6">
      <h3 class="text-lg font-bold text-gray-700 mb-2">Adicionar Livro:</h3>
      <div class=" grid-cols-1 sm:grid-cols-3 gap-4 items-center mb-4">
        <input v-model="novoLivro.titulo" type="text" class="input w-full" placeholder="Título" />
        <input v-model="novoLivro.autor" type="text" class="input w-full" placeholder="Autor" />
        <input v-model.number="novoLivro.anoPublicacao" type="number" class="input w-full" placeholder="Ano" />
      </div>
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <label class="flex items-center space-x-2">
          <span class="text-gray-700">Disponível</span>
          <div class="switch">
            <input v-model="novoLivro.disponibilidade" type="checkbox" class="hidden" id="switch" />
            <label for="switch" class="toggle"></label>
          </div>
        </label>
        <button @click="adicionarLivro" class="btn w-full sm:w-auto">Adicionar</button>
      </div>
    </div>

    <div class="p-4 bg-white rounded-lg shadow-md mb-6">
      <h3 class="text-lg font-bold text-gray-700 mb-2">Pesquisar Livro:</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input v-model="codigoBusca" class="input w-full" placeholder="Código do Livro" />
        <button @click="buscarLivroPorCodigo" class="btn w-full">Buscar</button>
      </div>
    </div>

    <div class="p-4 bg-white rounded-lg shadow-md flex justify-center">
      <div class="w-full max-w-4xl">
        <h3 class="text-lg font-bold text-gray-700 mb-4 text-center">📖 Lista de Livros</h3>
        <table id="livrosTable" class="w-full border-collapse text-center">
          <thead class="bg-gray-200">
            <tr>
              <th class="border p-2">Código</th>
              <th class="border p-2">Título</th>
              <th class="border p-2">Autor</th>
              <th class="border p-2">Ano</th>
              <th class="border p-2">Disponibilidade</th>
              <th class="border p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="livro in livrosFiltrados" :key="livro.codigo" class="bg-white">
              <td class="border p-2">{{ livro.codigo }}</td>
              <td class="border p-2">{{ livro.titulo }}</td>
              <td class="border p-2">{{ livro.autor }}</td>
              <td class="border p-2">{{ livro.anoPublicacao }}</td>
              <td class="border p-2">{{ livro.disponibilidade ? 'Disponível' : 'Indisponível' }}</td>
              <td class="border p-2">
                <button @click="removerLivro(livro.codigo)" class="btn-remove">Remover</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const livros = ref([]);
const livrosFiltrados = ref([]);
const novoLivro = ref({ titulo: "", autor: "", anoPublicacao: "", disponibilidade: false });
const codigoBusca = ref("");

const carregarLivros = async () => {
  try {
    const res = await axios.get("/api/livros");
    livros.value = res.data;
    livrosFiltrados.value = livros.value;
  } catch (error) {
    console.error("Erro ao carregar livros:", error);
  }
};

const adicionarLivro = async () => {
  if (!novoLivro.value.titulo || !novoLivro.value.autor || !novoLivro.value.anoPublicacao) {
    alert("Preencha todos os campos!");
    return;
  }
  try {
    const novoCodigo = livros.value.length > 0 ? livros.value[livros.value.length - 1].codigo + 1 : 1;
    await axios.post("/api/livros", {
      titulo: novoLivro.value.titulo.trim(),
      autor: novoLivro.value.autor.trim(),
      anoPublicacao: Number(novoLivro.value.anoPublicacao),
      disponibilidade: novoLivro.value.disponibilidade,
      codigo: novoCodigo,
    });
    novoLivro.value = { titulo: "", autor: "", anoPublicacao: "", disponibilidade: false };
    carregarLivros();
  } catch (error) {
    console.error("Erro ao adicionar livro:", error);
    alert("Erro ao adicionar livro!");
  }
};

const removerLivro = async (codigo) => {
  try {
    await axios.delete(`/api/livros/${codigo}`);
    livros.value = livros.value.filter(livro => livro.codigo !== codigo);
    livrosFiltrados.value = livros.value;
  } catch (error) {
    console.error("Erro ao remover livro:", error);
    alert("Erro ao remover livro!");
  }
};

const buscarLivroPorCodigo = () => {
  if (!codigoBusca.value) {
    livrosFiltrados.value = livros.value;
    return;
  }
  if (isNaN(codigoBusca.value)) {
    alert("Digite um código válido!");
    return;
  }

  const resultado = livros.value.filter(livro => livro.codigo.toString() === codigoBusca.value);
  if (resultado.length === 0) {
    alert("Livro não encontrado!");
    return;
  }

  livrosFiltrados.value = resultado;
};

onMounted(carregarLivros);
</script>

<style scoped>
.input {
  padding: 10px;
  width: 100%;
  margin-bottom: 10px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  outline: none;
  transition: 0.2s;
}
.input:hover {
  border-color: #42b883;
  box-shadow: 0 0 5px rgba(66, 184, 131, 0.5);
}
.input:focus {
  border-color: #42b883;
  box-shadow: 0 0 5px rgba(66, 184, 131, 0.5);
}

.btn {
  background-color: #ddd;
  margin-left: 10px;
  width: 100%;
  color: black;
  padding: 10px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}
.btn:hover {
  background-color: #369972;
}
.btn-remove {
  background-color: #e3342f;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}
.btn-remove:hover {
  background-color: #cc1f1a;
}
#livrosTable {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
#livrosTable th, #livrosTable td {
  border: 1px solid #ddd;
  padding: 10px;
}
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  margin-bottom: 20px;
  margin-left: 10px;
  height: 22px;
}
.switch .toggle {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  border-radius: 22px;
  transition: 0.4s;
}
.switch .toggle:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 50%;
  transition: 0.4s;
}
input:checked + .toggle {
  background-color: #42b883;
}
input:checked + .toggle:before {
  transform: translateX(18px);
}
@media (max-width: 640px) {
  .input, .btn {
    width: 100%;
  }
  #livrosTable {
    align-items: center;
    font-size: 8px;
    padding: 0px;
  }
}
</style>
