import AllTime from './components/AllTime'
import {QueryClient, QueryClientProvider} from 'react-query';
// Initialze the client
const queryClient = new QueryClient();

function App() {
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <AllTime />

    </QueryClientProvider>
    </>
  )
}

export default App
