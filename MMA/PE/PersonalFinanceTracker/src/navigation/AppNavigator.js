import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../theme';
import HomeScreen from '../views/HomeScreen';
import LoginScreen from '../views/LoginScreen';
import TransactionDetailScreen from '../views/TransactionDetailScreen';
import TransactionFormScreen from '../views/TransactionFormScreen';
import TransactionListScreen from '../views/TransactionListScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ symbol, color }) {
  return <Text style={[styles.tabIcon, { color }]}>{symbol}</Text>;
}

// Hai tab chính sau khi đăng nhập: Dashboard và danh sách giao dịch.
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: COLORS.primary }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabIcon symbol="⌂" color={color} />,
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionListScreen}
        options={{
          tabBarIcon: ({ color }) => <TabIcon symbol="≡" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

// Chọn nhóm màn hình theo trạng thái đăng nhập:
// - Chưa đăng nhập: chỉ có màn hình Login.
// - Đã đăng nhập: chỉ có các màn hình chính.
// Khi logout, các màn hình đã xác thực bị gỡ khỏi navigator nên không thể bấm Back để quay lại.
export default function AppNavigator() {
  const { user, isLoading, startupError } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (startupError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{startupError}</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen
              name="TransactionDetail"
              component={TransactionDetailScreen}
              options={{ title: 'Transaction Detail' }}
            />
            <Stack.Screen
              name="TransactionForm"
              component={TransactionFormScreen}
              options={({ route }) => ({
                title: route.params?.transactionId ? 'Edit Transaction' : 'Add Transaction',
              })}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.expense,
    fontSize: 16,
    textAlign: 'center',
  },
  tabIcon: {
    fontSize: 22,
  },
});
