import { AuthProvider } from './src/context/AuthContext';
import Nav from './src/navigation';

export default function App() {
  return (
    <AuthProvider>
      <Nav />
    </AuthProvider>
  );
}