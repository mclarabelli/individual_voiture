const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(express.json());


// ======================================================
// CONFIGURAÇÃO DO BANCO
// ======================================================

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'voiture_estoque',
  waitForConnections: true,
  connectionLimit: 10,
});

// ======================================================
// TESTES DE CONEXÃO
// ======================================================


// TESTE DA API
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando!'
  });
});


// TESTE DA TABELA FUNCIONARIO
app.get('/api/test-funcionario', async (req, res) => {

  try {

    const [rows] = await db.query(
      `
      SELECT
        id,
        funcionario_nome,
        funcionario_email,
        funcionario_cargo,
        funcionario_permissao
      FROM funcionario
      LIMIT 1
      `
    );

    res.json({
      success: true,
      funcionario: rows[0] || null
    });

  } catch (error) {

    console.error('Erro ao consultar funcionário:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});


// TESTE DE CONEXÃO COM PRODUTOS
app.get('/api/test-products', async (req, res) => {

  try {

    const [rows] = await db.query(
      `
      SELECT
        p.id,
        p.produto_nome,
        p.produto_categoria,
        p.produto_preco_venda,
        COALESCE(SUM(e.estoque_quantidade), 0) AS estoque_quantidade
      FROM produto p
      LEFT JOIN estoque e
        ON e.produto_id = p.id
      GROUP BY
        p.id,
        p.produto_nome,
        p.produto_categoria,
        p.produto_preco_venda
      ORDER BY p.produto_nome ASC
      `
    );

    res.json({
      success: true,
      quantidade: rows.length,
      produtos: rows
    });

  } catch (error) {

    console.error('Erro no teste de produtos:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

});


// ======================================================
// LOGIN
// ======================================================

app.post('/api/login', async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'E-mail e senha são obrigatórios.'
    });
  }

  try {

    const [rows] = await db.query(
      `
      SELECT
        id,
        funcionario_nome,
        funcionario_senha,
        funcionario_cpf,
        funcionario_cep,
        funcionario_email,
        funcionario_ddi,
        funcionario_ddd,
        funcionario_telefone,
        funcionario_cargo,
        funcionario_permissao,
        funcionario_acesso,
      FROM funcionario
      WHERE funcionario_email = ?
      `,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'E-mail ou senha inválidos.'
      });
    }

    const funcionario = rows[0];

    const senhaValida = await bcrypt.compare(
      password,
      funcionario.funcionario_senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        message: 'E-mail ou senha inválidos.'
      });
    }

    delete funcionario.funcionario_senha;

    res.json({
      success: true,
      user: funcionario
    });

  } catch (error) {

    console.error('Erro no login:', error);

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.'
    });

  }

});


// ======================================================
// LISTAR PRODUTOS
// ======================================================

app.get('/api/products', async (req, res) => {

  try {

    const [products] = await db.query(
      `
      SELECT
        p.id,
        p.produto_nome,
        p.produto_descricao,
        p.produto_categoria,
        p.produto_quantidade_minima,
        p.produto_preco_custo,
        p.produto_preco_venda,
        p.produto_peso,
        p.produto_localizacao,
        p.imagem_nome,
        p.imagem_tipo,

        CASE
          WHEN p.imagem_blob IS NOT NULL
            THEN 1
          ELSE 0
        END AS possui_imagem,

        COALESCE(
          SUM(e.estoque_quantidade),
          0
        ) AS estoque_quantidade

      FROM produto p

      LEFT JOIN estoque e
        ON e.produto_id = p.id

      GROUP BY
        p.id,
        p.produto_nome,
        p.produto_descricao,
        p.produto_categoria,
        p.produto_quantidade_minima,
        p.produto_preco_custo,
        p.produto_preco_venda,
        p.produto_peso,
        p.produto_localizacao,
        p.imagem_nome,
        p.imagem_tipo,
        p.imagem_blob

      ORDER BY p.produto_nome ASC
      `
    );

    res.json(products);

  } catch (error) {

    console.error('Erro ao buscar produtos:', error);

    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produtos.',
      error: error.message
    });

  }

});


// ======================================================
// BUSCAR PRODUTO POR ID
// ======================================================

app.get('/api/products/:identifier', async (req, res) => {

  const { identifier } = req.params;

  try {

    const [rows] = await db.query(
      `
      SELECT
        p.id,
        p.produto_nome,
        p.produto_descricao,
        p.produto_categoria,
        p.produto_quantidade_minima,
        p.produto_preco_custo,
        p.produto_preco_venda,
        p.produto_peso,
        p.produto_localizacao,
        p.imagem_nome,
        p.imagem_tipo,
        COALESCE(SUM(e.estoque_quantidade), 0) AS estoque_quantidade

      FROM produto p

      LEFT JOIN estoque e
        ON e.produto_id = p.id

      WHERE p.id = ?

      GROUP BY
        p.id,
        p.produto_nome,
        p.produto_descricao,
        p.produto_categoria,
        p.produto_quantidade_minima,
        p.produto_preco_custo,
        p.produto_preco_venda,
        p.produto_peso,
        p.produto_localizacao,
        p.imagem_nome,
        p.imagem_tipo
      `,
      [identifier]
    );

    if (rows.length === 0) {

      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado.'
      });

    }

    res.json(rows[0]);

  } catch (error) {

    console.error('Erro ao buscar produto:', error);

    res.status(500).json({
      success: false,
      message: 'Erro ao buscar produto.',
      error: error.message
    });

  }

});


// ======================================================
// BUSCAR IMAGEM DO PRODUTO
// ======================================================

app.get('/api/products/:id/image', async (req, res) => {

  const { id } = req.params;

  try {

    const [rows] = await db.query(
      `
      SELECT
        imagem_nome,
        imagem_tipo,
        imagem_blob
      FROM produto
      WHERE id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).send('Produto não encontrado.');
    }

    const produto = rows[0];

    if (!produto.imagem_blob) {
      return res.status(404).send('Produto não possui imagem.');
    }

    const tipoImagem =
      produto.imagem_tipo || 'image/jpeg';

    res.setHeader('Content-Type', tipoImagem);
    res.setHeader('Cache-Control', 'no-cache');

    res.send(produto.imagem_blob);

  } catch (error) {

    console.error('Erro ao buscar imagem do produto:', error);

    res.status(500).send('Erro ao buscar imagem.');

  }

});


// ======================================================
// DASHBOARD
// ======================================================

app.get('/api/dashboard', async (req, res) => {

  try {

    const [[result]] = await db.query(
      `
      SELECT
        COALESCE(SUM(e.estoque_quantidade), 0) AS totalProducts
      FROM estoque e
      `
    );

    const [[lowStock]] = await db.query(
      `
      SELECT
        COUNT(*) AS lowStockCount
      FROM (
        SELECT
          p.id,
          p.produto_quantidade_minima,
          COALESCE(SUM(e.estoque_quantidade), 0) AS quantidade
        FROM produto p
        LEFT JOIN estoque e
          ON e.produto_id = p.id
        GROUP BY
          p.id,
          p.produto_quantidade_minima
      ) AS produtos
      WHERE quantidade <= produto_quantidade_minima
      `
    );

    res.json({
      totalProducts: result.totalProducts || 0,
      lowStockCount: lowStock.lowStockCount || 0,
      recentActivities: []
    });

  } catch (error) {

    console.error('Erro no dashboard:', error);

    res.status(500).json({
      success: false,
      message: 'Erro ao carregar dashboard.',
      error: error.message
    });

  }

});


// ======================================================
// SERVIDOR
// ======================================================

const PORT = 3000;

app.listen(
  PORT,
  '0.0.0.0',
  () => {

    console.log(
      `Servidor rodando na porta ${PORT}`
    );

  }
);