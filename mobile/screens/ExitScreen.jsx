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

export default function ExitScreen({ navigation }) {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  const [quantity, setQuantity] = useState('');

  const [productModalVisible, setProductModalVisible] = useState(false);
  const [clientModalVisible, setClientModalVisible] = useState(false);

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    api
      .get('/api/listagem_produto')
      .then((res) => setProdutos(res.data))
      .catch(console.log);

    api
      .get('/api/listagem_cliente')
      .then((res) => setClientes(res.data))
      .catch(console.log);
  }, []);

  const handleConfirmExit = async () => {
    const qtyNum = Number(quantity);

    if (!selectedProduct) {
      Alert.alert('Erro', 'Selecione um produto.');
      return;
    }

    if (!selectedClient) {
      Alert.alert('Erro', 'Selecione um cliente.');
      return;
    }

    if (!quantity || isNaN(qtyNum) || qtyNum <= 0) {
      Alert.alert('Erro', 'Insira uma quantidade válida.');
      return;
    }

    if (
      qtyNum >
      (selectedProduct.estoque_quantidade || 0)
    ) {
      Alert.alert(
        'Erro',
        'Quantidade solicitada é maior que o estoque atual.'
      );
      return;
    }

    try {
      const response = await api.post(
        '/api/saida_rapida',
        {
          produto_id: selectedProduct.id,
          cliente_id: selectedClient.id,
          quantidade: qtyNum,
        }
      );

      const estoqueRestante =
        response.data.estoque_restante;

      // Atualiza o produto selecionado
      setSelectedProduct((prev) => ({
        ...prev,
        estoque_quantidade: estoqueRestante,
      }));

      // Atualiza o produto dentro da lista
      setProdutos((prevProdutos) =>
        prevProdutos.map((produto) =>
          produto.id === selectedProduct.id
            ? {
                ...produto,
                estoque_quantidade: estoqueRestante,
              }
            : produto
        )
      );

      // Limpa a quantidade
      setQuantity('');

      Alert.alert(
        'Sucesso',
        response.data.mensagem ||
          'Saída realizada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.log(
        'ERRO NA SAÍDA:',
        error.response?.data || error
      );

      Alert.alert(
        'Erro',
        error.response?.data?.erro ||
          'Erro ao registrar saída.'
      );
    }
  };

  const remainingStock =
    (selectedProduct?.estoque_quantidade || 0) -
    Number(quantity || 0);

  const filteredProdutos = produtos.filter((p) =>
    (p.produto_nome || '')
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const filteredClientes = clientes.filter((c) =>
    (c.cliente_nome || '')
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const openProductModal = () => {
    setSearchText('');
    setProductModalVisible(true);
  };

  const openClientModal = () => {
    setSearchText('');
    setClientModalVisible(true);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}

      <View style={styles.header}>
        <Text style={styles.title}>
          Saída de Estoque
        </Text>

        <Text style={styles.subtitle}>
          Registre a retirada de produtos
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

      {/* CLIENTE */}

      <Text style={styles.sectionTitle}>
        Cliente
      </Text>

      <TouchableOpacity
        style={styles.selectButton}
        activeOpacity={0.85}
        onPress={openClientModal}
      >
        <View style={styles.selectIcon}>
          <Ionicons
            name="person-outline"
            size={24}
            color="#094F63"
          />
        </View>

        <Text
          style={styles.selectText}
          numberOfLines={1}
        >
          {selectedClient
            ? selectedClient.cliente_nome
            : 'Selecionar Cliente'}
        </Text>

        <Ionicons
          name="chevron-down"
          size={21}
          color="#64748B"
        />
      </TouchableOpacity>

      {/* QUANTIDADE */}

      <Text style={styles.sectionTitle}>
        Quantidade de Saída
      </Text>

      <View style={styles.inputContainer}>

        <Ionicons
          name="remove-circle-outline"
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
            color="#DC2626"
          />
        </View>

        <Text style={styles.resultText}>
          Estoque Restante
        </Text>

        <Text
          style={[
            styles.resultValue,
            {
              color:
                remainingStock < 0
                  ? '#DC2626'
                  : '#094F63',
            },
          ]}
        >
          {remainingStock < 0
            ? 0
            : remainingStock}
        </Text>

      </View>

      {/* BOTÃO CONFIRMAR */}

      <TouchableOpacity
        style={styles.confirmButton}
        activeOpacity={0.85}
        onPress={handleConfirmExit}
      >

        <Ionicons
          name="arrow-up-circle-outline"
          size={25}
          color="#FFFFFF"
        />

        <Text style={styles.confirmText}>
          Confirmar Saída
        </Text>

      </TouchableOpacity>

      <View style={{ height: 40 }} />

      {/* ================================================== */}
      {/* MODAL PRODUTO */}
      {/* ================================================== */}

      <Modal
        visible={productModalVisible}
        animationType="slide"
        transparent
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

            {/* PESQUISA */}

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

            {/* LISTA */}

            <FlatList
              data={filteredProdutos}
              keyExtractor={(item) =>
                String(item.id)
              }
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedProduct(item);
                    setProductModalVisible(false);
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

      {/* ================================================== */}
      {/* MODAL CLIENTE */}
      {/* ================================================== */}

      <Modal
        visible={clientModalVisible}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>

          <View style={styles.modalContent}>

            <View style={styles.modalHeader}>

              <Text style={styles.modalTitle}>
                Selecionar Cliente
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setClientModalVisible(false)
                }
              >
                <Ionicons
                  name="close"
                  size={26}
                  color="#64748B"
                />
              </TouchableOpacity>

            </View>

            {/* PESQUISA */}

            <View style={styles.searchContainer}>

              <Ionicons
                name="search"
                size={21}
                color="#94A3B8"
              />

              <TextInput
                style={styles.searchInput}
                placeholder="Buscar cliente..."
                placeholderTextColor="#94A3B8"
                value={searchText}
                onChangeText={setSearchText}
              />

            </View>

            {/* LISTA */}

            <FlatList
              data={filteredClientes}
              keyExtractor={(item) =>
                String(item.id)
              }
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedClient(item);
                    setClientModalVisible(false);
                  }}
                >

                  <View style={styles.listIcon}>
                    <Ionicons
                      name="person-outline"
                      size={21}
                      color="#094F63"
                    />
                  </View>

                  <View style={styles.listInfo}>

                    <Text style={styles.listItemText}>
                      {item.cliente_nome}
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
                setClientModalVisible(false)
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

const styles = StyleSheet.create({

  /* ================================================== */
  /* CONTAINER */
  /* ================================================== */

  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 20,
  },

  /* ================================================== */
  /* HEADER */
  /* ================================================== */

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

  /* ================================================== */
  /* TÍTULOS */
  /* ================================================== */

  sectionTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 14,
  },

  /* ================================================== */
  /* SELETORES */
  /* ================================================== */

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

  /* ================================================== */
  /* PRODUTO */
  /* ================================================== */

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

  /* ================================================== */
  /* INPUT */
  /* ================================================== */

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

  /* ================================================== */
  /* RESULTADO */
  /* ================================================== */

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
    backgroundColor: '#FEF2F2',

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
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 7,
  },

  /* ================================================== */
  /* BOTÃO */
  /* ================================================== */

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

  /* ================================================== */
  /* MODAL */
  /* ================================================== */

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

  /* ================================================== */
  /* PESQUISA DO MODAL */
  /* ================================================== */

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

  /* ================================================== */
  /* LISTA DO MODAL */
  /* ================================================== */

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

  /* ================================================== */
  /* FECHAR MODAL */
  /* ================================================== */

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