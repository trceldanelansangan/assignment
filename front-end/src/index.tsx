import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import UserDataContextProvider from './store/userContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
<UserDataContextProvider>
  <App />
</UserDataContextProvider>
);