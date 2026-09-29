import React, { useState } from 'react';

import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import api from '../src/services/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !senha) {
      Alert.alert(
        'Atenção',
        'Preencha o e-mail e a senha.'
      );
      return;
    }

    try {
      const resposta = await api.post('/api/login_mobile', {
        email: email.trim(),
        senha: senha,
      });

      if (resposta.data.sucesso) {
        navigation.replace('App', {
          funcionario: resposta.data.funcionario,
        });
      } else {
        Alert.alert(
          'Login inválido',
          resposta.data.mensagem ||
            'E-mail ou senha inválidos.'
        );
      }
    } catch (erro) {
      console.log('Erro no login:', erro);

      Alert.alert(
        'Erro',
        erro.response?.data?.mensagem ||
          'Falha ao conectar ao servidor.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* FORMAS DO FUNDO */}

        <View style={styles.backgroundShape1} />
        <View style={styles.backgroundShape2} />

        {/* BOTÃO VOLTAR */}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={18}
            color="#f1f5f9"
          />

          <Text style={styles.backText}>
            Voltar
          </Text>
        </TouchableOpacity>

        {/* LOGO */}

        <View style={styles.logoArea}>

          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo_voiture_estoque.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.brand}>
            Voiture
          </Text>

          <Text style={styles.brandSubtitle}>
            Gestão de Estoque
          </Text>

        </View>

        {/* CARD */}

        <View style={styles.card}>

          <Text style={styles.title}>
            Bem-vindo!
          </Text>

          <Text style={styles.description}>
            Entre na sua conta para continuar
          </Text>

          {/* E-MAIL */}

          <View style={styles.field}>

            <Text style={styles.label}>
              E-mail
            </Text>

            <View style={styles.inputContainer}>

              <Ionicons
                name="mail-outline"
                size={19}
                color="#094F63"
              />

              <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />

            </View>

          </View>

          {/* SENHA */}

          <View style={styles.field}>

            <Text style={styles.label}>
              Senha
            </Text>

            <View style={styles.inputContainer}>

              <Ionicons
                name="lock-closed-outline"
                size={19}
                color="#094F63"
              />

              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#94A3B8"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!mostrarSenha}
                autoCapitalize="none"
              />

              <TouchableOpacity
                onPress={() =>
                  setMostrarSenha(!mostrarSenha)
                }
                activeOpacity={0.7}
              >
                <Ionicons
                  name={
                    mostrarSenha
                      ? 'eye-off-outline'
                      : 'eye-outline'
                  }
                  size={20}
                  color="#094F63"
                />
              </TouchableOpacity>

            </View>

          </View>

          {/* OPÇÕES */}

          <View style={styles.options}>

            <View style={styles.rememberContainer}>

              <View style={styles.checkbox} />

              <Text style={styles.rememberText}>
                Lembrar de mim
              </Text>

            </View>

            <TouchableOpacity>
              <Text style={styles.forgotText}>
                Esqueci a senha
              </Text>
            </TouchableOpacity>

          </View>

          {/* BOTÃO ENTRAR */}

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            activeOpacity={0.8}
          >

            <Text style={styles.buttonText}>
              Entrar
            </Text>

            <Ionicons
              name="arrow-forward"
              size={19}
              color="#f1f5f9"
            />

          </TouchableOpacity>

          {/* DIVISOR */}

          <View style={styles.dividerContainer}>

            <View style={styles.divider} />

            <Text style={styles.dividerText}>
              ou entre com
            </Text>

            <View style={styles.divider} />

          </View>

          {/* REDES SOCIAIS */}

          <View style={styles.socialContainer}>

            <TouchableOpacity style={styles.socialButton}>
              <Ionicons
                name="logo-google"
                size={21}
                color="#094F63"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <Ionicons
                name="logo-apple"
                size={21}
                color="#094F63"
              />
            </TouchableOpacity>

          </View>

          {/* RODAPÉ DO CARD */}

          <Text style={styles.footerQuestion}>
            Ainda não possui uma conta?
          </Text>

          <TouchableOpacity>
            <Text style={styles.footerLink}>
              Entre em contato com o administrador
            </Text>
          </TouchableOpacity>

        </View>

        {/* RODAPÉ */}

        <Text style={styles.footer}>
          VOITURE • GESTÃO DE ESTOQUE
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  /* =========================
     TELA
  ========================= */

  container: {
    flex: 1,
    backgroundColor: '#1E436A',
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 30,
    overflow: 'hidden',
  },

  /* =========================
     FORMAS DO FUNDO
  ========================= */

  backgroundShape1: {
    position: 'absolute',

    width: 230,
    height: 230,

    borderRadius: 115,

    backgroundColor: '#294F7B',

    top: -85,
    right: -65,
  },

  backgroundShape2: {
    position: 'absolute',

    width: 260,
    height: 260,

    borderRadius: 130,

    backgroundColor: '#16385E',

    top: -145,
    left: -115,
  },

  /* =========================
     BOTÃO VOLTAR
  ========================= */

  backButton: {
    position: 'absolute',

    top: 28,
    left: 18,

    height: 50,

    paddingHorizontal: 16,

    borderRadius: 28,

    backgroundColor: '#16385E',

    flexDirection: 'row',

    alignItems: 'center',

    zIndex: 10,
  },

  backText: {
    color: '#f1f5f9',

    fontSize: 13,

    fontWeight: '600',

    marginLeft: 2,
  },

  /* =========================
     LOGO
  ========================= */

  logoArea: {
    alignItems: 'center',

    marginTop: 55,

    marginBottom: 25,
  },

  logoContainer: {
    width: 75,
    height: 75,

    borderRadius: 38,

    backgroundColor: '#f1f5f9',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 8,

    /*
     * ESSENCIAL:
     * corta qualquer parte da imagem
     * que ultrapasse o círculo.
     */
    overflow: 'hidden',
  },

  logo: {
    width: 68,
    height: 68,

    /*
     * Mantém a própria imagem circular.
     */
    borderRadius: 34,
  },

  brand: {
    color: '#f1f5f9',

    fontSize: 25,

    fontWeight: 'bold',
  },

  brandSubtitle: {
    color: '#f1f5f9',

    fontSize: 12,

    marginTop: 2,

    opacity: 0.85,
  },

  /* =========================
     CARD
  ========================= */

  card: {
    width: '100%',

    backgroundColor: '#f1f5f9',

    borderRadius: 25,

    paddingHorizontal: 20,

    paddingTop: 28,

    paddingBottom: 25,

    elevation: 8,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.18,

    shadowRadius: 10,
  },

  title: {
    textAlign: 'center',

    color: '#1E436A',

    fontSize: 25,

    fontWeight: 'bold',

    marginBottom: 5,
  },

  description: {
    textAlign: 'center',

    color: '#64748B',

    fontSize: 13,

    marginBottom: 25,
  },

  /* =========================
     CAMPOS
  ========================= */

  field: {
    marginBottom: 17,
  },

  label: {
    color: '#1E436A',

    fontSize: 13,

    fontWeight: '600',

    marginLeft: 5,

    marginBottom: -7,

    zIndex: 2,

    backgroundColor: '#f1f5f9',

    alignSelf: 'flex-start',

    paddingHorizontal: 4,
  },

  inputContainer: {
    height: 55,

    borderWidth: 1.5,

    borderColor: '#A8A8A8',

    borderRadius: 12,

    backgroundColor: '#f1f5f9',

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 12,
  },

  input: {
    flex: 1,

    color: '#1E293B',

    fontSize: 14,

    marginLeft: 9,
  },

  /* =========================
     OPÇÕES
  ========================= */

  options: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginTop: 1,

    marginBottom: 20,
  },

  rememberContainer: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  checkbox: {
    width: 17,
    height: 17,

    borderWidth: 1.5,

    borderColor: '#A8A8A8',

    borderRadius: 4,

    marginRight: 6,
  },

  rememberText: {
    color: '#64748B',

    fontSize: 11,
  },

  forgotText: {
    color: '#094F63',

    fontSize: 11,

    fontWeight: 'bold',
  },

  /* =========================
     BOTÃO
  ========================= */

  button: {
    height: 53,

    backgroundColor: '#1E436A',

    borderRadius: 11,

    flexDirection: 'row',

    justifyContent: 'center',

    alignItems: 'center',

    gap: 9,
  },

  buttonText: {
    color: '#f1f5f9',

    fontSize: 16,

    fontWeight: 'bold',
  },

  /* =========================
     DIVISOR
  ========================= */

  dividerContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    marginVertical: 24,
  },

  divider: {
    flex: 1,

    height: 1,

    backgroundColor: '#A8A8A8',
  },

  dividerText: {
    color: '#64748B',

    fontSize: 10,

    marginHorizontal: 12,
  },

  /* =========================
     REDES SOCIAIS
  ========================= */

  socialContainer: {
    flexDirection: 'row',

    justifyContent: 'center',

    gap: 18,

    marginBottom: 18,
  },

  socialButton: {
    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: '#FFFFFF',

    borderWidth: 1,

    borderColor: '#D1D5DB',

    justifyContent: 'center',

    alignItems: 'center',
  },

  /* =========================
     RODAPÉ DO CARD
  ========================= */

  footerQuestion: {
    textAlign: 'center',

    color: '#64748B',

    fontSize: 10,

    marginBottom: 4,
  },

  footerLink: {
    textAlign: 'center',

    color: '#094F63',

    fontSize: 11,

    fontWeight: 'bold',
  },

  /* =========================
     RODAPÉ DA TELA
  ========================= */

  footer: {
    textAlign: 'center',

    color: '#f1f5f9',

    fontSize: 9,

    fontWeight: 'bold',

    letterSpacing: 1,

    marginTop: 20,

    opacity: 0.75,
  },

});