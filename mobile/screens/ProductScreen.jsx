import React, { useState, useCallback } from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import api from '../src/services/api';

export default function ProductsScreen() {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // BUSCAR PRODUTOS
  // ======================================================

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get('/api/listagem_produto', {
        headers: {
          Accept: 'application/json',
        },
      });

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.log(
          'A API não retornou uma lista de produtos:',
          response.data
        );

        setProducts([]);
      }
    } catch (error) {
      console.log(
        'Erro ao buscar produtos:',
        error.response?.data || error.message
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // ATUALIZA A LISTA AO ENTRAR NA TELA
  // ======================================================

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  // ======================================================
  // FILTRO
  // ======================================================

  const filteredProducts = products.filter((produto) => {
    const nome = String(
      produto?.produto_nome ?? ''
    ).toLowerCase();

    const categoria = String(
      produto?.produto_categoria ?? ''
    ).toLowerCase();

    const localizacao = String(
      produto?.produto_localizacao ?? ''
    ).toLowerCase();

    const termo = search.trim().toLowerCase();

    if (!termo) {
      return true;
    }

    return (
      nome.includes(termo) ||
      categoria.includes(termo) ||
      localizacao.includes(termo)
    );
  });

  // ======================================================
  // CARD DO PRODUTO
  // ======================================================

  const renderProduct = ({ item }) => {
    const estoque = Number(
      item?.estoque_quantidade ?? 0
    );

    const estoqueMinimo = Number(
      item?.produto_quantidade_minima ?? 0
    );

    const preco = Number(
      item?.produto_preco_venda ?? 0
    );

    const possuiImagem =
      item?.possui_imagem === true ||
      item?.possui_imagem === 1 ||
      item?.possui_imagem === '1';

    const estoqueBaixo = estoque <= estoqueMinimo;

    return (
      <View style={styles.card}>

        {/* IMAGEM */}

        <View style={styles.imageContainer}>

          {possuiImagem ? (
            <Image
              source={{
                uri: `data:${item.imagem_tipo};base64,${item.imagem_base64}`,
              }}
              style={styles.image}
              resizeMode="cover"
              onError={(error) => {
                console.log(
                  `Erro ao carregar imagem do produto ${item.id}:`,
                  error.nativeEvent.error
                );
              }}
            />
          ) : (
            <View style={styles.noImage}>
              <Ionicons
                name="image-outline"
                size={40}
                color="#94A3B8"
              />

              <Text style={styles.noImageText}>
                Sem imagem
              </Text>
            </View>
          )}

        
          {/* STATUS */}

          <View
            style={[
              styles.statusBadge,
              estoqueBaixo
                ? styles.statusLow
                : styles.statusAvailable,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                estoqueBaixo
                  ? styles.dotLow
                  : styles.dotAvailable,
              ]}
            />

            <Text
              style={[
                styles.statusText,
                estoqueBaixo
                  ? styles.statusTextLow
                  : styles.statusTextAvailable,
              ]}
            >
              {estoqueBaixo
                ? 'Baixo'
                : 'Disponível'}
            </Text>
          </View>

        </View>

        {/* INFORMAÇÕES */}

        <View style={styles.cardContent}>

          <Text
            style={styles.category}
            numberOfLines={1}
          >
            {item?.produto_categoria ||
              'Sem categoria'}
          </Text>

          <Text
            style={styles.name}
            numberOfLines={2}
          >
            {item?.produto_nome ||
              'Produto sem nome'}
          </Text>

          {/* PREÇO */}

          <Text style={styles.price}>
            R${' '}
            {preco
              .toFixed(2)
              .replace('.', ',')}
          </Text>

          {/* ESTOQUE */}

          <View style={styles.stockRow}>

            <View style={styles.stockInfo}>

              <Ionicons
                name="cube-outline"
                size={15}
                color="#094F63"
              />

              <Text style={styles.stockText}>
                {estoque} em estoque
              </Text>

            </View>

            <View style={styles.minimumContainer}>
              <Text style={styles.minimumText}>
                Mín. {estoqueMinimo}
              </Text>
            </View>

          </View>

          {/* LOCALIZAÇÃO */}

          <View style={styles.locationRow}>

            <Ionicons
              name="location-outline"
              size={14}
              color="#94A3B8"
            />

            <Text
              style={styles.locationText}
              numberOfLines={1}
            >
              {item?.produto_localizacao ||
                'Sem localização'}
            </Text>

          </View>

        </View>

      </View>
    );
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>

        <View style={styles.loadingCircle}>
          <ActivityIndicator
            size="large"
            color="#094F63"
          />
        </View>

        <Text style={styles.loadingText}>
          Carregando produtos...
        </Text>

      </View>
    );
  }

  // ======================================================
  // TELA
  // ======================================================

  return (
    <View style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <View>

          <Text style={styles.greeting}>
            Estoque
          </Text>

          <Text style={styles.title}>
            Produtos
          </Text>

        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadProducts}
          activeOpacity={0.8}
        >
          <Ionicons
            name="refresh-outline"
            size={22}
            color="#FFFFFF"
          />
        </TouchableOpacity>

      </View>

      {/* PESQUISA */}

      <View style={styles.searchContainer}>

        <Ionicons
          name="search-outline"
          size={20}
          color="#94A3B8"
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar produtos..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {search.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearch('')}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color="#94A3B8"
            />
          </TouchableOpacity>
        )}

      </View>

      {/* TÍTULO DA LISTA */}

      <View style={styles.listHeader}>

        <View>

          <Text style={styles.sectionTitle}>
            Seus produtos
          </Text>

          <Text style={styles.productCount}>
            {filteredProducts.length}{' '}
            {filteredProducts.length === 1
              ? 'produto'
              : 'produtos'}
          </Text>

        </View>

        <TouchableOpacity
          style={styles.filterButton}
          activeOpacity={0.8}
        >
          <Ionicons
            name="options-outline"
            size={18}
            color="#094F63"
          />

          <Text style={styles.filterText}>
            Filtrar
          </Text>
        </TouchableOpacity>

      </View>

      {/* LISTA */}

      <FlatList
        data={filteredProducts}
        numColumns={2}

        keyExtractor={(item, index) =>
          item?.id != null
            ? String(item.id)
            : String(index)
        }

        showsVerticalScrollIndicator={false}

        renderItem={renderProduct}

        columnWrapperStyle={styles.columnWrapper}

        contentContainerStyle={
          filteredProducts.length === 0
            ? styles.emptyList
            : styles.list
        }

        ListEmptyComponent={
          <View style={styles.emptyContainer}>

            <View style={styles.emptyIcon}>
              <Ionicons
                name="cube-outline"
                size={45}
                color="#094F63"
              />
            </View>

            <Text style={styles.emptyTitle}>
              Nenhum produto encontrado
            </Text>

            <Text style={styles.emptyText}>
              {search.trim()
                ? 'Tente pesquisar por outro nome, categoria ou localização.'
                : 'Ainda não existem produtos cadastrados.'}
            </Text>

          </View>
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({

  // ======================================================
  // TELA
  // ======================================================

  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
  },

  // ======================================================
  // LOADING
  // ======================================================

  loadingContainer: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingCircle: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: '#E2F0F4',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 15,
  },

  // ======================================================
  // HEADER
  // ======================================================

  header: {
    marginTop: 52,
    marginBottom: 18,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greeting: {
    color: '#64748B',
    fontSize: 13,
    marginBottom: 2,
  },

  title: {
    color: '#094F63',
    fontSize: 29,
    fontWeight: 'bold',
  },

  refreshButton: {
    width: 46,
    height: 46,

    borderRadius: 15,

    backgroundColor: '#094F63',

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#094F63',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5,

    elevation: 4,
  },

  // ======================================================
  // PESQUISA
  // ======================================================

  searchContainer: {
    height: 52,

    backgroundColor: '#FFFFFF',

    borderRadius: 16,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 15,

    borderWidth: 1,
    borderColor: '#E2E8F0',

    marginBottom: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 5,

    elevation: 1,
  },

  searchInput: {
    flex: 1,

    marginLeft: 9,

    color: '#0F172A',

    fontSize: 14,
  },

  // ======================================================
  // CABEÇALHO DA LISTA
  // ======================================================

  listHeader: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginBottom: 14,
  },

  sectionTitle: {
    color: '#0F172A',

    fontSize: 18,

    fontWeight: 'bold',
  },

  productCount: {
    color: '#94A3B8',

    fontSize: 11,

    marginTop: 3,
  },

  filterButton: {
    height: 36,

    paddingHorizontal: 12,

    borderRadius: 11,

    backgroundColor: '#E2F0F4',

    flexDirection: 'row',

    alignItems: 'center',

    gap: 5,
  },

  filterText: {
    color: '#094F63',

    fontSize: 12,

    fontWeight: '600',
  },

  // ======================================================
  // LISTA
  // ======================================================

  list: {
    paddingBottom: 30,
  },

  columnWrapper: {
    justifyContent: 'space-between',
  },

  emptyList: {
    flexGrow: 1,
  },

  // ======================================================
  // CARD
  // ======================================================

  card: {
    width: '48.2%',

    backgroundColor: '#FFFFFF',

    borderRadius: 18,

    marginBottom: 14,

    overflow: 'hidden',

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.06,

    shadowRadius: 6,

    elevation: 3,
  },

  // ======================================================
  // IMAGEM
  // ======================================================

  imageContainer: {
    width: '100%',
    height: 145,

    backgroundColor: '#E2F0F4',

    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  noImage: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    backgroundColor: '#E2F0F4',
  },

  noImageText: {
    color: '#94A3B8',

    fontSize: 10,

    marginTop: 5,
  },

  // ======================================================
  // STATUS
  // ======================================================

  statusBadge: {
    position: 'absolute',

    left: 8,
    bottom: 8,

    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 8,

    flexDirection: 'row',

    alignItems: 'center',
  },

  statusAvailable: {
    backgroundColor: '#E2F0F4',
  },

  statusLow: {
    backgroundColor: '#FEE2E2',
  },

  statusDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    marginRight: 5,
  },

  dotAvailable: {
    backgroundColor: '#0F766E',
  },

  dotLow: {
    backgroundColor: '#DC2626',
  },

  statusText: {
    fontSize: 9,

    fontWeight: 'bold',
  },

  statusTextAvailable: {
    color: '#0F766E',
  },

  statusTextLow: {
    color: '#DC2626',
  },

  // ======================================================
  // CONTEÚDO
  // ======================================================

  cardContent: {
    padding: 12,
  },

  category: {
    color: '#94A3B8',

    fontSize: 9,

    fontWeight: '600',

    textTransform: 'uppercase',

    marginBottom: 4,
  },

  name: {
    color: '#0F172A',

    fontSize: 14,

    fontWeight: 'bold',

    lineHeight: 18,

    minHeight: 36,
  },

  // ======================================================
  // PREÇO
  // ======================================================

  price: {
    color: '#094F63',

    fontSize: 17,

    fontWeight: 'bold',

    marginTop: 8,
  },

  // ======================================================
  // ESTOQUE
  // ======================================================

  stockRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginTop: 9,
  },

  stockInfo: {
    flexDirection: 'row',

    alignItems: 'center',

    flex: 1,
  },

  stockText: {
    color: '#64748B',

    fontSize: 9,

    marginLeft: 4,

    fontWeight: '500',
  },

  minimumContainer: {
    backgroundColor: '#F1F5F9',

    paddingHorizontal: 5,

    paddingVertical: 3,

    borderRadius: 5,
  },

  minimumText: {
    color: '#94A3B8',

    fontSize: 8,

    fontWeight: '600',
  },

  // ======================================================
  // LOCALIZAÇÃO
  // ======================================================

  locationRow: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 8,

    paddingTop: 7,

    borderTopWidth: 1,

    borderTopColor: '#F1F5F9',
  },

  locationText: {
    color: '#94A3B8',

    fontSize: 9,

    marginLeft: 3,

    flex: 1,
  },

  // ======================================================
  // LISTA VAZIA
  // ======================================================

  emptyContainer: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 85,
    height: 85,

    borderRadius: 43,

    backgroundColor: '#E2F0F4',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 18,
  },

  emptyTitle: {
    color: '#0F172A',

    fontSize: 17,

    fontWeight: 'bold',

    textAlign: 'center',
  },

  emptyText: {
    color: '#64748B',

    fontSize: 13,

    marginTop: 7,

    textAlign: 'center',

    lineHeight: 19,
  },

});