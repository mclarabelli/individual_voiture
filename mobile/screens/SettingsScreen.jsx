import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import api from '../src/services/api';

export default function SettingsScreen({ navigation }) {

  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const [userData, setUserData] = useState({
    name: 'Carregando...',
    role: 'Operador de Estoque',
    email: 'carregando...',
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {

      const response = await api.post('/login', {
        email: 'lucas@empresa.com',
        password: '123456',
      });

      if (response.data.success) {
        setUserData(response.data.user);
      }

    } catch (error) {
      console.log(
        'Erro ao carregar dados do usuário:',
        error
      );
    }
  };

  const handleLogout = () => {

    Alert.alert(
      'Sair da Conta',
      'Deseja realmente sair da aplicação?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {

            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Login',
                },
              ],
            });

          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* ================= HEADER ================= */}

      <View style={styles.header}>

        <Text style={styles.title}>
          Configurações
        </Text>

        <Text style={styles.subtitle}>
          Gerencie preferências do sistema
        </Text>

      </View>


      {/* ================= PERFIL ================= */}

      <View style={styles.profileCard}>

        <Image
          source={{
            uri:
              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop',
          }}
          style={styles.avatar}
        />

        <View style={styles.profileInfo}>

          <Text style={styles.userName}>
            {userData.name}
          </Text>

          <Text style={styles.userRole}>
            {userData.role}
          </Text>

          <Text style={styles.userEmail}>
            {userData.email}
          </Text>

        </View>

        <TouchableOpacity style={styles.editButton}>

          <Ionicons
            name="create-outline"
            size={21}
            color="#FFFFFF"
          />

        </TouchableOpacity>

      </View>


      {/* ================= PREFERÊNCIAS ================= */}

      <Text style={styles.sectionTitle}>
        Preferências
      </Text>


      <View style={styles.optionCard}>

        <View style={styles.optionLeft}>

          <View style={styles.iconBlue}>

            <Ionicons
              name="moon-outline"
              size={22}
              color="#094F63"
            />

          </View>

          <View>

            <Text style={styles.optionTitle}>
              Modo Escuro
            </Text>

            <Text style={styles.optionSubtitle}>
              Tema visual do aplicativo
            </Text>

          </View>

        </View>

        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{
            false: '#CBD5E1',
            true: '#7FAEBC',
          }}
          thumbColor={
            darkMode
              ? '#094F63'
              : '#F8FAFC'
          }
        />

      </View>


      <View style={styles.optionCard}>

        <View style={styles.optionLeft}>

          <View style={styles.iconGreen}>

            <Ionicons
              name="notifications-outline"
              size={22}
              color="#16A34A"
            />

          </View>

          <View>

            <Text style={styles.optionTitle}>
              Notificações
            </Text>

            <Text style={styles.optionSubtitle}>
              Alertas do sistema
            </Text>

          </View>

        </View>

        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{
            false: '#CBD5E1',
            true: '#86EFAC',
          }}
          thumbColor={
            notifications
              ? '#16A34A'
              : '#F8FAFC'
          }
        />

      </View>


      {/* ================= SEGURANÇA ================= */}

      <Text style={styles.sectionTitle}>
        Conta e Segurança
      </Text>


      <TouchableOpacity style={styles.menuCard}>

        <View style={styles.menuLeft}>

          <View style={styles.iconBlue}>

            <Ionicons
              name="lock-closed-outline"
              size={22}
              color="#094F63"
            />

          </View>

          <View>

            <Text style={styles.menuTitle}>
              Alterar Senha
            </Text>

            <Text style={styles.menuSubtitle}>
              Atualizar credenciais
            </Text>

          </View>

        </View>

        <Ionicons
          name="chevron-forward"
          size={22}
          color="#94A3B8"
        />

      </TouchableOpacity>


      <TouchableOpacity style={styles.menuCard}>

        <View style={styles.menuLeft}>

          <View style={styles.iconGreen}>

            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color="#16A34A"
            />

          </View>

          <View>

            <Text style={styles.menuTitle}>
              Privacidade
            </Text>

            <Text style={styles.menuSubtitle}>
              Configurações de acesso
            </Text>

          </View>

        </View>

        <Ionicons
          name="chevron-forward"
          size={22}
          color="#94A3B8"
        />

      </TouchableOpacity>


      {/* ================= LOGOUT ================= */}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >

        <Ionicons
          name="log-out-outline"
          size={24}
          color="#FFFFFF"
        />

        <Text style={styles.logoutText}>
          Sair da Conta
        </Text>

      </TouchableOpacity>


      <View style={{ height: 50 }} />

    </ScrollView>
  );
}


/* ======================================================
   ESTILOS
====================================================== */

const styles = StyleSheet.create({

  /* ================= CONTAINER ================= */

  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 20,
  },


  /* ================= HEADER ================= */

  header: {
    marginTop: 55,
    marginBottom: 30,
  },

  title: {
    color: '#094F63',
    fontSize: 32,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#64748B',
    marginTop: 5,
    fontSize: 15,
  },


  /* ================= PERFIL ================= */

  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,

    padding: 20,

    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#E2E8F0',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 7,

    elevation: 3,
  },

  avatar: {
    width: 78,
    height: 78,
    borderRadius: 22,
  },

  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },

  userName: {
    color: '#0F172A',
    fontSize: 21,
    fontWeight: 'bold',
  },

  userRole: {
    color: '#094F63',
    marginTop: 5,
    fontWeight: '600',
    fontSize: 14,
  },

  userEmail: {
    color: '#64748B',
    marginTop: 6,
    fontSize: 13,
  },

  editButton: {
    width: 46,
    height: 46,

    backgroundColor: '#094F63',

    borderRadius: 15,

    justifyContent: 'center',
    alignItems: 'center',

    marginLeft: 8,
  },


  /* ================= SEÇÕES ================= */

  sectionTitle: {
    color: '#0F172A',

    fontSize: 21,
    fontWeight: 'bold',

    marginTop: 35,
    marginBottom: 18,
  },


  /* ================= OPÇÕES ================= */

  optionCard: {
    backgroundColor: '#FFFFFF',

    borderRadius: 22,

    padding: 18,
    marginBottom: 14,

    flexDirection: 'row',
    justifyContent: 'space-between',
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

  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',

    flex: 1,
  },

  optionTitle: {
    color: '#0F172A',

    fontSize: 17,
    fontWeight: 'bold',
  },

  optionSubtitle: {
    color: '#64748B',

    marginTop: 4,

    fontSize: 13,
  },


  /* ================= MENU ================= */

  menuCard: {
    backgroundColor: '#FFFFFF',

    borderRadius: 22,

    padding: 18,
    marginBottom: 14,

    flexDirection: 'row',
    justifyContent: 'space-between',
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

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',

    flex: 1,
  },

  menuTitle: {
    color: '#0F172A',

    fontSize: 17,
    fontWeight: 'bold',
  },

  menuSubtitle: {
    color: '#64748B',

    marginTop: 4,

    fontSize: 13,
  },


  /* ================= ÍCONES ================= */

  iconBlue: {
    width: 50,
    height: 50,

    backgroundColor: '#E2F0F4',

    borderRadius: 16,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 15,
  },

  iconGreen: {
    width: 50,
    height: 50,

    backgroundColor: '#DCFCE7',

    borderRadius: 16,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 15,
  },


  /* ================= LOGOUT ================= */

  logoutButton: {
    backgroundColor: '#DC2626',

    height: 65,

    borderRadius: 22,

    marginTop: 35,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    gap: 10,

    shadowColor: '#DC2626',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    elevation: 3,
  },

  logoutText: {
    color: '#FFFFFF',

    fontSize: 18,
    fontWeight: 'bold',
  },

});