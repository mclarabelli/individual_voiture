import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import api from '../src/services/api';

export default function EntryScreen({ navigation }) {

  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFornecedor, setSelectedFornecedor] = useState(null);

  const [quantity, setQuantity] = useState('');

  const [productModalVisible, setProductModalVisible] = useState(false);
  const [fornecedorModalVisible, setFornecedorModalVisible] = useState(false);

  const [searchText, setSearchText] = useState('');


  useEffect(() => {

  // CARREGAR PRODUTOS
  api
    .get('/api/listagem_produto')
    .then((res) => {
      console.log("PRODUTOS:", res.data);
      setProdutos(res.data);
    })
    .catch((error) => {
      console.log(
        "ERRO PRODUTOS:",
        error.response?.data || error.message
      );
    });

  // CARREGAR FORNECEDORES
  api
    .get('/api/listagem_fornecedor')
    .then((res) => {
      console.log("FORNECEDORES:", res.data);
      setFornecedores(res.data);
    })
    .catch((error) => {
      console.log(
        "ERRO FORNECEDORES:",
        error.response?.data || error.message
      );
    });

}, []);
  // ======================================================
  // CARREGAR PRODUTOS E FORNECEDORES
  // ======================================================

  useEffect(() => {
    carregarProdutos();
    carregarFornecedores();
  }, []);

  // ======================================================
  // PRODUTOS
  // ======================================================

  const carregarProdutos = async () => {
    try {
      const response = await api.get('/api/listagem_produto');

      console.log('========== PRODUTOS ==========');
      console.log('STATUS:', response.status);
      console.log('DATA:', response.data);
      console.log('É ARRAY?', Array.isArray(response.data));
      console.log('==============================');

      if (Array.isArray(response.data)) {
        setProdutos(response.data);
      } else {
        setProdutos([]);
      }

    } catch (error) {
      console.log('========== ERRO PRODUTOS ==========');
      console.log('STATUS:', error.response?.status);
      console.log('DATA:', error.response?.data);
      console.log('MENSAGEM:', error.message);
      console.log('===================================');

      Alert.alert(
        'Erro',
        'Não foi possível carregar os produtos.'
      );
    }
  };

  // ======================================================
  // FORNECEDORES
  // ======================================================

  const carregarFornecedores = async () => {
    try {
      const response = await api.get('/api/listagem_fornecedor');

      console.log('========== FORNECEDORES ==========');
      console.log('STATUS:', response.status);
      console.log('DATA:', response.data);
      console.log('É ARRAY?', Array.isArray(response.data));

      if (Array.isArray(response.data)) {

        console.log(
          'QUANTIDADE DE FORNECEDORES:',
          response.data.length
        );

        response.data.forEach((fornecedor, index) => {
          console.log(
            `FORNECEDOR ${index}:`,
            fornecedor
          );
        });

        setFornecedores(response.data);

      } else {

        console.log(
          'A resposta de fornecedores NÃO é um array.'
        );

        setFornecedores([]);
      }

      console.log('==================================');

    } catch (error) {

      console.log('========== ERRO FORNECEDORES ==========');
      console.log('STATUS:', error.response?.status);
      console.log('DATA:', error.response?.data);
      console.log('MENSAGEM:', error.message);
      console.log('========================================');

      setFornecedores([]);

      Alert.alert(
        'Erro',
        'Não foi possível carregar os fornecedores.'
      );
    }
  };

  // ======================================================
  // PRODUTOS FILTRADOS
  // ======================================================

  const filteredProdutos = produtos.filter((p) =>
    (p.produto_nome || '')
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  // ======================================================
  // FORNECEDORES FILTRADOS
  // ======================================================

  const filteredFornecedores = fornecedores.filter((f) =>
    (f.fornecedor_nome || '')
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  // ======================================================
  // NOVO ESTOQUE
  // ======================================================

  const newStock =
    (selectedProduct?.estoque_quantidade || 0) +
    Number(quantity || 0);

  // ======================================================
  // ABRIR MODAL PRODUTO
  // ======================================================

  const openProductModal = () => {
    setSearchText('');
    setProductModalVisible(true);
  };

  // ======================================================
  // ABRIR MODAL FORNECEDOR
  // ======================================================

  const openFornecedorModal = () => {
    setSearchText('');
    setFornecedorModalVisible(true);
  };

  // ======================================================
  // CONFIRMAR ENTRADA
  // ======================================================

  const handleConfirmEntry = async () => {

    const qtyNum = Number(quantity);

    if (!selectedProduct) {
      Alert.alert(
        'Erro',
        'Selecione um produto.'
      );
      return;
    }

    if (!selectedFornecedor) {
      Alert.alert(
        'Erro',
        'Selecione um fornecedor.'
      );
      return;
    }

    if (!quantity || isNaN(qtyNum) || qtyNum <= 0) {
      Alert.alert(
        'Erro',
        'Insira uma quantidade válida.'
      );
      return;
    }

    try {

      console.log('========== ENTRADA ==========');

      console.log({
        produto_id: selectedProduct.id,
        fornecedor_id: selectedFornecedor.id,
        quantidade: qtyNum,
      });

      const response = await api.post(
        '/api/entrada_rapida',
        {
          produto_id: selectedProduct.id,
          fornecedor_id: selectedFornecedor.id,
          quantidade: qtyNum,
        }
      );

      console.log('STATUS:', response.status);
      console.log('RESPOSTA:', response.data);

      const estoqueAtualizado =
        response.data.estoque_restante;

      setSelectedProduct((prev) => ({
        ...prev,
        estoque_quantidade: estoqueAtualizado,
      }));

      setProdutos((prevProdutos) =>
        prevProdutos.map((produto) =>
          produto.id === selectedProduct.id
            ? {
                ...produto,
                estoque_quantidade:
                  estoqueAtualizado,
              }
            : produto
        )
      );

      setQuantity('');

      Alert.alert(
        'Sucesso',
        response.data.mensagem ||
          'Entrada realizada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );

    } catch (error) {

      console.log(
        'ERRO NA ENTRADA:',
        error.response?.data || error
      );

      Alert.alert(
        'Erro',
        error.response?.data?.erro ||
          'Erro ao registrar entrada.'
      );
    }
  };

  // ======================================================
  // TELA
  // ======================================================

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.title}>
          Entrada de Estoque
        </Text>

        <Text style={styles.subtitle}>
          Registre a entrada de produtos
        </Text>

      </View>

      {/* PRODUTO */}

      <Text style={styles.sectionTitle}>
        Produto
      </Text>

      <TouchableOpacity
        style={styles.selectButton}
        activeOpacity={0.85}
        onPress={openProductModal}
      >

        <View style={styles.selectIcon}>

          <Ionicons
            name="cube-outline"
            size={24}
            color="#094F63"
          />

        </View>

        <Text
          style={styles.selectText}
          numberOfLines={1}
        >

          {selectedProduct
            ? selectedProduct.produto_nome
            : 'Selecionar Produto'}

        </Text>

        <Ionicons
          name="chevron-down"
          size={21}
          color="#64748B"
        />

      </TouchableOpacity>

      {/* PRODUTO SELECIONADO */}

      {selectedProduct && (

        <View style={styles.productCard}>

          <View style={styles.productIcon}>

            <Ionicons
              name="cube"
              size={28}
              color="#094F63"
            />

          </View>

          <View style={styles.productInfo}>

            <Text style={styles.productName}>
              {selectedProduct.produto_nome}
            </Text>

            <Text style={styles.stock}>
              Estoque Atual:{' '}
              {selectedProduct.estoque_quantidade}
            </Text>

          </View>

        </View>

      )}

      {/* FORNECEDOR */}

      <Text style={styles.sectionTitle}>
        Fornecedor
      </Text>

      <TouchableOpacity
        style={styles.selectButton}
        activeOpacity={0.85}
        onPress={openFornecedorModal}
      >

        <View style={styles.selectIcon}>

          <Ionicons
            name="business-outline"
            size={24}
            color="#094F63"
          />

        </View>

        <Text
          style={styles.selectText}
          numberOfLines={1}
        >

          {selectedFornecedor
            ? selectedFornecedor.fornecedor_nome
            : 'Selecionar Fornecedor'}

        </Text>

        <Ionicons
          name="chevron-down"
          size={21}
          color="#64748B"
        />

      </TouchableOpacity>

      {/* FORNECEDOR SELECIONADO */}

      {selectedFornecedor && (

        <View style={styles.productCard}>

          <View style={styles.productIcon}>

            <Ionicons
              name="business"
              size={28}
              color="#094F63"
            />

          </View>

          <View style={styles.productInfo}>

            <Text style={styles.productName}>
              {selectedFornecedor.fornecedor_nome}
            </Text>

            {selectedFornecedor.fornecedor_cnpj && (

              <Text style={styles.stock}>
                CNPJ:{' '}
                {selectedFornecedor.fornecedor_cnpj}
              </Text>

            )}

          </View>

        </View>

      )}

      {/* QUANTIDADE */}

      <Text style={styles.sectionTitle}>
        Quantidade de Entrada
      </Text>

      <View style={styles.inputContainer}>

        <Ionicons
          name="add-circle-outline"
          size={23}
          color="#094F63"
        />

        <TextInput
          style={styles.input}
          placeholder="Digite a quantidade"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />

      </View>

      {/* RESULTADO */}

      <View style={styles.resultCard}>

        <View style={styles.resultIcon}>

          <Ionicons
            name="cube-outline"
            size={23}
            color="#094F63"
          />

        </View>

        <Text style={styles.resultText}>
          Novo Estoque
        </Text>

        <Text style={styles.resultValue}>
          {newStock}
        </Text>

      </View>

      {/* BOTÃO */}

      <TouchableOpacity
        style={styles.confirmButton}
        activeOpacity={0.85}
        onPress={handleConfirmEntry}
      >

        <Ionicons
          name="arrow-down-circle-outline"
          size={25}
          color="#FFFFFF"
        />

        <Text style={styles.confirmText}>
          Confirmar Entrada
        </Text>

      </TouchableOpacity>

      <View style={{ height: 40 }} />

      {/* ==================================================
          MODAL PRODUTO
      ================================================== */}

      <Modal
        visible={productModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() =>
          setProductModalVisible(false)
        }
      >

        <View style={styles.modalOverlay}>

          <View style={styles.modalContent}>

            <View style={styles.modalHeader}>

              <Text style={styles.modalTitle}>
                Selecionar Produto
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setProductModalVisible(false)
                }
              >

                <Ionicons
                  name="close"
                  size={26}
                  color="#64748B"
                />

              </TouchableOpacity>

            </View>

            <View style={styles.searchContainer}>

              <Ionicons
                name="search"
                size={21}
                color="#94A3B8"
              />

              <TextInput
                style={styles.searchInput}
                placeholder="Buscar produto..."
                placeholderTextColor="#94A3B8"
                value={searchText}
                onChangeText={setSearchText}
              />

            </View>

            <FlatList
              data={filteredProdutos}
              keyExtractor={(item) =>
                String(item.id)
              }
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  Nenhum produto encontrado.
                </Text>
              }
              renderItem={({ item }) => (

                <TouchableOpacity
                  style={styles.listItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedProduct(item);
                    setProductModalVisible(false);
                    setSearchText('');
                  }}
                >

                  <View style={styles.listIcon}>

                    <Ionicons
                      name="cube-outline"
                      size={21}
                      color="#094F63"
                    />

                  </View>

                  <View style={styles.listInfo}>

                    <Text style={styles.listItemText}>
                      {item.produto_nome}
                    </Text>

                    <Text style={styles.listItemSub}>
                      Estoque:{' '}
                      {item.estoque_quantidade}
                    </Text>

                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#94A3B8"
                  />

                </TouchableOpacity>

              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() =>
                setProductModalVisible(false)
              }
            >

              <Text style={styles.closeButtonText}>
                Fechar
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </Modal>

      {/* ==================================================
          MODAL FORNECEDOR
      ================================================== */}

      <Modal
        visible={fornecedorModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() =>
          setFornecedorModalVisible(false)
        }
      >

        <View style={styles.modalOverlay}>

          <View style={styles.modalContent}>

            <View style={styles.modalHeader}>

              <Text style={styles.modalTitle}>
                Selecionar Fornecedor
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setFornecedorModalVisible(false)
                }
              >

                <Ionicons
                  name="close"
                  size={26}
                  color="#64748B"
                />

              </TouchableOpacity>

            </View>

            <View style={styles.searchContainer}>

              <Ionicons
                name="search"
                size={21}
                color="#94A3B8"
              />

              <TextInput
                style={styles.searchInput}
                placeholder="Buscar fornecedor..."
                placeholderTextColor="#94A3B8"
                value={searchText}
                onChangeText={setSearchText}
              />

            </View>

            <FlatList
              data={filteredFornecedores}
              keyExtractor={(item) =>
                String(item.id)
              }
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  Nenhum fornecedor encontrado.
                </Text>
              }
              renderItem={({ item }) => (

                <TouchableOpacity
                  style={styles.listItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedFornecedor(item);
                    setFornecedorModalVisible(false);
                    setSearchText('');
                  }}
                >

                  <View style={styles.listIcon}>

                    <Ionicons
                      name="business-outline"
                      size={21}
                      color="#094F63"
                    />

                  </View>

                  <View style={styles.listInfo}>

                    <Text style={styles.listItemText}>
                      {item.fornecedor_nome}
                    </Text>

                    {item.fornecedor_cnpj && (

                      <Text style={styles.listItemSub}>
                        CNPJ:{' '}
                        {item.fornecedor_cnpj}
                      </Text>

                    )}

                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#94A3B8"
                  />

                </TouchableOpacity>

              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() =>
                setFornecedorModalVisible(false)
              }
            >

              <Text style={styles.closeButtonText}>
                Fechar
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </Modal>

    </ScrollView>
  );
}

// ======================================================
// ESTILOS
// ======================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 55,
    marginBottom: 5,
  },

  title: {
    color: '#094F63',
    fontSize: 30,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#64748B',
    marginTop: 5,
    fontSize: 15,
  },

  sectionTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 14,
  },

  selectButton: {
    backgroundColor: '#FFFFFF',
    height: 68,
    borderRadius: 20,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  selectIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#E2F0F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  selectText: {
    flex: 1,
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '600',
  },

  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#094F63',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 7,
    elevation: 3,
  },

  productIcon: {
    width: 58,
    height: 58,
    backgroundColor: '#E2F0F4',
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    color: '#0F172A',
    fontSize: 19,
    fontWeight: 'bold',
  },

  stock: {
    color: '#0F766E',
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 14,
  },

  inputContainer: {
    backgroundColor: '#FFFFFF',
    height: 65,
    borderRadius: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    color: '#0F172A',
    fontSize: 18,
  },

  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    marginTop: 28,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 7,
    elevation: 3,
  },

  resultIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#E2F0F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  resultText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '500',
  },

  resultValue: {
    color: '#094F63',
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 7,
  },

  confirmButton: {
    backgroundColor: '#094F63',
    height: 65,
    borderRadius: 22,
    marginTop: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#094F63',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },

  confirmText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#F1F5F9',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '80%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  modalTitle: {
    color: '#094F63',
    fontSize: 21,
    fontWeight: 'bold',
  },

  searchContainer: {
    backgroundColor: '#FFFFFF',
    height: 55,
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#0F172A',
    fontSize: 16,
  },

  listItem: {
    backgroundColor: '#FFFFFF',
    minHeight: 65,
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  listIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E2F0F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  listInfo: {
    flex: 1,
  },

  listItemText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '600',
  },

  listItemSub: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 3,
  },

  emptyText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 15,
    paddingVertical: 30,
  },

  closeButton: {
    backgroundColor: '#094F63',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },

  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

});