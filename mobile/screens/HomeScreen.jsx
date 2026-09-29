import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import api from '../src/services/api';

export default function HomeScreen({ navigation }) {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    recentActivities: [],
  });

  const loadDashboard = async () => {
    try {
      const response = await api.get('/api/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.log('Erro ao carregar Dashboard:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Bem-vindo</Text>
          <Text style={styles.userName}>Sistema de Estoque</Text>
        </View>

        <TouchableOpacity style={styles.notification}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* CARD PRINCIPAL */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>
          Produtos em Estoque
        </Text>

        <Text style={styles.balanceValue}>
          {dashboardData.totalProducts}
        </Text>

        <View style={styles.balanceFooter}>
          <Ionicons
            name="checkmark-circle"
            size={18}
            color="#86EFAC"
          />

          <Text style={styles.balanceGrowth}>
            Atualizado com o BD
          </Text>
        </View>
      </View>

      {/* CARDS DE RESUMO */}
      <View style={styles.cardsContainer}>
        <View style={styles.smallCard}>
          <View style={styles.iconBlue}>
            <Ionicons
              name="cube"
              size={24}
              color="#094F63"
            />
          </View>

          <Text style={styles.cardNumber}>
            {dashboardData.totalProducts}
          </Text>

          <Text style={styles.cardLabel}>
            Unidades Totais
          </Text>
        </View>

        <View style={styles.smallCard}>
          <View style={styles.iconRed}>
            <Ionicons
              name="alert-circle"
              size={24}
              color="#DC2626"
            />
          </View>

          <Text style={styles.cardNumber}>
            {dashboardData.lowStockCount}
          </Text>

          <Text style={styles.cardLabel}>
            Estoque Baixo
          </Text>
        </View>
      </View>

      {/* OPERAÇÕES */}
      <Text style={styles.sectionTitle}>
        Operações
      </Text>

      <TouchableOpacity
        style={styles.actionButtonBlue}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Produtos')}
      >
        <View style={styles.buttonContent}>
          <Ionicons
            name="cube-outline"
            size={26}
            color="#FFFFFF"
          />

          <View>
            <Text style={styles.buttonTitle}>
              Produtos
            </Text>

            <Text style={styles.buttonSubtitle}>
              Visualizar estoque completo
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={22}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButtonGreen}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Entrada')}
      >
        <View style={styles.buttonContent}>
          <Ionicons
            name="arrow-down-circle-outline"
            size={26}
            color="#FFFFFF"
          />

          <View>
            <Text style={styles.buttonTitle}>
              Entrada de Estoque
            </Text>

            <Text style={styles.buttonSubtitle}>
              Registrar novos produtos
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={22}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.actionButtonRed}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Saída')}
      >
        <View style={styles.buttonContent}>
          <Ionicons
            name="arrow-up-circle-outline"
            size={26}
            color="#FFFFFF"
          />

          <View>
            <Text style={styles.buttonTitle}>
              Saída de Estoque
            </Text>

            <Text style={styles.buttonSubtitle}>
              Registrar retirada
            </Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={22}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  welcome: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '500',
  },

  userName: {
    color: '#094F63',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 3,
  },

  notification: {
    width: 50,
    height: 50,
    backgroundColor: '#1E436A',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  /* CARD PRINCIPAL */

  balanceCard: {
    backgroundColor: '#1E436A',
    borderRadius: 30,
    padding: 25,
    marginTop: 30,

    shadowColor: '#094F63',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.20,
    shadowRadius: 10,
    elevation: 5,
  },

  balanceLabel: {
    color: '#D9EEF3',
    fontSize: 16,
    fontWeight: '500',
  },

  balanceValue: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: 'bold',
    marginTop: 10,
  },

  balanceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  balanceGrowth: {
    color: '#D1FAE5',
    marginLeft: 6,
    fontWeight: '600',
  },

  /* CARDS PEQUENOS */

  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },

  smallCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    borderRadius: 22,
    padding: 20,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },

  iconBlue: {
    width: 50,
    height: 50,
    backgroundColor: '#E2F0F4',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconRed: {
    width: 50,
    height: 50,
    backgroundColor: '#FEF2F2',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardNumber: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 15,
  },

  cardLabel: {
    color: '#64748B',
    marginTop: 5,
    fontSize: 13,
  },

  /* TÍTULOS */

  sectionTitle: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 35,
    marginBottom: 18,
  },

  /* BOTÕES */

  actionButtonBlue: {
    backgroundColor: '#1E436A',
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#094F63',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 3,
  },

  actionButtonGreen: {
    backgroundColor: '#144f17',
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#094F63',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 3,
  },

  actionButtonRed: {
    backgroundColor: '#630909',
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#094F63',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 3,
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  buttonTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  buttonSubtitle: {
    color: '#D5E8ED',
    marginTop: 3,
    fontSize: 13,
  },

  /* ATIVIDADES */

  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,

    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  activityText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '500',
  },
});